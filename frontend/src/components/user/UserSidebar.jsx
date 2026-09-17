import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Package, 
    ShoppingCart, 
    Info, 
    PhoneCall, 
    LogOut, 
    Store 
} from 'lucide-react';
import { logout, getCurrentUser } from '../../services/auth';
import { useCart } from '../../context/CartContext';

export default function UserSidebar() {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const { totalCartCount } = useCart();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/user/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/user/products', label: 'Products', icon: Package },
        { path: '/user/cart', label: 'Cart', icon: ShoppingCart, badge: totalCartCount },
        { path: '/user/about', label: 'About Us', icon: Info },
        { path: '/user/contact', label: 'Contact Us', icon: PhoneCall },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between h-screen shrink-0 border-r border-slate-800">
            {/* Top Logo */}
            <div>
                <div className="p-5 flex items-center gap-3 border-b border-slate-800">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
                        <Store size={22} />
                    </div>
                    <div>
                        <h2 className="font-bold text-white text-base tracking-wide">Smart POS</h2>
                        <span className="text-[11px] text-slate-400 font-medium">User Portal</span>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="p-4 space-y-1.5">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition ${
                                        isActive
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`
                                }
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={18} />
                                    <span>{item.label}</span>
                                </div>
                                {item.badge > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                        {item.badge}
                                    </span>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom User Info & Logout */}
            <div className="p-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center font-bold text-white text-xs border border-slate-700">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-xs font-semibold text-white truncate">{user?.name || 'User'}</p>
                        <p className="text-[10px] text-slate-500 truncate">{user?.email || 'user@gmail.com'}</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-semibold transition border border-red-500/20"
                >
                    <LogOut size={16} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}