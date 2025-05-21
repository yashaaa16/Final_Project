import React, { useEffect, useState } from 'react';

const initialForm = {
  name: '',
  location: '',
};

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const fetchWarehouses = async () => {
    const res = await fetch('http://localhost:5000/api/warehouses');
    const data = await res.json();
    setWarehouses(data);
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`http://localhost:5000/api/warehouses/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      await fetch('http://localhost:5000/api/warehouses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setForm(initialForm);
    setEditingId(null);
    fetchWarehouses();
  };

  const handleEdit = (warehouse) => {
    setForm({
      name: warehouse.name,
      location: warehouse.location,
    });
    setEditingId(warehouse.id);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/warehouses/${id}`, { method: 'DELETE' });
    fetchWarehouses();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Warehouses</h1>
      <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-white p-4 rounded shadow max-w-xl">
        <div className="flex gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Warehouse Name"
            className="border p-2 flex-1"
            required
          />
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            className="border p-2 flex-1"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? 'Update Warehouse' : 'Add Warehouse'}
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
            <th className="py-2 px-4 border-b">Location</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {warehouses.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center py-4 text-gray-500">
                No warehouses yet.
              </td>
            </tr>
          )}
          {warehouses.map((warehouse) => (
            <tr key={warehouse.id}>
              <td className="py-2 px-4 border-b">{warehouse.name}</td>
              <td className="py-2 px-4 border-b">{warehouse.location}</td>
              <td className="py-2 px-4 border-b space-x-2">
                <button
                  onClick={() => handleEdit(warehouse)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(warehouse.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Warehouses;