import type { Product, ProductInput } from '../types/Product';
import { apiClient } from './api';

type RawProduct = Omit<Product, 'createdAt' | 'updatedAt'> & {
  created_at: string;
  updated_at: string;
};

const mapProduct = (p: RawProduct): Product => ({
  ...p,
  price: Number(p.price),
  quantity: Number(p.quantity),
  createdAt: new Date(p.created_at),
  updatedAt: new Date(p.updated_at),
});

const toArray = (data: unknown): RawProduct[] =>
  Array.isArray(data) ? data : [];

export const productService = {
  async getProducts(): Promise<Product[]> {
    const data = await apiClient.get<RawProduct[]>('/products');
    return toArray(data).map(mapProduct);
  },

  async createProduct(input: ProductInput): Promise<Product> {
    const data = await apiClient.post<RawProduct>('/products', input);
    return mapProduct(data);
  },

  async updateProduct(id: string, input: Partial<ProductInput>): Promise<Product | null> {
    const data = await apiClient.put<RawProduct>(`/products/${id}`, input);
    return mapProduct(data);
  },

  async deleteProduct(id: string): Promise<boolean> {
    const data = await apiClient.delete<{ success: boolean }>(`/products/${id}`);
    return data.success;
  },

  async searchProducts(query: string): Promise<Product[]> {
    const data = await apiClient.get<RawProduct[]>(`/products/search/${encodeURIComponent(query)}`);
    return toArray(data).map(mapProduct);
  },

  async filterByCategory(category: string): Promise<Product[]> {
    const data = await apiClient.get<RawProduct[]>(`/products/category/${encodeURIComponent(category)}`);
    return toArray(data).map(mapProduct);
  },

  async getCategories(): Promise<string[]> {
    return apiClient.get<string[]>('/products/categories/all');
  },

  async getLowStockProducts(threshold = 10): Promise<Product[]> {
    const data = await apiClient.get<RawProduct[]>(`/products/low-stock/${threshold}`);
    return toArray(data).map(mapProduct);
  },
};
