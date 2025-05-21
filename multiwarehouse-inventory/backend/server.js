import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

import productRoutes from './routes/product.js';
import warehouseRoutes from './routes/warehouse.js';
import stockRoutes from './routes/stock.js';
import stockmovementRoutes from './routes/stockmovements.js';
import supplierRouter from './routes/suppliers.js';
import authRouter from './routes/auth.js';
app.use('/api/auth', authRouter);
app.use('/api/suppliers', supplierRouter);
app.use('/api/products', productRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/stockmovement', stockmovementRoutes);
// Example route
app.get('/', (req, res) => {
  res.send('Multiwarehouse Inventory API is running');
});

// Add your API routes here

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
