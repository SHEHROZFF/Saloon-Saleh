import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../services/mockData';
import { useCart } from '../../contexts/CartContext';
import Button from '../ui/Button';

interface ProductPopupProps {
    product: Product | null;
    onClose: () => void;
}

const ProductPopup: React.FC<ProductPopupProps> = ({ product, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    if (!product) return null;

    const handleAdd = () => {
        addToCart({
            id: product.id,
            title: product.title,
            brand: product.brand,
            price: product.price,
            img: product.img
        }, quantity);
        onClose();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-salon-base/90 backdrop-blur-md"
                />

                {/* Modal Content */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-5xl bg-salon-surface border border-salon-golden/10 shadow-2xl flex flex-col md:flex-row max-h-[90vh] overflow-hidden"
                >
                    {/* Close Button */}
                    <button 
                        onClick={onClose}
                        className="absolute top-6 right-6 z-10 text-salon-golden-muted hover:text-salon-primary transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Left: Image Gallery (Mock) */}
                    <div className="w-full md:w-1/2 h-80 md:h-auto bg-black/20 relative group">
                        <img 
                            src={product.img} 
                            alt={product.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-salon-base/40 to-transparent" />
                    </div>

                    {/* Right: Info */}
                    <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto custom-scrollbar flex flex-col">
                        <div className="mb-8">
                            <span className="text-[10px] uppercase tracking-[0.4em] text-salon-golden mb-2 block">{product.brand}</span>
                            <h2 className="text-3xl md:text-4xl font-serif mb-4 leading-tight">{product.title}</h2>
                            <p className="text-2xl font-serif text-salon-golden">${product.price}</p>
                        </div>

                        <div className="space-y-8 flex-1">
                            {/* Short Description */}
                            <p className="text-sm text-salon-golden-muted leading-relaxed font-light italic border-l-2 border-salon-golden/20 pl-4">
                                "{product.description}"
                            </p>

                            {/* Long Details */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] uppercase tracking-widest text-salon-primary font-bold">The Details</h4>
                                <p className="text-sm text-salon-golden-muted leading-relaxed font-light">{product.details}</p>
                            </div>

                            {/* Usage & Benefits */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-salon-golden/10">
                                <div className="space-y-3">
                                    <h4 className="text-[10px] uppercase tracking-widest text-salon-primary font-bold">Ritual</h4>
                                    <p className="text-[12px] text-salon-golden-muted leading-relaxed font-light">{product.usage}</p>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-[10px] uppercase tracking-widest text-salon-primary font-bold">Key Benefits</h4>
                                    <ul className="space-y-2">
                                        {product.benefits.map((benefit, i) => (
                                            <li key={i} className="text-[11px] text-salon-golden-muted flex items-start gap-2">
                                                <span className="w-1 h-1 bg-salon-golden rounded-full mt-1.5 shrink-0" />
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Add to Cart Footer */}
                        <div className="mt-12 pt-8 border-t border-salon-golden/10 flex flex-col sm:flex-row items-center gap-6">
                            {/* Quantity Selector */}
                            <div className="flex items-center border border-salon-golden/20 bg-salon-base/50">
                                <button 
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-12 h-12 flex items-center justify-center text-salon-golden hover:bg-salon-golden hover:text-black transition-all"
                                >
                                    -
                                </button>
                                <span className="w-12 text-center text-sm font-serif">{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-12 h-12 flex items-center justify-center text-salon-golden hover:bg-salon-golden hover:text-black transition-all"
                                >
                                    +
                                </button>
                            </div>

                            <Button 
                                onClick={handleAdd}
                                variant="golden" 
                                className="flex-1 w-full py-4 text-xs tracking-[0.2em]"
                            >
                                Add to Bag — ${(parseFloat(product.price) * quantity).toFixed(2)}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ProductPopup;
