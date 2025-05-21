import React, { useEffect, useState } from 'react';

const initialForm = {
  name: '',
  sku: '',
  category: '',
  cost_price: '',
  selling_price: '',
  company_name: '',
  contact_info: '',
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  // For stock modal
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [stockForm, setStockForm] = useState({ warehouse_id: '', quantity: '' });
  const [stockData, setStockData] = useState([]);

  // Fetch products from backend
  const fetchProducts = async () => {
    const res = await fetch('http://localhost:5000/api/products');
    const data = await res.json();
    setProducts(data);
  };

  // Fetch warehouses for stock modal
  const fetchWarehouses = async () => {
    const res = await fetch('http://localhost:5000/api/warehouses');
    const data = await res.json();
    setWarehouses(data);
  };

  const fetchSuppliers = async () => {
    const res = await fetch('http://localhost:5000/api/suppliers');
    const data = await res.json();
    setSuppliers(data);
  };

  // Fetch all stock records
  const fetchStockData = async () => {
    const res = await fetch('http://localhost:5000/api/stock');
    const data = await res.json();
    setStockData(data);
  };

  useEffect(() => {
    fetchProducts();
    fetchStockData();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      // Update
      await fetch(`http://localhost:5000/api/products/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      // Add
      await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setForm(initialForm);
    setEditingId(null);
    fetchProducts();
  };

  // Edit product
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      cost_price: product.cost_price,
      selling_price: product.selling_price,
      company_name: product.company_name,
      contact_info: product.contact_info,
    });
    setEditingId(product.id);
  };

  // Delete product
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  // Open stock modal
  const openStockModal = async (product) => {
    setSelectedProduct(product);
    setShowStockModal(true);
    setStockForm({ warehouse_id: '', quantity: '' });
    await fetchWarehouses();
  };

  // Handle stock form change
  const handleStockChange = (e) => {
    setStockForm({ ...stockForm, [e.target.name]: e.target.value });
  };

  // Submit stock form
  const handleStockSubmit = async (e) => {
    e.preventDefault();
    if (!stockForm.warehouse_id || !stockForm.quantity) return;
    await fetch('http://localhost:5000/api/stock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: selectedProduct.id,
        warehouse_id: stockForm.warehouse_id,
        quantity: Number(stockForm.quantity),
      }),
    });
    setShowStockModal(false);
    setSelectedProduct(null);
    setStockForm({ warehouse_id: '', quantity: '' });
    fetchStockData(); // <-- refresh stock data after saving
  };

  const getProductStock = (productId) => {
    return stockData
      .filter((stock) => stock.product_id === productId)
      .reduce((sum, stock) => sum + Number(stock.quantity), 0);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Products</h1>
      <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-white p-4 rounded shadow max-w-xl">
        <div className="flex gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="border p-2 flex-1"
            required
          />
          <input
            name="sku"
            value={form.sku}
            onChange={handleChange}
            placeholder="SKU"
            className="border p-2 flex-1"
            required
          />
        </div>
        <div className="flex gap-4">
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="border p-2 flex-1"
          />
          <input
            name="cost_price"
            value={form.cost_price}
            onChange={handleChange}
            placeholder="Cost Price"
            type="number"
            className="border p-2 flex-1"
          />
          <input
            name="selling_price"
            value={form.selling_price}
            onChange={handleChange}
            placeholder="Selling Price"
            type="number"
            className="border p-2 flex-1"
          />
        </div>
        <div className="flex gap-4">
          <input
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            placeholder="Company Name"
            className="border p-2 flex-1"
            required
          />
          <input
            name="contact_info"
            value={form.contact_info}
            onChange={handleChange}
            placeholder="Contact Info"
            className="border p-2 flex-1"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? 'Update Product' : 'Add Product'}
        </button>
        {editingId && (
          <button
            type="button"
            className="ml-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            onClick={() => {
              setForm(initialForm);
              setEditingId(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">SKU</th>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Cost Price</th>
            <th className="py-2 px-4 border-b">Selling Price</th>
            <th className="py-2 px-4 border-b">Stock</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-500">
                No products yet.
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
              <td className="py-2 px-4 border-b">
                <div className="flex items-center gap-2">
                  <span>{getProductStock(product.id)}</span>
                  <button
                    className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                    onClick={() => openStockModal(product)}
                  >
                    Manage Stock
                  </button>
                </div>
              </td>
              <td className="py-2 px-4 border-b space-x-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Stock Management Modal */}
      {showStockModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Manage Stock for {selectedProduct?.name}
            </h2>
            <form onSubmit={handleStockSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold">Warehouse</label>
                <select
                  name="warehouse_id"
                  value={stockForm.warehouse_id}
                  onChange={handleStockChange}
                  className="border p-2 w-full"
                  required
                >
                  <option value="">Select warehouse</option>
                  {warehouses.map((wh) => (
                    <option key={wh.id} value={wh.id}>
                      {wh.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold">Quantity</label>
                <input
                  name="quantity"
                  type="number"
                  value={stockForm.quantity}
                  onChange={handleStockChange}
                  className="border p-2 w-full"
                  min="1"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  onClick={() => setShowStockModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;