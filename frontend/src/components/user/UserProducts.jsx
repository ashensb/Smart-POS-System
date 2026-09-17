import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useCart } from '../../context/CartContext';
import { 
    Search, 
    Layers, 
    Package, 
    Plus, 
    X, 
    ShoppingCart, 
    Check, 
    Info, 
    Tag 
} from 'lucide-react';

export default function UserProducts() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    // Selected product for Details Modal
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalQty, setModalQty] = useState(1);
    const [addedSuccess, setAddedSuccess] = useState(false);

    const { addToCart } = useCart();

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

    const filteredProducts = products.filter((p) => {
        const matchesCategory = selectedCategory === 'ALL' || String(p.category_id) === String(selectedCategory);
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }
        let cleanPath = imagePath.replace(/^\//, '');
        if (cleanPath.startsWith('storage/')) {
            cleanPath = cleanPath.replace(/^storage\//, '');
        }

        const apiBaseUrl = API.defaults.baseURL 
            ? API.defaults.baseURL.replace(/\/api\/?$/, '') 
            : 'http://localhost:8000';

        return `${apiBaseUrl}/storage/${cleanPath}`;
    };

    const openProductModal = (product) => {
        setSelectedProduct(product);
        setModalQty(1);
        setAddedSuccess(false);
    };

    const closeModal = () => {
        setSelectedProduct(null);
    };

    const handleAddToCartFromModal = () => {
        if (selectedProduct) {
            addToCart(selectedProduct, modalQty);
            setAddedSuccess(true);
            setTimeout(() => {
                setAddedSuccess(false);
            }, 2000);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-100 overflow-y-auto p-4 sm:p-6 space-y-5">
            
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Products Catalog</h1>
                    <p className="text-slate-500 text-xs sm:text-sm">Explore our products and select items to purchase</p>
                </div>

                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search products by name or SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition shadow-sm"
                    />
                </div>
            </div>

            {/* Categories Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none shrink-0">
                <button
                    onClick={() => setSelectedCategory('ALL')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition flex items-center gap-2 ${
                        selectedCategory === 'ALL'
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                            : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                >
                    <Layers size={16} /> All Categories
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
                            String(selectedCategory) === String(cat.id)
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                        }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            <div className="flex-1">
                {loading ? (
                    <div className="text-center py-20 text-slate-400 text-sm">Loading products catalog...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20 text-slate-400 text-sm bg-white rounded-2xl border border-slate-200">
                        No products available in this category.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredProducts.map((p) => (
                            <div
                                key={p.id}
                                onClick={() => openProductModal(p)}
                                className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-400 transition duration-300 cursor-pointer flex flex-col justify-between group relative"
                            >
                                <div className="space-y-3">
                                    <div className="w-full h-40 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center border border-slate-100 relative">
                                        {p.image ? (
                                            <img 
                                                src={getImageUrl(p.image)} 
                                                alt={p.name} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                onError={(e) => {
                                                    e.target.onerror = null; 
                                                    e.target.src = 'https://placehold.co/300x200?text=No+Image';
                                                }}
                                            />
                                        ) : (
                                            <Package size={40} className="text-slate-300" />
                                        )}
                                        {p.stock_quantity <= 5 && (
                                            <span className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                                                Low Stock
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition truncate leading-snug">
                                            {p.name}
                                        </h4>
                                        <p className="text-[11px] text-slate-400 mt-0.5">SKU: {p.sku || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-between items-center pt-3 border-t border-slate-100">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Price</span>
                                        <span className="font-extrabold text-blue-600 text-sm sm:text-base">
                                            Rs. {Number(p.price).toFixed(2)}
                                        </span>
                                    </div>

                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addToCart(p);
                                        }}
                                        className="bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white p-2 rounded-xl transition duration-200 flex items-center gap-1 font-semibold text-xs"
                                        title="Quick Add to Cart"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* PRODUCT DETAILS MODAL */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-6 border border-slate-100">
                        
                        {/* Close button */}
                        <button 
                            onClick={closeModal}
                            className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-full transition z-10"
                        >
                            <X size={18} />
                        </button>

                        {/* Image side */}
                        <div className="w-full md:w-1/2 h-64 md:h-auto bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center shrink-0">
                            {selectedProduct.image ? (
                                <img 
                                    src={getImageUrl(selectedProduct.image)} 
                                    alt={selectedProduct.name} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Package size={64} className="text-slate-300" />
                            )}
                        </div>

                        {/* Details side */}
                        <div className="w-full md:w-1/2 flex flex-col justify-between space-y-4">
                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold">
                                    <Tag size={12} />
                                    <span>Category ID: {selectedProduct.category_id || 'General'}</span>
                                </div>

                                <h2 className="text-xl font-bold text-slate-800 leading-tight">
                                    {selectedProduct.name}
                                </h2>

                                <p className="text-2xl font-extrabold text-blue-600">
                                    Rs. {Number(selectedProduct.price).toFixed(2)}
                                </p>

                                <div className="space-y-1 text-xs text-slate-500 border-t border-b border-slate-100 py-3">
                                    <p className="flex justify-between">
                                        <span className="font-medium text-slate-600">Availability:</span>
                                        <span className={`font-bold ${selectedProduct.stock_quantity > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                            {selectedProduct.stock_quantity > 0 ? `In Stock (${selectedProduct.stock_quantity})` : 'Out of Stock'}
                                        </span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="font-medium text-slate-600">Product Code / SKU:</span>
                                        <span className="font-mono text-slate-700">{selectedProduct.sku || 'N/A'}</span>
                                    </p>
                                </div>

                                {selectedProduct.description && (
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        {selectedProduct.description}
                                    </p>
                                )}
                            </div>

                            {/* Modal Action Controls */}
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-semibold text-slate-600">Quantity:</span>
                                    <div className="flex items-center bg-slate-100 rounded-xl border border-slate-200">
                                        <button 
                                            onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                                            className="px-3 py-1.5 text-slate-600 font-bold hover:bg-slate-200 rounded-l-xl"
                                        >
                                            -
                                        </button>
                                        <span className="px-3 text-xs font-bold text-slate-800">{modalQty}</span>
                                        <button 
                                            onClick={() => setModalQty((q) => Math.min(selectedProduct.stock_quantity, q + 1))}
                                            className="px-3 py-1.5 text-slate-600 font-bold hover:bg-slate-200 rounded-r-xl"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddToCartFromModal}
                                    disabled={selectedProduct.stock_quantity <= 0}
                                    className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm flex justify-center items-center gap-2 transition shadow-lg ${
                                        addedSuccess 
                                            ? 'bg-emerald-600 text-white shadow-emerald-200'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 disabled:bg-slate-300'
                                    }`}
                                >
                                    {addedSuccess ? (
                                        <>
                                            <Check size={18} /> Added to Cart!
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart size={18} /> Add to Cart
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}