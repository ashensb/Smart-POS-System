import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('smart_pos_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('smart_pos_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity = 1) => {
        setCart((prevCart) => {
            const existingIndex = prevCart.findIndex((item) => item.id === product.id);
            if (existingIndex > -1) {
                const updated = [...prevCart];
                const newQty = updated[existingIndex].qty + quantity;
                if (newQty > product.stock_quantity) {
                    alert(`Cannot add more than available stock (${product.stock_quantity})`);
                    return prevCart;
                }
                updated[existingIndex].qty = newQty;
                return updated;
            } else {
                if (quantity > product.stock_quantity) {
                    alert(`Cannot add more than available stock (${product.stock_quantity})`);
                    return prevCart;
                }
                return [...prevCart, { ...product, qty: quantity }];
            }
        });
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
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        setCart([]);
    };

    const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQty, removeFromCart, clearCart, totalCartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);