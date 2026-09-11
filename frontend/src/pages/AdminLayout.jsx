import React from 'react';
import Sidebar from '../components/admin/Sidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
            {/* Sidebar Handle Mobile & Desktop Layout */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 w-full overflow-x-hidden min-h-screen">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;