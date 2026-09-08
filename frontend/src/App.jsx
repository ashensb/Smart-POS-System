import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import AdminLayout from './pages/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import UserLayout from './pages/UserLayout';
import POS from './components/user/POS';
import Categories from './components/admin/Categories';
import Products from './components/admin/Products';
import Sales from './components/admin/Sales';
import Reports from './components/admin/Reports';
import Users from './components/admin/Users';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<Products />} />
          <Route path="sales" element={<Sales />} />
          <Route path="reports" element={<Reports />} />
          <Route path="users" element={<Users />} />
        </Route>

        {/* Cashier Routes */}
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<POS />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}