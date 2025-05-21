import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col p-6">
      <h2 className="text-2xl font-bold mb-8">Inventory Menu</h2>
      <ul className="space-y-4">
        <li>
          <Link
            to="/"
            className="block px-3 py-2 rounded hover:bg-gray-700 transition"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/products"
            className="block px-3 py-2 rounded hover:bg-gray-700 transition"
          >
            Products
          </Link>
        </li>
        <li>
          <Link
            to="/warehouses"
            className="block px-3 py-2 rounded hover:bg-gray-700 transition"
          >
            Warehouses
          </Link>
        </li>
        <li>
          <Link
            to="/suppliers"
            className="block px-3 py-2 rounded hover:bg-gray-700 transition"
          >
            Suppliers
          </Link>
        </li>
        <li>
          <Link
            to="/reports"
            className="block px-3 py-2 rounded hover:bg-gray-700 transition"
          >
            Reports
          </Link>
        </li>
        <li>
          <Link
            to="/stockmovement"
            className="block px-3 py-2 rounded hover:bg-gray-700 transition"
          >
            Stock Movement
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;