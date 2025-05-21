import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [counts, setCounts] = useState({
    products: 0,
    warehouses: 0,
    suppliers: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      const [products, warehouses, suppliers] = await Promise.all([
        fetch('http://localhost:5000/api/products').then((res) => res.json()),
        fetch('http://localhost:5000/api/warehouses').then((res) => res.json()),
        fetch('http://localhost:5000/api/suppliers').then((res) => res.json()),
      ]);
      setCounts({
        products: products.length,
        warehouses: warehouses.length,
        suppliers: suppliers.length,
      });
    };
    fetchCounts();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded shadow text-center">
          <div className="text-xl font-semibold mb-2">Products</div>
          <div className="text-4xl font-bold">{counts.products}</div>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <div className="text-xl font-semibold mb-2">Warehouses</div>
          <div className="text-4xl font-bold">{counts.warehouses}</div>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <div className="text-xl font-semibold mb-2">Suppliers</div>
          <div className="text-4xl font-bold">{counts.suppliers}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;