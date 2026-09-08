import React from 'react';
import { Outlet } from 'react-router-dom';

export default function UserLayout() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold border-b pb-2">Cashier POS Panel</h1>
      <Outlet />
    </div>
  );
}