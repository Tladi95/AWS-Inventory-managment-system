import React, { useState } from 'react';
import type { Product, ProductInput } from '../types/Product';

interface ProductFormProps {
  product?: Product;
  categories: string[];
  onSubmit: (data: ProductInput) => void;
  onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  categories,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ProductInput>({
    name: product?.name || '',
    sku: product?.sku || '',
    quantity: product?.quantity || 0,
    price: product?.price || 0,
    category: product?.category || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.quantity < 0) newErrors.quantity = 'Quantity cannot be negative';
    if (formData.price < 0) newErrors.price = 'Price cannot be negative';
    if (!formData.category.trim()) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>

      <div className="form-group">
        <label htmlFor="name">Product Name *</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter product name"
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label>Stock Keeping Unit (Auto-Generated)</label>
        <input
          type="text"
          value={formData.sku}
          readOnly
          placeholder="Will be auto-generated"
          disabled
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="quantity">Quantity *</label>
          <input
            id="quantity"
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="0"
            className={errors.quantity ? 'error' : ''}
          />
          {errors.quantity && (
            <span className="error-text">{errors.quantity}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="price">Price (R) *</label>
          <input
            id="price"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={errors.price ? 'error' : ''}
          />
          {errors.price && <span className="error-text">{errors.price}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="category">Category *</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={errors.category ? 'error' : ''}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
          <option value="__new__">+ Add new category</option>
        </select>
        {errors.category && (
          <span className="error-text">{errors.category}</span>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {product ? 'Update Product' : 'Add Product'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};
