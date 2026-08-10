export interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  category: string;
  created_at: Date;
  updated_at: Date;
}

export interface ProductInput {
  name: string;
  sku?: string;
  quantity: number;
  price: number;
  category: string;
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'SEARCH';
  entity_type: string;
  entity_id: string;
  entity_name?: string;
  details?: string;
  status: 'SUCCESS' | 'FAILURE';
  changes?: Array<{ field: string; oldValue: unknown; newValue: unknown }>;
  created_at: Date;
}

export interface AuditLogInput {
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'SEARCH';
  entity_type: string;
  entity_id: string;
  entity_name?: string;
  details?: string;
  status: 'SUCCESS' | 'FAILURE';
  changes?: Array<{ field: string; oldValue: unknown; newValue: unknown }>;
}
