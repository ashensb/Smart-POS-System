import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../services/auth';
import { 
    LayoutDashboard, 
    Layers, 
    Package, 
    ShoppingCart, 
    BarChart3, 
    Users, 
    LogOut,
    Store
} from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Categories', path: '/admin/categories', icon: Layers },
        { name: 'Products', path: '/admin/products', icon: Package },
        { name: 'Sales', path: '/admin/sales', icon: ShoppingCart },
        { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
        { name: 'Users', path: '/admin/users', icon: Users },
    ];

    return (
        <div className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col justify-between p-4 border-r border-slate-800 select-none">
            <div>
                {/* Brand Logo Header */}
                <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-slate-800">
                    <div className="p-2 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/20">
                        <Store size={22} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white tracking-wide leading-none">Smart POS</h1>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Admin Panel</span>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="space-y-1.5">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                        : 'hover:bg-slate-800 hover:text-slate-100 text-slate-400'
                                }`}
                            >
                                <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* User Profile & Logout Section */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center gap-3 px-2 py-1">
                    <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white text-sm">
                        A
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-xs font-semibold text-white truncate">Admin User</p>
                        <p className="text-[10px] text-slate-400 truncate">admin@smartpos.com</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-600/10 hover:text-red-500 text-slate-400 hover:border-red-500/20 py-2.5 px-4 rounded-xl border border-slate-700 transition duration-200 text-sm font-medium"
                >
                    <LogOut size={16} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;