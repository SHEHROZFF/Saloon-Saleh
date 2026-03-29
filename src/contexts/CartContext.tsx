import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
    id: string;
    title: string;
    brand: string;
    price: string;
    img: string;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
    updateQuantity: (id: string, quantity: number) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        const storedCart = localStorage.getItem('salon-cart');
        if (storedCart) {
            try {
                setCart(JSON.parse(storedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    const saveCart = (newCart: CartItem[]) => {
        setCart(newCart);
        localStorage.setItem('salon-cart', JSON.stringify(newCart));
    };

    const addToCart = (product: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(item => item.id === product.id);
            let newCart;
            if (existingItem) {
                newCart = prevCart.map(item => 
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            } else {
                newCart = [...prevCart, { ...product, quantity }];
            }
            localStorage.setItem('salon-cart', JSON.stringify(newCart));
            return newCart;
        });
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(id);
            return;
        }
        const newCart = cart.map(item => item.id === id ? { ...item, quantity } : item);
        saveCart(newCart);
    };

    const removeFromCart = (id: string) => {
        const newCart = cart.filter(item => item.id !== id);
        saveCart(newCart);
    };

    const clearCart = () => {
        saveCart([]);
    };

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, cartCount, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
