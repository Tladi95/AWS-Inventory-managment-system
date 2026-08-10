import { v4 as uuidv4 } from 'uuid';
import { query } from '../db/connection.js';
import type { Product, ProductInput } from '../types/index.js';

let skuCounter = 0;

const generateSKU = (): string => {
  skuCounter++;
  return `SKU-${String(skuCounter).padStart(6, '0')}`;
};

export const ProductRepository = {
  async create(input: ProductInput): Promise<Product> {
    const id = `prod_${Date.now()}_${uuidv4().substr(0, 8)}`;
    const sku = generateSKU();
    const now = new Date();

    const result = await query(
      `INSERT INTO products (id, name, sku, quantity, price, category, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [id, input.name, sku, input.quantity, input.price, input.category, now, now]
    );

    return result.rows[0] as Product;
  },

  async getAll(): Promise<Product[]> {
    const result = await query('SELECT * FROM products ORDER BY created_at DESC');
    return result.rows as Product[];
  },

  async getById(id: string): Promise<Product | null> {
    const result = await query('SELECT * FROM products WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async update(id: string, input: Partial<ProductInput>): Promise<Product | null> {
    const product = await this.getById(id);
    if (!product) return null;

    const updates: string[] = [];
    const values: unknown[] = [];
    let paramCount = 1;

    if (input.name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(input.name);
    }
    if (input.quantity !== undefined) {
      updates.push(`quantity = $${paramCount++}`);
      values.push(input.quantity);
    }
    if (input.price !== undefined) {
      updates.push(`price = $${paramCount++}`);
      values.push(input.price);
    }
    if (input.category !== undefined) {
      updates.push(`category = $${paramCount++}`);
      values.push(input.category);
    }

    updates.push(`updated_at = $${paramCount++}`);
    values.push(new Date());
    values.push(id);

    const result = await query(
      `UPDATE products SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  },

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM products WHERE id = $1', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  },

  async search(query_text: string): Promise<Product[]> {
    const searchQuery = `%${query_text.toLowerCase()}%`;
    const result = await query(
      `SELECT * FROM products WHERE LOWER(name) LIKE $1 OR LOWER(sku) LIKE $1 ORDER BY created_at DESC`,
      [searchQuery]
    );
    return result.rows as Product[];
  },

  async filterByCategory(category: string): Promise<Product[]> {
    const result = await query(
      'SELECT * FROM products WHERE category = $1 ORDER BY created_at DESC',
      [category]
    );
    return result.rows as Product[];
  },

  async getCategories(): Promise<string[]> {
    const result = await query(`
      SELECT DISTINCT category FROM products 
      WHERE category IS NOT NULL
      UNION ALL
      SELECT * FROM UNNEST($1::text[]) AS category
      WHERE category NOT IN (SELECT DISTINCT category FROM products WHERE category IS NOT NULL)
      ORDER BY category
    `, [
      ['Clothing', 'Food & Beverages', 'Electronics', 'Health & Beauty', 'Home & Garden']
    ]);
    
    return result.rows.map(row => row.category);
  },

  async getLowStockProducts(threshold: number = 10): Promise<Product[]> {
    const result = await query(
      'SELECT * FROM products WHERE quantity <= $1 ORDER BY quantity ASC',
      [threshold]
    );
    return result.rows as Product[];
  },
};
