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
import supplierRoutes from './routes/supplier.js';
import warehouseRoutes from './routes/warehouse.js';


app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/products', productRoutes);
// Example route
app.get('/', (req, res) => {
  res.send('Multiwarehouse Inventory API is running');
});

// Add your API routes here

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
