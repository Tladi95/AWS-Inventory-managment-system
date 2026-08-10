import express, { Request, Response } from 'express';
import { ProductRepository } from '../repositories/ProductRepository.js';
import { AuditRepository } from '../repositories/AuditRepository.js';
import type { ProductInput } from '../types/index.js';

const router = express.Router();

// Create product
router.post('/', async (req: Request, res: Response) => {
  try {
    const input: ProductInput = req.body;

    if (!input.name || input.quantity === undefined || input.price === undefined || !input.category) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const product = await ProductRepository.create(input);

    await AuditRepository.create({
      action: 'CREATE',
      entity_type: 'Product',
      entity_id: product.id,
      entity_name: product.name,
      status: 'SUCCESS',
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Get all products
router.get('/', async (req: Request, res: Response) => {
  try {
    const products = await ProductRepository.getAll();

    await AuditRepository.create({
      action: 'READ',
      entity_type: 'Product',
      entity_id: 'all',
      entity_name: 'All Products',
      status: 'SUCCESS',
    });

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Search products
router.get('/search/:query', async (req: Request, res: Response) => {
  try {
    const { query: searchQuery } = req.params;
    const results = await ProductRepository.search(searchQuery);

    await AuditRepository.create({
      action: 'SEARCH',
      entity_type: 'Product',
      entity_id: searchQuery,
      entity_name: `Search: ${searchQuery}`,
      status: 'SUCCESS',
      details: `Found ${results.length} results`,
    });

    res.json(results);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Failed to search products' });
  }
});

// Filter by category
router.get('/category/:category', async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const products = await ProductRepository.filterByCategory(category);
    res.json(products);
  } catch (error) {
    console.error('Error filtering by category:', error);
    res.status(500).json({ error: 'Failed to filter products' });
  }
});

// Get categories
router.get('/categories/all', async (req: Request, res: Response) => {
  try {
    const categories = await ProductRepository.getCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get low stock products
router.get('/low-stock/:threshold', async (req: Request, res: Response) => {
  try {
    const threshold = parseInt(req.params.threshold) || 10;
    const products = await ProductRepository.getLowStockProducts(threshold);
    res.json(products);
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    res.status(500).json({ error: 'Failed to fetch low stock products' });
  }
});

// Get product by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await ProductRepository.getById(id);

    await AuditRepository.create({
      action: 'READ',
      entity_type: 'Product',
      entity_id: id,
      entity_name: product?.name || 'Unknown',
      status: product ? 'SUCCESS' : 'FAILURE',
    });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Update product
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const input: Partial<ProductInput> = req.body;

    const oldProduct = await ProductRepository.getById(id);
    if (!oldProduct) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const updatedProduct = await ProductRepository.update(id, input);

    const changes = [];
    if (input.name && input.name !== oldProduct.name) {
      changes.push({ field: 'name', oldValue: oldProduct.name, newValue: input.name });
    }
    if (input.quantity !== undefined && input.quantity !== oldProduct.quantity) {
      changes.push({ field: 'quantity', oldValue: oldProduct.quantity, newValue: input.quantity });
    }
    if (input.price && input.price !== oldProduct.price) {
      changes.push({ field: 'price', oldValue: oldProduct.price, newValue: input.price });
    }
    if (input.category && input.category !== oldProduct.category) {
      changes.push({ field: 'category', oldValue: oldProduct.category, newValue: input.category });
    }

    await AuditRepository.create({
      action: 'UPDATE',
      entity_type: 'Product',
      entity_id: id,
      entity_name: updatedProduct?.name || 'Unknown',
      status: 'SUCCESS',
      changes,
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await ProductRepository.getById(id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const deleted = await ProductRepository.delete(id);

    await AuditRepository.create({
      action: 'DELETE',
      entity_type: 'Product',
      entity_id: id,
      entity_name: product.name,
      status: 'SUCCESS',
    });

    res.json({ success: deleted });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
