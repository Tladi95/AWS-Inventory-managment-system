import { v4 as uuidv4 } from 'uuid';
import { query } from '../db/connection.js';
import type { AuditLog, AuditLogInput } from '../types/index.js';

export const AuditRepository = {
  async create(input: AuditLogInput): Promise<AuditLog> {
    const id = `log_${Date.now()}_${uuidv4().substr(0, 8)}`;
    const now = new Date();

    const result = await query(
      `INSERT INTO audit_logs (id, timestamp, action, entity_type, entity_id, entity_name, details, status, changes, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        id,
        now,
        input.action,
        input.entity_type,
        input.entity_id,
        input.entity_name || null,
        input.details || null,
        input.status,
        input.changes ? JSON.stringify(input.changes) : null,
        now,
      ]
    );

    return result.rows[0] as AuditLog;
  },

  async getAll(): Promise<AuditLog[]> {
    const result = await query(
      'SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 1000'
    );
    return result.rows.map(row => ({
      ...row,
      changes: row.changes ? JSON.parse(row.changes) : undefined,
    })) as AuditLog[];
  },

  async getByEntityId(entityId: string): Promise<AuditLog[]> {
    const result = await query(
      'SELECT * FROM audit_logs WHERE entity_id = $1 ORDER BY timestamp DESC',
      [entityId]
    );
    return result.rows.map(row => ({
      ...row,
      changes: row.changes ? JSON.parse(row.changes) : undefined,
    })) as AuditLog[];
  },

  async exportAsCSV(): Promise<string> {
    const result = await query(
      'SELECT * FROM audit_logs ORDER BY timestamp DESC'
    );

    const headers = ['ID', 'Timestamp', 'Action', 'Entity Type', 'Entity ID', 'Entity Name', 'Status', 'Details'];
    const rows = result.rows.map(log => [
      log.id,
      log.timestamp,
      log.action,
      log.entity_type,
      log.entity_id,
      log.entity_name || '',
      log.status,
      log.details || '',
    ]);

    const csv = [
      headers.map(h => `"${h}"`).join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    return csv;
  },

  async clear(): Promise<void> {
    await query('DELETE FROM audit_logs');
  },
};
