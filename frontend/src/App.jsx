import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Cart Context Provider
import { CartProvider } from './context/CartContext';

// Auth
import Login from './components/auth/Login';

// Layouts
import AdminLayout from './pages/AdminLayout';
import UserLayout from './pages/UserLayout';

// Admin Components
import Dashboard from './components/admin/Dashboard';
import Categories from './components/admin/Categories';
import Products from './components/admin/Products';
import Sales from './components/admin/Sales';
import Reports from './components/admin/Reports';
import Users from './components/admin/Users';

// User Components
import UserDashboard from './components/user/UserDashboard';
import UserProducts from './components/user/UserProducts';
import Cart from './components/user/Cart';
import AboutUs from './components/user/AboutUs';
import ContactUs from './components/user/ContactUs';

export default function App() {
  return (
    <CartProvider>
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

          {/* User Routes */}
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="products" element={<UserProducts />} />
            <Route path="cart" element={<Cart />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="contact" element={<ContactUs />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}