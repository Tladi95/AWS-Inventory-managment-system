import React from 'react';
import type { Product } from '../types/Product';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  isLoading?: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  if (isLoading) {
    return <div className="loading">Loading products...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <p>No products found. Add a new product to get started.</p>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <table className="product-table">
        <thead>
          <tr>
            <th>Stock Keeping Unit</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="product-row">
              <td className="sku">{product.sku}</td>
              <td className="name">{product.name}</td>
              <td className="category">
                <span className="badge">{product.category}</span>
              </td>
              <td className="quantity">
                <span
                  className={`qty-badge ${
                    product.quantity <= 10 ? 'low-stock' : ''
                  }`}
                >
                  {product.quantity}
                </span>
              </td>
              <td className="price">R{product.price.toFixed(2)}</td>
              <td className="total">
                R{(product.quantity * product.price).toFixed(2)}
              </td>
              <td className="actions">
                <button
                  className="btn-icon edit"
                  onClick={() => onEdit(product)}
                  title="Edit product"
                >
                  Edit
                </button>
                <button
                  className="btn-icon delete"
                  onClick={() => {
                    if (
                      confirm(
                        `Are you sure you want to delete "${product.name}"?`
                      )
                    ) {
                      onDelete(product.id);
                    }
                  }}
                  title="Delete product"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
