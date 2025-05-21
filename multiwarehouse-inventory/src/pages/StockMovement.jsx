import React, { useEffect, useState } from 'react';

const initialForm = {
  product_id: '',
  source_warehouse_id: '',
  destination_warehouse_id: '',
  quantity: '',
  transfer_date: '', // Optional: you can set this in backend if you want
  status: '',        // Optional: default is 'Pending'
  order_id: '',      // Optional
};

const StockMovement = () => {
  const [movements, setMovements] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  // Fetch all stock movements
  const fetchMovements = async () => {
    const res = await fetch('http://localhost:5000/api/stockmovement');
    const data = await res.json();
    setMovements(data);
  };

  // Fetch products and warehouses for dropdowns
  const fetchProducts = async () => {
    const res = await fetch('http://localhost:5000/api/products');
    const data = await res.json();
    setProducts(data);
  };
  const fetchWarehouses = async () => {
    const res = await fetch('http://localhost:5000/api/warehouses');
    const data = await res.json();
    setWarehouses(data);
  };

  useEffect(() => {
    fetchMovements();
    fetchProducts();
    fetchWarehouses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/stockmovement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: form.product_id,
        source_warehouse_id: form.source_warehouse_id,
        destination_warehouse_id: form.destination_warehouse_id,
        quantity: Number(form.quantity),
        // transfer_date, status, order_id can be omitted if you want defaults
      }),
    });
    setForm(initialForm);
    fetchMovements();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Stock Movements</h1>
      <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-white p-4 rounded shadow max-w-xl">
        <div className="flex gap-4">
          <select
            name="product_id"
            value={form.product_id}
            onChange={handleChange}
            className="border p-2 flex-1"
            required
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <select
            name="source_warehouse_id"
            value={form.source_warehouse_id}
            onChange={handleChange}
            className="border p-2 flex-1"
            required
          >
            <option value="">From Warehouse</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
          <select
            name="destination_warehouse_id"
            value={form.destination_warehouse_id}
            onChange={handleChange}
            className="border p-2 flex-1"
            required
          >
            <option value="">To Warehouse</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
          <input
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            className="border p-2 flex-1"
            min="1"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Transfer Stock
        </button>
      </form>

      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Product</th>
            <th className="py-2 px-4 border-b">From Warehouse</th>
            <th className="py-2 px-4 border-b">To Warehouse</th>
            <th className="py-2 px-4 border-b">Quantity</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Transfer Date</th>
          </tr>
        </thead>
        <tbody>
          {movements.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-500">
                No stock movements yet.
              </td>
            </tr>
          )}
          {movements.map((m) => (
            <tr key={m.id}>
              <td className="py-2 px-4 border-b">{new Date(m.created_at).toLocaleString()}</td>
              <td className="py-2 px-4 border-b">{products.find(p => p.id === m.product_id)?.name || m.product_id}</td>
              <td className="py-2 px-4 border-b">{warehouses.find(w => w.id === m.source_warehouse_id)?.name || m.source_warehouse_id}</td>
              <td className="py-2 px-4 border-b">{warehouses.find(w => w.id === m.destination_warehouse_id)?.name || m.destination_warehouse_id}</td>
              <td className="py-2 px-4 border-b">{m.quantity}</td>
              <td className="py-2 px-4 border-b">{m.status}</td>
              <td className="py-2 px-4 border-b">{new Date(m.transfer_date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockMovement;