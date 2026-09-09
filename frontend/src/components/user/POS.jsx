import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import ReceiptModal from './ReceiptModal';
import { 
    Search, 
    ShoppingCart, 
    Plus, 
    Minus, 
    Trash2, 
    CreditCard, 
    QrCode, 
    Banknote, 
    Layers 
} from 'lucide-react';

export default function POS() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [discount, setDiscount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [loading, setLoading] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    const [completedSale, setCompletedSale] = useState(null);
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);

    useEffect(() => {
        fetchPOSData();
    }, []);

    const fetchPOSData = async () => {
        setLoading(true);
        try {
            const res = await API.get('/pos/data');
            setCategories(res.data.categories || []);
            setProducts(res.data.products || []);
        } catch (err) {
            console.error('Error loading POS data:', err);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product) => {
        const existingIndex = cart.findIndex((item) => item.id === product.id);

        if (existingIndex > -1) {
            const updatedCart = [...cart];
            if (updatedCart[existingIndex].qty + 1 > product.stock_quantity) {
                alert(`Cannot add more than available stock (${product.stock_quantity})`);
                return;
            }
            updatedCart[existingIndex].qty += 1;
            setCart(updatedCart);
        } else {
            setCart([...cart, { ...product, qty: 1 }]);
        }
    };

    const updateQty = (id, delta) => {
        setCart((prevCart) =>
            prevCart
                .map((item) => {
                    if (item.id === id) {
                        const newQty = item.qty + delta;
                        if (newQty > item.stock_quantity) {
                            alert(`Maximum stock reached (${item.stock_quantity})`);
                            return item;
                        }
                        return newQty > 0 ? { ...item, qty: newQty } : null;
                    }
                    return item;
                })
                .filter(Boolean)
        );
    };

    const removeFromCart = (id) => {
        setCart(cart.filter((item) => item.id !== id));
    };

    const filteredProducts = products.filter((p) => {
        const matchesCategory = selectedCategory === 'ALL' || p.category_id === Number(selectedCategory);
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
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
                price: item.price,
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
                setIsReceiptOpen(true);
                setCart([]);
                setDiscount(0);
                fetchPOSData();
            }
        } catch (err) {
            console.error('Checkout failed:', err);
            alert(err.response?.data?.message || 'Checkout failed.');
        } finally {
            setCheckoutLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-full w-full bg-slate-100 overflow-y-auto lg:overflow-hidden">
            {/* LEFT SIDE: Category Bar & Product Grid */}
            <div className="flex-1 flex flex-col p-4 md:p-5 space-y-4 min-w-0 overflow-y-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-800">POS Checkout Terminal</h1>
                        <p className="text-slate-500 text-xs">Select items to create invoice & update inventory</p>
                    </div>

                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search product name or SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-blue-500 shadow-sm"
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    <button
                        onClick={() => setSelectedCategory('ALL')}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                            selectedCategory === 'ALL'
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                        }`}
                    >
                        <Layers size={14} /> All Categories
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                                selectedCategory === cat.id
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="text-center py-20 text-slate-400">Loading products...</div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-20 text-slate-400">No products available.</div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                            {filteredProducts.map((p) => (
                                <div
                                    key={p.id}
                                    onClick={() => addToCart(p)}
                                    className="bg-white p-3.5 md:p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group active:scale-95"
                                >
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-xs md:text-sm group-hover:text-blue-600 transition truncate">{p.name}</h4>
                                        <p className="text-[10px] text-slate-400">SKU: {p.sku || 'N/A'}</p>
                                    </div>
                                    <div className="mt-3 md:mt-4 flex justify-between items-center">
                                        <span className="font-bold text-blue-600 text-xs md:text-sm">Rs. {Number(p.price).toFixed(2)}</span>
                                        <span className={`text-[10px] font-bold px-1.5 md:px-2 py-0.5 rounded-full ${p.stock_quantity < 5 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                            Stock: {p.stock_quantity}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT SIDE: Cart Area */}
            <div className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col shrink-0 lg:h-full shadow-lg">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                        <ShoppingCart size={18} className="text-blue-600" /> Current Order
                    </h3>
                    <span className="bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-full font-bold">
                        {cart.reduce((sum, item) => sum + item.qty, 0)} Items
                    </span>
                </div>

                <div className="max-h-60 lg:max-h-none flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.length === 0 ? (
                        <div className="text-center py-10 lg:py-20 text-slate-400 text-xs">
                            Cart is empty<br />Click products to add
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex-1 pr-2 overflow-hidden">
                                    <h5 className="font-semibold text-xs text-slate-800 truncate">{item.name}</h5>
                                    <p className="text-[11px] text-slate-500">Rs. {Number(item.price).toFixed(2)}</p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <div className="flex items-center bg-white rounded-lg border border-slate-200">
                                        <button onClick={() => updateQty(item.id, -1)} className="p-1 text-slate-600 hover:bg-slate-100 rounded-l-lg">
                                            <Minus size={12} />
                                        </button>
                                        <span className="px-2 text-xs font-bold text-slate-800">{item.qty}</span>
                                        <button onClick={() => updateQty(item.id, 1)} className="p-1 text-slate-600 hover:bg-slate-100 rounded-r-lg">
                                            <Plus size={12} />
                                        </button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 p-1">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
                    <div className="space-y-1.5 text-xs text-slate-600">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-semibold text-slate-800">Rs. {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Discount (LKR)</span>
                            <input
                                type="number"
                                min="0"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                                className="w-20 px-2 py-1 bg-white border border-slate-200 rounded-lg text-right text-xs outline-none focus:border-blue-500 font-semibold"
                            />
                        </div>
                        <div className="flex justify-between font-bold text-base text-slate-900 pt-2 border-t border-slate-200">
                            <span>Net Total</span>
                            <span className="text-blue-600">Rs. {netTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2">
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
                                    className={`py-2 rounded-xl text-xs font-bold border flex flex-col items-center justify-center gap-1 transition ${
                                        isSelected
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                                    }`}
                                >
                                    <Icon size={14} />
                                    {method.label}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || checkoutLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl transition shadow-md shadow-blue-200 flex justify-center items-center gap-2 text-sm"
                    >
                        {checkoutLoading ? 'Processing Order...' : 'Complete Order'}
                    </button>
                </div>
            </div>

            <ReceiptModal
                isOpen={isReceiptOpen}
                onClose={() => setIsReceiptOpen(false)}
                sale={completedSale}
            />
        </div>
    );
}