import React from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from '../components/user/UserSidebar';

const UserLayout = () => {
    return (
        <div className="flex flex-col md:flex-row h-screen w-screen bg-slate-100 font-sans overflow-hidden">
            {/* Sidebar Component */}
            <UserSidebar />

            {/* Main Content View Container */}
            <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
                <Outlet />
            </main>
        </div>
    );
};

export default UserLayout;