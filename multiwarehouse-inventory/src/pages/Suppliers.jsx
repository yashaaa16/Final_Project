import React, { useEffect, useState } from 'react';

const initialForm = {
  company_name: '',
  contact_info: '',
};

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const fetchSuppliers = async () => {
    const res = await fetch('http://localhost:5000/api/suppliers');
    const data = await res.json();
    setSuppliers(data);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`http://localhost:5000/api/suppliers/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      await fetch('http://localhost:5000/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setForm(initialForm);
    setEditingId(null);
    fetchSuppliers();
  };

  const handleEdit = (supplier) => {
    setForm({
      company_name: supplier.company_name,
      contact_info: supplier.contact_info,
    });
    setEditingId(supplier.id);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/suppliers/${id}`, { method: 'DELETE' });
    fetchSuppliers();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Suppliers</h1>
      <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-white p-4 rounded shadow max-w-xl">
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
          {editingId ? 'Update Supplier' : 'Add Supplier'}
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
            <th className="py-2 px-4 border-b">Contact</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center py-4 text-gray-500">
                No suppliers yet.
              </td>
            </tr>
          )}
          {suppliers.map((supplier) => (
            <tr key={supplier.id}>
              <td className="py-2 px-4 border-b">{supplier.company_name}</td>
              <td className="py-2 px-4 border-b">{supplier.contact_info}</td>
              <td className="py-2 px-4 border-b space-x-2">
                <button
                  onClick={() => handleEdit(supplier)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(supplier.id)}
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

export default Suppliers;