import React, { useEffect, useState } from 'react';

const Reports = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Reports</h1>
      <h2 className="text-xl font-semibold mb-2">All Products</h2>
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">SKU</th>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Cost Price</th>
            <th className="py-2 px-4 border-b">Selling Price</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                No products found.
              </td>
            </tr>
          )}
          {products.map((product) => (
            <tr key={product.id}>
              <td className="py-2 px-4 border-b">{product.name}</td>
              <td className="py-2 px-4 border-b">{product.sku}</td>
              <td className="py-2 px-4 border-b">{product.category}</td>
              <td className="py-2 px-4 border-b">{product.cost_price}</td>
              <td className="py-2 px-4 border-b">{product.selling_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;