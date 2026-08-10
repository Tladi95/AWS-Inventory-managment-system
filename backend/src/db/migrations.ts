import { query } from './connection.js';

export const runMigrations = async () => {
  try {
    console.log('Running database migrations...');

    // Create products table
    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        sku VARCHAR(255) UNIQUE NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create audit_logs table
    await query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id VARCHAR(255) PRIMARY KEY,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        action VARCHAR(50) NOT NULL,
        entity_type VARCHAR(100) NOT NULL,
        entity_id VARCHAR(255) NOT NULL,
        entity_name VARCHAR(255),
        details TEXT,
        status VARCHAR(50) NOT NULL,
        changes JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    await query(`CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku)`);

    console.log('Migrations completed successfully');
  } catch (err) {
    console.error('Migration error:', err);
    throw err;
  }
};

export default runMigrations;
