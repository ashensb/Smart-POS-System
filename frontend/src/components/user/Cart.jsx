import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import API from '../../services/api';
import { 
    ShoppingCart, 
    Trash2, 
    Plus, 
    Minus, 
    CreditCard, 
    QrCode, 
    Banknote, 
    ArrowLeft, 
    CheckCircle2 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cart() {
    const { cart, updateQty, removeFromCart, clearCart } = useCart();
    
    const [discount, setDiscount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [completedSale, setCompletedSale] = useState(null);

    const subtotal = cart.reduce((acc, item) => acc + Number(item.price) * item.qty, 0);
    const netTotal = Math.max(0, subtotal - Number(discount || 0));

    const handleCheckout = async () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        setCheckoutLoading(true);

        const payload = {
            items: cart.map((item) => ({
                id: item.id,
                qty: item.qty,
                price: Number(item.price),
            })),
            payment_method: paymentMethod,
            discount: Number(discount) || 0,
            subtotal: subtotal,
            net_total: netTotal,
        };

        try {
            const res = await API.post('/pos/checkout', payload);
            if (res.data.success) {
                setCompletedSale(res.data.sale);
                clearCart();
            }
        } catch (err) {
            console.error('Checkout failed:', err);
            alert(err.response?.data?.message || 'Checkout failed.');
        } finally {
            setCheckoutLoading(false);
        }
    };

    if (completedSale) {
        return (
            <div className="h-full w-full bg-slate-100 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 size={36} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Order Successful!</h2>
                    <p className="text-xs text-slate-500">Thank you for your order. Transaction ID: #{completedSale.id || 'N/A'}</p>
                    
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left space-y-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Total Paid:</span>
                            <span className="font-bold text-slate-800">Rs. {Number(completedSale.net_total || netTotal).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Payment Method:</span>
                            <span className="font-bold text-blue-600">{completedSale.payment_method || paymentMethod}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setCompletedSale(null)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition text-xs"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row h-full w-full bg-slate-100 p-4 sm:p-6 gap-6 overflow-y-auto">
            
            {/* Left Column: Cart Items List */}
            <div className="flex-1 space-y-4">
                <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <ShoppingCart className="text-blue-600" /> Shopping Cart
                        </h1>
                        <p className="text-slate-500 text-xs">Review your items before proceeding to payment</p>
                    </div>
                    <Link to="/user/products" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        <ArrowLeft size={14} /> Back to Products
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 space-y-3">
                    {cart.length === 0 ? (
                        <div className="text-center py-16 text-slate-400 text-xs sm:text-sm space-y-3">
                            <p>Your cart is empty.</p>
                            <Link to="/user/products" className="inline-block px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow">
                                Browse Products
                            </Link>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3.5 bg-slate-50 rounded-xl border border-slate-100 gap-3">
                                <div className="flex-1">
                                    <h5 className="font-bold text-sm text-slate-800">{item.name}</h5>
                                    <p className="text-xs text-slate-500">Unit Price: Rs. {Number(item.price).toFixed(2)}</p>
                                </div>

                                <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                                    <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1">
                                        <button onClick={() => updateQty(item.id, -1)} className="p-1 text-slate-600 hover:bg-slate-100 rounded-lg">
                                            <Minus size={14} />
                                        </button>
                                        <span className="px-3 text-xs font-bold text-slate-800">{item.qty}</span>
                                        <button onClick={() => updateQty(item.id, 1)} className="p-1 text-slate-600 hover:bg-slate-100 rounded-lg">
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    <span className="font-extrabold text-blue-600 text-sm w-24 text-right">
                                        Rs. {(Number(item.price) * item.qty).toFixed(2)}
                                    </span>

                                    <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 p-1.5 transition">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right Column: Summary & Payment Section */}
            <div className="w-full lg:w-96 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-5 h-fit shrink-0">
                <h3 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3">
                    Payment Summary
                </h3>

                <div className="space-y-3 text-xs text-slate-600">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-bold text-slate-800">Rs. {subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span>Discount (LKR)</span>
                        <input
                            type="number"
                            min="0"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            className="w-24 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-right text-xs outline-none focus:border-blue-500 font-bold"
                        />
                    </div>

                    <div className="flex justify-between font-extrabold text-base text-slate-900 pt-3 border-t border-slate-100">
                        <span>Net Total</span>
                        <span className="text-blue-600">Rs. {netTotal.toFixed(2)}</span>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold text-slate-700">Select Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { id: 'CASH', label: 'CASH', icon: Banknote },
                            { id: 'CARD', label: 'CARD', icon: CreditCard },
                            { id: 'QR', label: 'QR', icon: QrCode },
                        ].map((method) => {
                            const Icon = method.icon;
                            const isSelected = paymentMethod === method.id;
                            return (
                                <button
                                    key={method.id}
                                    onClick={() => setPaymentMethod(method.id)}
                                    className={`py-2.5 rounded-xl text-xs font-bold border flex flex-col items-center justify-center gap-1 transition ${
                                        isSelected
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                    }`}
                                >
                                    <Icon size={16} />
                                    {method.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <button
                    onClick={handleCheckout}
                    disabled={cart.length === 0 || checkoutLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-200 flex justify-center items-center gap-2 text-xs sm:text-sm"
                >
                    {checkoutLoading ? 'Processing Payment...' : 'Proceed to Payment'}
                </button>
            </div>

        </div>
    );
}