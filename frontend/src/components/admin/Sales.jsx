import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { 
    Search, 
    Eye, 
    Calendar, 
    Receipt, 
    CreditCard, 
    DollarSign, 
    X, 
    Printer,
    ShoppingBag
} from 'lucide-react';

export default function Sales() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSale, setSelectedSale] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchSales();
    }, [selectedDate]);

    const fetchSales = async () => {
        setLoading(true);
        try {
            let url = '/admin/sales';
            if (selectedDate) {
                url += `?date=${selectedDate}`;
            }
            const res = await API.get(url);
            setSales(res.data);
        } catch (err) {
            console.error('Error fetching sales history:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (sale) => {
        setSelectedSale(sale);
        setIsModalOpen(true);
    };

    const handlePrint = () => {
        window.print();
    };

    // Search Filter (by Invoice No or Payment Method)
    const filteredSales = sales.filter((sale) => {
        const invNo = sale.invoice_no ? sale.invoice_no.toLowerCase() : '';
        const method = sale.payment_method ? sale.payment_method.toLowerCase() : '';
        const search = searchTerm.toLowerCase();

        return invNo.includes(search) || method.includes(search);
    });

    // Summary Calculations
    const totalRevenue = filteredSales.reduce((acc, sale) => acc + Number(sale.net_total || 0), 0);
    const totalTransactions = filteredSales.length;

    return (
        <div className="p-6 bg-slate-50 min-h-screen space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Sales History</h1>
                    <p className="text-slate-500 text-sm">Monitor and review all cashier transactions and invoices</p>
                </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Revenue</p>
                        <h3 className="text-xl font-bold text-slate-800">Rs. {totalRevenue.toFixed(2)}</h3>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Orders</p>
                        <h3 className="text-xl font-bold text-slate-800">{totalTransactions}</h3>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Invoice No or Payment Method..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-blue-500"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-sm w-full md:w-auto">
                        <Calendar size={16} className="text-slate-500" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent text-slate-700 outline-none text-sm cursor-pointer"
                        />
                    </div>
                    {selectedDate && (
                        <button
                            onClick={() => setSelectedDate('')}
                            className="text-xs text-red-500 hover:underline"
                        >
                            Clear Date
                        </button>
                    )}
                </div>
            </div>

            {/* Sales Data Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <th className="p-4">Invoice No</th>
                                <th className="p-4">Date & Time</th>
                                <th className="p-4">Payment Method</th>
                                <th className="p-4">Discount</th>
                                <th className="p-4">Total Amount</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-slate-400">Loading sales records...</td>
                                </tr>
                            ) : filteredSales.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-slate-400">No sales transactions found.</td>
                                </tr>
                            ) : (
                                filteredSales.map((sale) => (
                                    <tr key={sale.id} className="hover:bg-slate-50/80 transition">
                                        <td className="p-4 font-mono font-medium text-slate-900">
                                            {sale.invoice_no || `#INV-${sale.id}`}
                                        </td>
                                        <td className="p-4 text-slate-500">
                                            {new Date(sale.created_at).toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 uppercase">
                                                <CreditCard size={12} />
                                                {sale.payment_method}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-600">
                                            Rs. {Number(sale.discount || 0).toFixed(2)}
                                        </td>
                                        <td className="p-4 font-bold text-slate-900">
                                            Rs. {Number(sale.net_total || sale.subtotal).toFixed(2)}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => handleViewDetails(sale)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition inline-flex items-center gap-1 text-xs font-semibold"
                                            >
                                                <Eye size={16} /> View Invoice
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invoice Detail Modal */}
            {isModalOpen && selectedSale && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
                        {/* Modal Header */}
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div className="flex items-center gap-2">
                                <Receipt size={20} className="text-blue-600" />
                                <h3 className="font-bold text-slate-800">Transaction Receipt</h3>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Printable Content */}
                        <div id="printable-invoice" className="p-6 space-y-4 text-sm text-slate-700">
                            <div className="text-center pb-3 border-b border-dashed border-slate-200">
                                <h2 className="font-bold text-lg text-slate-900">Smart POS System</h2>
                                <p className="text-xs text-slate-400">Store Receipt / Invoice</p>
                            </div>

                            <div className="flex justify-between text-xs text-slate-500">
                                <div>
                                    <p><span className="font-medium">Invoice:</span> {selectedSale.invoice_no || `#INV-${selectedSale.id}`}</p>
                                    <p><span className="font-medium">Date:</span> {new Date(selectedSale.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p><span className="font-medium">Payment:</span> <span className="uppercase font-semibold text-slate-700">{selectedSale.payment_method}</span></p>
                                </div>
                            </div>

                            {/* Itemized List */}
                            <div className="divide-y divide-slate-100 my-3">
                                <div className="py-1 flex justify-between font-semibold text-xs text-slate-400 uppercase">
                                    <span>Item</span>
                                    <span>Qty x Price</span>
                                    <span>Total</span>
                                </div>
                                {selectedSale.items?.map((item, index) => (
                                    <div key={index} className="py-2 flex justify-between text-xs">
                                        <div>
                                            <p className="font-medium text-slate-800">{item.product?.name || `Product #${item.product_id}`}</p>
                                        </div>
                                        <div className="text-slate-500">
                                            {item.quantity} x {Number(item.price).toFixed(2)}
                                        </div>
                                        <div className="font-medium text-slate-800">
                                            Rs. {(item.quantity * item.price).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Total Breakdown */}
                            <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs">
                                <div className="flex justify-between text-slate-500">
                                    <span>Subtotal:</span>
                                    <span>Rs. {Number(selectedSale.subtotal || selectedSale.net_total).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>Discount:</span>
                                    <span>- Rs. {Number(selectedSale.discount || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t border-slate-100">
                                    <span>Net Total:</span>
                                    <span className="text-blue-600">Rs. {Number(selectedSale.net_total).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer Actions */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button
                                onClick={handlePrint}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                            >
                                <Printer size={14} /> Print Receipt
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}