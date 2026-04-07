import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../services/api/productService';
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
            price: product.price.toString(),
            img: product.image_url
        }, quantity);
        onClose();
    };

    // Professional Stacking Context Fix: Teleport to Body
    return createPortal(
        <AnimatePresence>
            {product && (
                <>
                    {/* Backdrop */}
                    {/* <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    /> */}

                    {/* Drawer Content - 75% Width */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                        className="fixed top-0 right-0 w-full md:w-[75%] h-full bg-salon-base z-[100] shadow-2xl flex flex-col md:flex-row overflow-hidden"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-8 right-8 z-[110000] w-10 h-10 rounded-full border border-salon-golden/20 flex items-center justify-center text-salon-primary hover:border-salon-golden hover:text-salon-golden transition-all bg-salon-base/50 backdrop-blur-md"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Left: Immersive Image (Mock Gallery) */}
                        <div className="w-full md:w-[45%] h-[40vh] md:h-full bg-black relative group flex-shrink-0">
                            <motion.img
                                initial={{ scale: 1.1, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 1.2 }}
                                src={product.image_url}
                                alt={product.title}
                                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

                            {/* Decorative Brand Badge */}
                            <div className="absolute bottom-10 left-10">
                                <span className="text-[9px] uppercase tracking-[0.5em] text-white/50 mb-2 block font-bold">The Collection</span>
                                <h3 className="text-xl font-serif text-white italic">Saloon Saleh</h3>
                            </div>
                        </div>

                        {/* Right: Detailed Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar bg-salon-base p-8 md:p-12  flex flex-col">
                            <div className="mb-5">
                                <span className="text-[10px] uppercase tracking-[0.5em] text-salon-golden mb-3 block font-bold">{product.brand}</span>
                                <h2 className="text-3xl md:text-4xl font-serif mb-3 leading-[1.1] tracking-tighter text-salon-primary">{product.title}</h2>
                                <p className="text-2xl font-serif text-salon-golden/90 tracking-tighter">${product.price}</p>
                            </div>

                            <div className="space-y-2 flex-1">
                                {/* Short Description */}
                                <p className="text-[14px] text-salon-golden-muted leading-relaxed font-light italic border-l-2 border-salon-golden/20 pl-6 max-w-xl">
                                    "{product.description}"
                                </p>

                                {/* Long Details */}
                                <div className="space-y-2">
                                    <h4 className="text-[10px] uppercase tracking-[0.4em] text-salon-primary font-bold border-b border-salon-golden/10 pb-3 inline-block">The Ritual Detail</h4>
                                    <p className="text-[13px] text-salon-golden-muted leading-relaxed font-light max-w-xl">{product.details}</p>
                                </div>

                                {/* Usage & Benefits */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-2">
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] uppercase tracking-[0.4em] text-salon-primary font-bold">The Ceremony</h4>
                                        <p className="text-[12px] text-salon-golden-muted leading-relaxed font-light">{product.usage_instructions}</p>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] uppercase tracking-[0.4em] text-salon-primary font-bold">Key Benefits</h4>
                                        <ul className="space-y-2">
                                            {product.benefits.map((benefit, i) => (
                                                <li key={i} className="text-[11px] text-salon-golden-muted flex items-start gap-2.5">
                                                    <span className="w-1 h-1 bg-salon-golden rounded-full mt-1.5 shrink-0 opacity-50" />
                                                    {benefit}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Sticky-like Footer Action */}
                            <div className="mt-6 pt-4 border-t border-salon-golden/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-5">
                                {/* Quantity Selector */}
                                <div className="flex items-center border border-salon-golden/20 bg-salon-surface/50 h-14">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-14 h-full flex items-center justify-center text-salon-golden hover:bg-salon-golden hover:text-black transition-all text-lg"
                                    >
                                        -
                                    </button>
                                    <span className="w-14 text-center text-base font-serif text-salon-primary">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-14 h-full flex items-center justify-center text-salon-golden hover:bg-salon-golden hover:text-black transition-all text-lg"
                                    >
                                        +
                                    </button>
                                </div>

                                <Button
                                    onClick={handleAdd}
                                    variant="golden"
                                    className="flex-1 h-14 !text-[9px] font-bold uppercase"
                                >
                                    Add to Bag ${(parseFloat(product.price.toString()) * quantity).toFixed(2)}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default ProductPopup;
