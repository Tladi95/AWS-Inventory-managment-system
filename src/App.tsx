import { useState, useEffect, useCallback } from 'react';
import type { Product, ProductInput, LowStockAlert } from './types/Product';
import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter } from './components/CategoryFilter';
import { LowStockAlerts } from './components/LowStockAlerts';
import { productService } from './services/ProductService';
import './App.css';

type ViewMode = 'list' | 'form';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  const loadProducts = useCallback(async () => {
    const allProducts = await productService.getProducts();
    setProducts(allProducts);

    const cats = await productService.getCategories();
    setCategories(cats);

    const lowStock = await productService.getLowStockProducts();
    const alerts: LowStockAlert[] = lowStock
      .filter((p) => !dismissedAlerts.has(p.id))
      .map((p) => ({ productId: p.id, productName: p.name, currentQuantity: p.quantity, threshold: 10 }));
    setLowStockAlerts(alerts);
  }, [dismissedAlerts]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const applyFilter = async () => {
      if (searchQuery) {
        const results = await productService.searchProducts(searchQuery);
        setFilteredProducts(results);
      } else if (selectedCategory) {
        const results = await productService.filterByCategory(selectedCategory);
        setFilteredProducts(results);
      } else {
        setFilteredProducts(products);
      }
    };
    applyFilter();
  }, [products, searchQuery, selectedCategory]);

  const handleAddProduct = async (data: ProductInput) => {
    await productService.createProduct(data);
    await loadProducts();
    setViewMode('list');
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setViewMode('form');
  };

  const handleUpdateProduct = async (data: ProductInput) => {
    if (editingProduct) {
      await productService.updateProduct(editingProduct.id, data);
      await loadProducts();
      setEditingProduct(undefined);
      setViewMode('list');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    await productService.deleteProduct(productId);
    await loadProducts();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory('');
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const handleFormCancel = () => {
    setEditingProduct(undefined);
    setViewMode('list');
  };

  const handleDismissAlert = (productId: string) => {
    setDismissedAlerts((prev) => new Set([...prev, productId]));
    setLowStockAlerts((prev) => prev.filter((alert) => alert.productId !== productId));
  };

  const totalInventoryValue = products.reduce((sum, p) => sum + p.quantity * p.price, 0);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Inventory Management System</h1>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-label">Total Products</span>
              <span className="stat-value">{products.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Total Value</span>
              <span className="stat-value">R{totalInventoryValue.toFixed(2)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Low Stock Items</span>
              <span className="stat-value">{lowStockAlerts.length}</span>
            </div>
          </div>
        </div>
      </header>

      <nav className="app-nav">
        <button className={`nav-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
          Products
        </button>
        <button
          className={`nav-btn ${viewMode === 'form' ? 'active' : ''}`}
          onClick={() => { setEditingProduct(undefined); setViewMode('form'); }}
        >
          Add Product
        </button>

      </nav>

      <main className="app-main">
        {viewMode === 'list' && (
          <>
            {lowStockAlerts.length > 0 && (
              <LowStockAlerts alerts={lowStockAlerts} onDismiss={handleDismissAlert} />
            )}

            <div className="filters-section">
              <div className="search-section">
                <SearchBar onSearch={handleSearch} />
              </div>
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>

            <div className="results-info">
              <p>
                {searchQuery
                  ? `Found ${filteredProducts.length} product(s) matching "${searchQuery}"`
                  : selectedCategory
                    ? `${filteredProducts.length} product(s) in ${selectedCategory}`
                    : `Showing ${filteredProducts.length} of ${products.length} product(s)`}
              </p>
            </div>

            <ProductList products={filteredProducts} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />
          </>
        )}

        {viewMode === 'form' && (
          <ProductForm
            product={editingProduct}
            categories={categories}
            onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
            onCancel={handleFormCancel}
          />
        )}

      </main>

      <footer className="app-footer">
        <p>
          © 2024 Inventory Management System. All rights reserved. Last updated:{' '}
          {new Date().toLocaleDateString()}
        </p>
      </footer>
    </div>
  );
}

export default App;
