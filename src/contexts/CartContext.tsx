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
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (id: string) => void;
    cartCount: number;
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

    const addToCart = (product: Omit<CartItem, 'quantity'>) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(item => item.id === product.id);
            let newCart;
            if (existingItem) {
                newCart = prevCart.map(item => 
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                newCart = [...prevCart, { ...product, quantity: 1 }];
            }
            localStorage.setItem('salon-cart', JSON.stringify(newCart));
            return newCart;
        });
    };

    const removeFromCart = (id: string) => {
        setCart((prevCart) => {
            const newCart = prevCart.filter(item => item.id !== id);
            localStorage.setItem('salon-cart', JSON.stringify(newCart));
            return newCart;
        });
    };

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
