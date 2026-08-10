import React, { useState } from 'react';
import type { AuditLog } from '../types/Audit';

interface AuditLogViewerProps {
  logs: AuditLog[];
  onExport?: (csv: string) => void;
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({
  logs,
  onExport,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const getActionColor = (action: AuditLog['action']) => {
    const colors: Record<AuditLog['action'], string> = {
      CREATE: 'green',
      READ: 'blue',
      UPDATE: 'orange',
      DELETE: 'red',
      SEARCH: 'purple',
    };
    return colors[action];
  };

  return (
    <div className="audit-log-viewer">
      <div className="audit-header">
        <h3>Audit Log</h3>
        <div className="audit-actions">
          <span className="log-count">Total: {logs.length} entries</span>
          {onExport && (
            <button className="btn btn-secondary" onClick={() => onExport('')}>
              Export CSV
            </button>
          )}
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="empty-audit">No audit logs yet.</div>
      ) : (
        <div className="audit-list">
          {logs.slice().reverse().map((log) => (
            <div
              key={log.id}
              className="audit-entry"
              style={
                {
                  '--action-color': getActionColor(log.action),
                } as React.CSSProperties
              }
            >
              <div
                className="audit-row"
                onClick={() =>
                  setExpandedId(expandedId === log.id ? null : log.id)
                }
              >
                <span className="action-badge">{log.action}</span>
                <span className="entity">{log.entityName}</span>
                <span className="timestamp">{formatDate(log.timestamp)}</span>
                <span className={`status ${log.status.toLowerCase()}`}>
                  {log.status}
                </span>
                <span className="toggle">
                  {expandedId === log.id ? 'v' : '>'}
                </span>
              </div>

              {expandedId === log.id && (
                <div className="audit-details">
                  <p>
                    <strong>Entity Type:</strong> {log.entityType}
                  </p>
                  <p>
                    <strong>Entity ID:</strong> {log.entityId}
                  </p>
                  {log.details && (
                    <p>
                      <strong>Details:</strong> {log.details}
                    </p>
                  )}
                  {log.changes && log.changes.length > 0 && (
                    <div className="changes">
                      <strong>Changes:</strong>
                      <ul>
                        {log.changes.map((change, idx) => (
                          <li key={idx}>
                            <strong>{change.field}:</strong> {String(change.oldValue)} →{' '}
                            {String(change.newValue)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
