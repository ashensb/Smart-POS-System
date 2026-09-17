import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { 
    ShoppingBag, 
    PackageCheck, 
    ArrowUpRight, 
    PlusCircle, 
    DollarSign,
    Package,
    X,
    Eye,
    Tag,
    ShoppingBagIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        lowStockCount: 0
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const posRes = await API.get('/pos/data');
            const fetchedProducts = posRes.data.products || [];
            setProducts(fetchedProducts);

            const salesRes = await API.get('/pos/sales').catch(() => ({ data: [] }));
            const fetchedSales = Array.isArray(salesRes.data) ? salesRes.data : [];

            const revenue = fetchedSales.reduce((sum, sale) => sum + Number(sale.net_total || sale.total || 0), 0);
            const lowStock = fetchedProducts.filter(p => Number(p.stock_quantity) < 5).length;

            setStats({
                totalOrders: fetchedSales.length,
                totalRevenue: revenue,
                totalProducts: fetchedProducts.length,
                lowStockCount: lowStock
            });
        } catch (err) {
            console.error('Error fetching dashboard details:', err);
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
        let cleanPath = imagePath.replace(/^\//, '').replace(/^storage\//, '');
        const apiBaseUrl = API.defaults.baseURL 
            ? API.defaults.baseURL.replace(/\/api\/?$/, '') 
            : 'http://localhost:8000';
        return `${apiBaseUrl}/storage/${cleanPath}`;
    };

    return (
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto h-full bg-slate-100/70 relative">
            
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm transition-all hover:shadow-md">
                <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">User Dashboard</h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Real-time store statistics and interactive product showcase</p>
                </div>
                <button 
                    onClick={() => navigate('/user/products')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                    <PlusCircle size={18} />
                    New Order / POS Terminal
                </button>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:border-blue-300 transition-all duration-300 hover:shadow-md">
                    <div>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Orders</p>
                        <h3 className="text-2xl font-black text-slate-800 mt-1">{loading ? '...' : stats.totalOrders}</h3>
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
                            <ArrowUpRight size={12} /> Real-time active
                        </span>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                        <ShoppingBag size={22} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:border-emerald-300 transition-all duration-300 hover:shadow-md">
                    <div>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Revenue</p>
                        <h3 className="text-2xl font-black text-slate-800 mt-1">Rs. {loading ? '...' : stats.totalRevenue.toFixed(2)}</h3>
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
                            <ArrowUpRight size={12} /> Sales completed
                        </span>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                        <DollarSign size={22} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:border-purple-300 transition-all duration-300 hover:shadow-md">
                    <div>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Products</p>
                        <h3 className="text-2xl font-black text-slate-800 mt-1">{loading ? '...' : stats.totalProducts}</h3>
                        <span className="text-[11px] font-medium text-slate-400 mt-1 block">In catalog</span>
                    </div>
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shadow-inner">
                        <Package size={22} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:border-amber-300 transition-all duration-300 hover:shadow-md">
                    <div>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Low Stock Items</p>
                        <h3 className="text-2xl font-black text-slate-800 mt-1">{loading ? '...' : stats.lowStockCount}</h3>
                        <span className="text-[11px] font-bold text-amber-600 mt-1 block">Needs reorder (&lt;5)</span>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner">
                        <PackageCheck size={22} />
                    </div>
                </div>
            </div>

            {/* Interactive Clean Store Showcase */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div>
                        <h3 className="font-extrabold text-slate-800 text-base sm:text-lg tracking-tight">Store Showcase</h3>
                        <p className="text-slate-400 text-xs">Click on any item to quick-view details</p>
                    </div>
                    <button 
                        onClick={() => navigate('/user/products')} 
                        className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1 group transition-all"
                    >
                        Go to Catalog <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-16 text-slate-400 text-sm font-medium animate-pulse">Loading catalog showcase...</div>
                ) : products.length === 0 ? (
                    <div className="text-center py-16 text-slate-400 text-sm font-medium">No items available in store.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
                        {products.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedProduct(item)}
                                className="bg-slate-50 hover:bg-white rounded-2xl border border-slate-200/90 hover:border-blue-500/30 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group flex flex-col justify-between transform hover:-translate-y-1.5"
                            >
                                {/* Product Image */}
                                <div className="w-full h-48 bg-slate-200/50 overflow-hidden relative flex items-center justify-center">
                                    {item.image ? (
                                        <img 
                                            src={getImageUrl(item.image)} 
                                            alt={item.name} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                                            onError={(e) => {
                                                e.target.onerror = null; 
                                                e.target.src = 'https://placehold.co/400x300?text=No+Image';
                                            }}
                                        />
                                    ) : (
                                        <Package size={40} className="text-slate-300" />
                                    )}

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px] flex items-center justify-center">
                                        <span className="bg-white/90 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <Eye size={14} className="text-blue-600" /> Quick View
                                        </span>
                                    </div>
                                </div>

                                {/* Content Details (Clean) */}
                                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-base group-hover:text-blue-600 transition-colors line-clamp-1">{item.name}</h4>
                                    </div>

                                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center mt-2">
                                        <div>
                                            <span className="text-[10px] text-slate-400 block font-medium">Price</span>
                                            <span className="font-black text-blue-600 text-base">Rs. {Number(item.price).toFixed(2)}</span>
                                        </div>
                                        <div className="w-9 h-9 rounded-xl bg-blue-50 group-hover:bg-blue-600 group-hover:text-white text-blue-600 flex items-center justify-center transition-colors duration-300">
                                            <ShoppingBagIcon size={18} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Clean Animated Modal View */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center z-50 p-4 transition-all duration-300">
                    <div 
                        className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-200 border border-slate-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            onClick={() => setSelectedProduct(null)}
                            className="absolute right-4 top-4 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 p-2 rounded-full transition-all"
                        >
                            <X size={18} />
                        </button>

                        <div className="w-full h-56 bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-200/80 relative shadow-inner">
                            {selectedProduct.image ? (
                                <img 
                                    src={getImageUrl(selectedProduct.image)} 
                                    alt={selectedProduct.name} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Package size={56} className="text-slate-300" />
                            )}
                        </div>

                        <div className="space-y-1">
                            <h2 className="text-xl font-black text-slate-800">{selectedProduct.name}</h2>
                            <p className="text-xs text-slate-500 leading-relaxed pt-1">{selectedProduct.description || 'No specific product description provided.'}</p>
                        </div>

                        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                    <Tag size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-semibold">Selling Price</p>
                                    <p className="font-extrabold text-blue-600 text-base">Rs. {Number(selectedProduct.price).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-1">
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => navigate('/user/products')}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-blue-500/25 transition-all flex justify-center items-center gap-2"
                            >
                                Go to POS Terminal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}