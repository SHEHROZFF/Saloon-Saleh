import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import Button from '../ui/Button';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
    const { cart, removeFromCart, cartCount } = useCart();
    const cartTotal = cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110]"
                    />

                    {/* Drawer Content */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 w-full max-w-md h-full bg-salon-base z-[120] shadow-2xl flex flex-col pt-24"
                    >
                        <div className="px-8 pb-6 border-b border-salon-golden/10 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-serif text-salon-primary">Shopping Bag</h2>
                                <p className="text-[10px] uppercase tracking-widest text-salon-golden-muted mt-1">{cartCount} Items</p>
                            </div>
                            <button 
                                onClick={onClose}
                                className="w-10 h-10 rounded-full border border-salon-golden/20 flex items-center justify-center text-salon-primary"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 bg-salon-surface rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8 text-salon-golden/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <p className="text-salon-golden-muted italic">Your bag is currently empty.</p>
                                    <Button onClick={onClose} variant="link" className="mt-4 text-salon-golden">Start Shopping</Button>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <motion.div 
                                        layout
                                        key={item.id} 
                                        className="flex gap-4 group"
                                    >
                                        <div className="w-24 h-24 bg-salon-surface rounded-sm overflow-hidden flex-shrink-0 border border-salon-golden/5">
                                            <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-sm font-serif text-salon-primary">{item.title}</h3>
                                                    <button 
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-salon-muted hover:text-salon-accent transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <p className="text-[10px] uppercase tracking-widest text-salon-golden-muted mt-1">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-serif text-lg text-salon-golden">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-8 bg-salon-surface border-t border-salon-golden/10 space-y-6">
                                <div className="flex justify-between items-center text-salon-primary">
                                    <span className="text-xs uppercase tracking-[0.2em] font-medium">Subtotal</span>
                                    <span className="text-2xl font-serif text-salon-golden">${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    <Button variant="golden" className="w-full h-14 text-sm tracking-[0.2em]">
                                        Checkout Now
                                    </Button>
                                    <Button onClick={onClose} variant="ghost" className="w-full h-12 text-[10px] tracking-[0.2em]">
                                        Continue Browsing
                                    </Button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
