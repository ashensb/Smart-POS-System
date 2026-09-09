import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserSidebar from '../components/user/UserSidebar';
import POS from '../components/user/POS';
import { logout } from '../services/auth';

const UserLayout = () => {
    const [activeTab, setActiveTab] = useState('pos');
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            navigate('/login');
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-screen bg-slate-100 font-sans overflow-hidden">
            {/* Sidebar Component */}
            <UserSidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                onLogout={handleLogout} 
            />

            {/* Main Content View Container */}
            <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
                {activeTab === 'pos' && <POS />}
            </main>
        </div>
    );
};

export default UserLayout;