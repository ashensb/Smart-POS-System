import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { DollarSign, ShoppingBag, Package, AlertTriangle, TrendingUp } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState({
        total_sales: 0,
        total_orders: 0,
        total_products: 0,
        low_stock_count: 0,
        recent_sales: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await API.get('/admin/dashboard');
            setStats(res.data);
        } catch (err) {
            console.error('Error fetching dashboard stats', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-6 text-slate-500">Loading Dashboard...</div>;

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
                <p className="text-sm text-slate-500">Overview of your business performance & inventory</p>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</p>
                        <h3 className="text-xl font-bold text-slate-800 mt-1">Rs. {Number(stats.total_sales || 0).toFixed(2)}</h3>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <DollarSign size={24} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Orders</p>
                        <h3 className="text-xl font-bold text-slate-800 mt-1">{stats.total_orders}</h3>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <ShoppingBag size={24} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Products</p>
                        <h3 className="text-xl font-bold text-slate-800 mt-1">{stats.total_products}</h3>
                    </div>
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                        <Package size={24} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Low Stock Items</p>
                        <h3 className="text-xl font-bold text-red-600 mt-1">{stats.low_stock_count}</h3>
                    </div>
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                        <AlertTriangle size={24} />
                    </div>
                </div>
            </div>

            {/* Recent Sales Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-blue-600" /> Recent Sales Activity
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-400 font-semibold text-xs uppercase">
                            <tr>
                                <th className="p-3">Order ID</th>
                                <th className="p-3">Payment</th>
                                <th className="p-3">Discount</th>
                                <th className="p-3">Total Amount</th>
                                <th className="p-3">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {stats.recent_sales.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-6 text-slate-400">No sales recorded yet.</td>
                                </tr>
                            ) : (
                                stats.recent_sales.map((sale) => (
                                    <tr key={sale.id} className="hover:bg-slate-50/50">
                                        <td className="p-3 font-semibold text-slate-800">#{sale.id}</td>
                                        <td className="p-3 uppercase text-xs font-bold text-slate-500">{sale.payment_method}</td>
                                        <td className="p-3">Rs. {Number(sale.discount).toFixed(2)}</td>
                                        <td className="p-3 font-bold text-blue-600">Rs. {Number(sale.net_total).toFixed(2)}</td>
                                        <td className="p-3 text-xs text-slate-400">{new Date(sale.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}