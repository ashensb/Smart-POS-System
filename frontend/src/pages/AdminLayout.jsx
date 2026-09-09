import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';

const AdminLayout = () => {
    return (
        <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-slate-100">
            {/* Sidebar Component */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 h-full overflow-y-auto p-4 md:p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;