import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './component/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Warehouses from './pages/Warehouses';
import Suppliers from './pages/Suppliers';
import Reports from './pages/Reports';
import StockMovement from './pages/StockMovement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/warehouses" element={<Warehouses />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/stockmovement" element={<StockMovement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
