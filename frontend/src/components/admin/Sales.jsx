import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { ShoppingBag, Plus, Minus, Trash2, CheckCircle, Search } from 'lucide-react';

export default function Sales() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [discount, setDiscount] = useState(0);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await API.get('/admin/products');
            setProducts(res.data);
        } catch (err) {
            console.error('Error fetching products', err);
        }
    };

    const addToCart = (product) => {
        const existing = cart.find((item) => item.product_id === product.id);
        if (existing) {
            if (existing.quantity + 1 > product.stock_quantity) {
                alert('Stock limit reached!');
                return;
            }
            setCart(cart.map((item) =>
                item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            if (product.stock_quantity < 1) {
                alert('Out of stock!');
                return;
            }
            setCart([...cart, { product_id: product.id, name: product.name, price: product.price, quantity: 1 }]);
        }
    };

    const updateQuantity = (id, delta) => {
        setCart(cart.map((item) => {
            if (item.product_id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : item;
            }
            return item;
        }));
    };

    const removeFromCart = (id) => {
        setCart(cart.filter((item) => item.product_id !== id));
    };

    const calculateSubtotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const calculateNetTotal = () => Math.max(0, calculateSubtotal() - Number(discount));

    const handleCheckout = async () => {
        if (cart.length === 0) return alert('Cart is empty!');

        try {
            const payload = {
                items: cart,
                payment_method: paymentMethod,
                discount: Number(discount),
            };

            await API.post('/admin/sales', payload);
            alert('Sale Completed Successfully!');
            setCart([]);
            setDiscount(0);
            fetchProducts();
        } catch (err) {
            alert(err.response?.data?.message || 'Error processing sale');
        }
    };

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.includes(searchTerm)
    );

    return (
        <div className="p-6 bg-slate-50 min-h-screen flex flex-col lg:flex-row gap-6">
            {/* Left Column: Product Grid */}
            <div className="flex-1 space-y-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-slate-800">POS Checkout</h1>
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by name or SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-blue-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.map((p) => (
                        <div
                            key={p.id}
                            onClick={() => addToCart(p)}
                            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition flex flex-col justify-between"
                        >
                            <div>
                                <h3 className="font-semibold text-slate-800 text-sm">{p.name}</h3>
                                <p className="text-xs text-slate-400 font-mono mt-1">SKU: {p.sku}</p>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                                <span className="font-bold text-blue-600 text-sm">Rs. {Number(p.price).toFixed(2)}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${p.stock_quantity > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                    Qty: {p.stock_quantity}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Column: Checkout Cart Panel */}
            <div className="w-full lg:w-96 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 pb-3 border-b border-slate-100 flex items-center gap-2">
                        <ShoppingBag size={20} className="text-blue-600" /> Current Order
                    </h2>

                    <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto my-3">
                        {cart.length === 0 ? (
                            <p className="text-center py-10 text-slate-400 text-sm">Cart is empty</p>
                        ) : (
                            cart.map((item) => (
                                <div key={item.product_id} className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-slate-800 text-sm">{item.name}</p>
                                        <p className="text-xs text-slate-500">Rs. {Number(item.price).toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateQuantity(item.product_id, -1)} className="p-1 bg-slate-100 rounded hover:bg-slate-200">
                                            <Minus size={12} />
                                        </button>
                                        <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.product_id, 1)} className="p-1 bg-slate-100 rounded hover:bg-slate-200">
                                            <Plus size={12} />
                                        </button>
                                        <button onClick={() => removeFromCart(item.product_id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Pricing & Checkout Summary */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                    <div className="flex justify-between text-sm text-slate-600">
                        <span>Subtotal</span>
                        <span>Rs. {calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-slate-600">
                        <span>Discount (LKR)</span>
                        <input
                            type="number"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            className="w-20 text-right border border-slate-200 rounded px-2 py-1 text-xs"
                        />
                    </div>
                    <div className="flex justify-between font-bold text-slate-800 text-base pt-2 border-t border-slate-100">
                        <span>Net Total</span>
                        <span className="text-blue-600">Rs. {calculateNetTotal().toFixed(2)}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2">
                        {['cash', 'card', 'qr'].map((method) => (
                            <button
                                key={method}
                                onClick={() => setPaymentMethod(method)}
                                className={`py-1.5 text-xs font-semibold rounded-lg uppercase border transition ${paymentMethod === method ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >
                                {method}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleCheckout}
                        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition flex justify-center items-center gap-2"
                    >
                        <CheckCircle size={18} /> Complete Order
                    </button>
                </div>
            </div>
        </div>
    );
}