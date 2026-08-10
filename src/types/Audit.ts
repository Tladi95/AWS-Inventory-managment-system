export interface AuditLog {
  id: string;
  timestamp: Date;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'SEARCH';
  entityType: string;
  entityId: string;
  entityName: string;
  changes?: {
    field: string;
    oldValue: unknown;
    newValue: unknown;
  }[];
  status: 'SUCCESS' | 'FAILURE';
  details?: string;
}
