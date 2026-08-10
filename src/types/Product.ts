export interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInput {
  name: string;
  sku: string;
  quantity: number;
  price: number;
  category: string;
}

export interface LowStockAlert {
  productId: string;
  productName: string;
  currentQuantity: number;
  threshold: number;
}
