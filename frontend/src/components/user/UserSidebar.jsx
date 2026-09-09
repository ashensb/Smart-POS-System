import React, { useState } from 'react';
import { getCurrentUser } from '../../services/auth';

const UserSidebar = ({ activeTab, setActiveTab, onLogout }) => {
    const user = getCurrentUser();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setIsOpen(false);
    };

    return (
        <>
            {/* Mobile Top Header Bar */}
            <div className="md:hidden bg-slate-900 text-white p-3.5 flex items-center justify-between border-b border-slate-800 sticky top-0 z-30 shrink-0 w-full">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/30">
                        POS
                    </div>
                    <span className="font-bold text-white text-base">Smart POS</span>
                </div>
                <button onClick={toggleSidebar} className="p-2 text-slate-300 hover:text-white focus:outline-none">
                    {isOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Backdrop Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Drawer Container */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50 h-full w-64 shrink-0 bg-slate-900 text-white flex flex-col justify-between p-4 shadow-xl transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="flex flex-col h-full justify-between">
                    <div>
                        {/* Brand Header */}
                        <div className="hidden md:flex items-center space-x-3 px-2 py-4 mb-6 border-b border-slate-800">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/30 shrink-0">
                                POS
                            </div>
                            <div>
                                <h1 className="font-bold text-lg leading-none">Smart POS</h1>
                                <span className="text-xs text-slate-400">Cashier Terminal</span>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <nav className="space-y-2 pt-4 md:pt-0">
                            <button
                                onClick={() => handleTabClick('pos')}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                                    activeTab === 'pos' 
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                                </svg>
                                <span>POS Terminal</span>
                            </button>
                        </nav>
                    </div>

                    {/* Cashier User Info & Logout */}
                    <div className="border-t border-slate-800 pt-4 mt-auto">
                        <div className="flex items-center space-x-3 px-2 py-2 mb-3">
                            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-300 shrink-0">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-semibold text-white truncate">{user?.name || 'Cashier User'}</p>
                                <p className="text-xs text-slate-400 truncate">{user?.email || 'cashier@pos.com'}</p>
                            </div>
                        </div>

                        <button
                            onClick={onLogout}
                            className="w-full flex items-center justify-center space-x-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white py-2.5 rounded-xl text-sm font-semibold transition duration-200"
                        >
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default UserSidebar;