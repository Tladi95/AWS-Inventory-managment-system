import type { AuditLog } from '../types/Audit';
import { apiClient } from './api';

type RawAuditLog = {
  id: string;
  timestamp: string;
  action: AuditLog['action'];
  entity_type: string;
  entity_id: string;
  entity_name: string;
  status: AuditLog['status'];
  details?: string;
  changes?: AuditLog['changes'];
};

const mapLog = (log: RawAuditLog): AuditLog => ({
  id: log.id,
  timestamp: new Date(log.timestamp),
  action: log.action,
  entityType: log.entity_type,
  entityId: log.entity_id,
  entityName: log.entity_name,
  status: log.status,
  details: log.details,
  changes: log.changes,
});

export const auditService = {
  async getLogs(): Promise<AuditLog[]> {
    const data = await apiClient.get<RawAuditLog[]>('/audit');
    return data.map(mapLog);
  },

  async exportAsCSV(): Promise<void> {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/audit/export/csv`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },
};
