import React from 'react';
import { Receipt, Printer, X, CheckCircle2 } from 'lucide-react';

export default function ReceiptModal({ isOpen, onClose, sale }) {
    if (!isOpen || !sale) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-4 bg-emerald-600 text-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={20} />
                        <h3 className="font-bold text-base">Payment Success</h3>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-emerald-700 rounded-lg transition">
                        <X size={18} />
                    </button>
                </div>

                {/* Printable Invoice Area */}
                <div id="printable-receipt" className="p-6 space-y-4 text-xs text-slate-700 bg-white">
                    <div className="text-center pb-3 border-b border-dashed border-slate-300">
                        <h2 className="font-extrabold text-base text-slate-900">SMART POS STORE</h2>
                        <p className="text-slate-400">Cashier Checkout Terminal</p>
                    </div>

                    <div className="flex justify-between text-slate-500 font-mono">
                        <div>
                            <p><span className="font-semibold text-slate-700">Inv:</span> {sale.invoice_no}</p>
                            <p><span className="font-semibold text-slate-700">Date:</span> {new Date(sale.created_at || Date.now()).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                            <p><span className="font-semibold text-slate-700">Method:</span> {sale.payment_method}</p>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="divide-y divide-slate-100 my-2">
                        <div className="py-1 flex justify-between font-bold text-slate-400 uppercase text-[10px]">
                            <span>Item</span>
                            <span>Qty x Price</span>
                            <span>Total</span>
                        </div>
                        {sale.items?.map((item, idx) => (
                            <div key={idx} className="py-1.5 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-slate-800">{item.product?.name || `Product #${item.product_id}`}</p>
                                </div>
                                <div className="text-slate-500 font-mono">
                                    {item.quantity} x {Number(item.price).toFixed(2)}
                                </div>
                                <div className="font-bold text-slate-800 font-mono">
                                    Rs. {(item.quantity * item.price).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="border-t border-dashed border-slate-300 pt-3 space-y-1 font-mono">
                        <div className="flex justify-between text-slate-500">
                            <span>Subtotal:</span>
                            <span>Rs. {Number(sale.subtotal).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                            <span>Discount:</span>
                            <span>- Rs. {Number(sale.discount || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-2 border-t border-slate-200">
                            <span>Net Total:</span>
                            <span className="text-emerald-600">Rs. {Number(sale.net_total).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                    <button
                        onClick={handlePrint}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-semibold text-xs flex justify-center items-center gap-2 transition"
                    >
                        <Printer size={16} /> Print Receipt
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold text-xs transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}