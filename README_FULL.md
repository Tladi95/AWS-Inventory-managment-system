# Inventory Management System

A full-stack inventory management application with React frontend and Node.js/Express backend with PostgreSQL database.

## Project Structure

```
aws-inventory-management-system/
├── src/                    # React frontend
│   ├── components/
│   ├── services/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── backend/               # Node.js/Express backend
│   ├── src/
│   │   ├── routes/
│   │   ├── repositories/
│   │   ├── db/
│   │   └── index.ts
│   └── package.json
├── package.json           # Frontend dependencies
└── vite.config.ts        # Vite configuration
```

## Features

### Core Features
- CRUD operations for products
- Search and filter products by category
- Auto-generated SKU numbers
- Low stock alerts with dismissible notifications
- Audit logging for all system actions
- CSV export for audit logs

### Product Fields
- Name
- Stock Keeping Unit (SKU) - Auto-generated
- Quantity
- Price (in South African Rands)
- Category

### Default Categories
- Electronics
- Food and Beverages
- Clothing
- Health and Beauty
- Home and Kitchen

## Setup & Installation

### Frontend Setup

1. Install frontend dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
cp .env.example .env.local
```

3. Update environment variables in `.env.local`:
```
VITE_API_URL=http://localhost:3000/api
```

4. Start development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with PostgreSQL connection:
```
DATABASE_URL=postgresql://user:password@localhost:5432/inventory_db
PORT=3000
NODE_ENV=development
```

5. Create database:
```bash
createdb inventory_db
```

6. Run migrations:
```bash
npm run db:migrate
```

7. Start backend server:
```bash
npm run dev
```

Backend runs on `http://localhost:3000`

## API Endpoints

See [backend/README.md](backend/README.md) for complete API documentation.

## Development

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `cd backend && npm run dev` - Start development server
- `cd backend && npm run build` - Compile TypeScript
- `cd backend && npm start` - Start production server
- `cd backend && npm run db:migrate` - Run database migrations

## Technology Stack

### Frontend
- React 19
- TypeScript 6
- Vite 8
- React Hooks for state management

### Backend
- Node.js
- Express 4
- TypeScript 5
- PostgreSQL 12+
- UUID generation

## Database Schema

### Products Table
- Auto-incremented columns
- Timestamps for created_at and updated_at
- Unique constraint on SKU
- Category filtering support


## Environment Variables

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:3000/api
```

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/inventory_db
PORT=3000
NODE_ENV=development
```

## License

ISC
