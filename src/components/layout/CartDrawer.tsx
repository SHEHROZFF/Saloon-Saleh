import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import Button from '../ui/Button';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
    const { cart, removeFromCart, cartCount } = useCart();
    const navigate = useNavigate();
    const cartTotal = cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);

    const goToCart = () => {
        onClose();
        navigate('/cart');
    };

    const goToCheckout = () => {
        onClose();
        navigate('/checkout');
    };

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
                                <h2 className="text-2xl font-serif text-salon-primary uppercase tracking-tighter">Shopping Bag</h2>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-salon-golden-muted mt-2 font-bold">{cartCount} Rituals Added</p>
                            </div>
                            <button 
                                onClick={onClose}
                                className="w-10 h-10 rounded-full border border-salon-golden/20 flex items-center justify-center text-salon-primary hover:border-salon-golden hover:text-salon-golden transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 custom-scrollbar">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                                    <div className="w-24 h-24 bg-salon-surface rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(212,175,55,0.05)] border border-salon-golden/10">
                                        <svg className="w-10 h-10 text-salon-golden/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <p className="text-salon-golden-muted italic font-light">Your ritual collection is currently empty.</p>
                                    <Button onClick={onClose} variant="link" className="mt-6 text-salon-golden uppercase tracking-widest text-[9px] font-bold">Start Exploring</Button>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <motion.div 
                                        layout
                                        key={item.id} 
                                        className="flex gap-6 group"
                                    >
                                        <div className="w-28 h-28 bg-salon-surface rounded-sm overflow-hidden flex-shrink-0 border border-salon-golden/5 relative shadow-lg group-hover:border-salon-golden/20 transition-all duration-500">
                                            <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-2">
                                            <div>
                                                <div className="flex justify-between items-start gap-4">
                                                    <div>
                                                        <p className="text-[9px] uppercase tracking-[0.2em] text-salon-golden font-bold mb-1">{item.brand}</p>
                                                        <h3 className="text-sm font-serif text-salon-primary leading-tight group-hover:text-salon-golden transition-colors">{item.title}</h3>
                                                    </div>
                                                    <button 
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-salon-golden-muted hover:text-red-500 transition-colors pt-1"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <p className="text-[10px] uppercase tracking-[0.2em] text-salon-golden-muted/60 mt-2 font-light">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-serif text-xl text-salon-golden/90 tracking-tighter">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-8 bg-salon-surface border-t border-salon-golden/10 space-y-6 shadow-[0_-20px_50px_rgba(0,0,0,0.2)]">
                                <div className="flex justify-between items-center text-salon-primary mb-2">
                                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-salon-golden-muted">Bag Subtotal</span>
                                    <span className="text-3xl font-serif text-salon-golden tracking-tighter">${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Button onClick={goToCart} variant="outline" className="h-14 text-[10px] tracking-[0.3em] border-salon-golden/20 hover:border-salon-golden/60 uppercase">
                                        View Bag
                                    </Button>
                                    <Button onClick={goToCheckout} variant="golden" className="h-14 text-[10px] tracking-[0.3em] font-bold uppercase shadow-[0_10px_30px_rgba(212,175,55,0.1)]">
                                        Checkout
                                    </Button>
                                    <Button onClick={onClose} variant="ghost" className="sm:col-span-2 h-10 text-[9px] tracking-[0.4em] uppercase text-salon-golden-muted opacity-60 hover:opacity-100 italic">
                                        Continue Shopping
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
