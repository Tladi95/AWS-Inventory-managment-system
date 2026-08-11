# Inventory Management System Backend

Node.js/Express backend with PostgreSQL database for the inventory management system.

## Setup

### Prerequisites
- Node.js 16+
- PostgreSQL 12+

### Installation

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your PostgreSQL connection string:
```
DATABASE_URL=postgresql://user:password@localhost:5432/inventory_db
PORT=3000
NODE_ENV=development
```

5. Create PostgreSQL database:
```bash
createdb inventory_db
```

6. Run migrations (creates tables):
```bash
npm run db:migrate
```

7. Start the server:
```bash
npm run dev
```

Server will run on `http://localhost:3000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/search/:query` - Search products
- `GET /api/products/category/:category` - Filter by category
- `GET /api/products/categories/all` - Get all categories
- `GET /api/products/low-stock/:threshold` - Get low stock products


## Database Schema

### products table
- id: VARCHAR(255) PRIMARY KEY
- name: VARCHAR(255)
- sku: VARCHAR(255) UNIQUE
- quantity: INTEGER
- price: DECIMAL(10, 2)
- category: VARCHAR(255)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP



## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
