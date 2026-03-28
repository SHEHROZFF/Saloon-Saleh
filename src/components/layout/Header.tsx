import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useCart } from '../../contexts/CartContext';
import Button from '../ui/Button';
import MobileNav from './MobileNav';
import CartDrawer from './CartDrawer';

const Header = () => {
    const { scrollY } = useScroll();
    const { theme, toggleTheme } = useTheme();
    const { cart, cartCount } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    
    const cartTotal = cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);

    // Prevent scrolling when mobile menu/cart is open
    useEffect(() => {
        if (isMobileMenuOpen || isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen, isCartOpen]);

    // Add a dark/light glass effect when scrolling past the hero
    const backgroundColor = useTransform(
        scrollY,
        [0, 100],
        ["rgba(0, 0, 0, 0)", "var(--salon-base)"]
    );

    const backdropBlur = useTransform(
        scrollY,
        [0, 100],
        ["blur(0px)", "blur(12px)"]
    );

    const borderBottom = useTransform(
        scrollY,
        [0, 100],
        ["1px solid rgba(197, 160, 89, 0.1)", "1px solid rgba(197, 160, 89, 0.3)"]
    );

    return (
        <>
            <motion.header
                style={{ backgroundColor, backdropFilter: backdropBlur, borderBottom }}
                className="fixed top-0 w-full px-6 md:px-12 py-4 flex justify-between items-center z-[100] transition-colors duration-300"
            >
                <div className="flex items-center gap-3 cursor-pointer z-50">
                    <img src="/Main_logo_wo_BG.png" alt="Saloon Saleh Logo" className="w-8 h-8 object-contain" />
                    <div className="flex flex-col -gap-1">
                        <span className="text-lg md:text-xl font-serif text-salon-primary tracking-tighter leading-none">SALOON SALEH</span>
                        <span className="text-[8px] uppercase tracking-[0.3em] text-salon-golden-muted">Haute Coiffure Homme</span>
                    </div>
                </div>

                <nav className="hidden lg:flex items-center gap-10 text-[9px] uppercase tracking-[0.3em] text-salon-golden-muted font-medium z-50">
                    <a href="/#expertise" className="hover:text-salon-golden transition-colors duration-300">Expertise</a>
                    <a href="/booking" className="hover:text-salon-golden transition-colors duration-300">Booking</a>
                    <a href="/shop" className="hover:text-salon-golden transition-colors duration-300">Shop</a>
                </nav>

                <div className="flex items-center gap-3 md:gap-4 z-50">
                    {/* Refined Theme Switcher - High Visibility */}
                    <button
                        onClick={toggleTheme}
                        className="w-11 h-11 rounded-full border border-salon-golden/40 flex items-center justify-center text-salon-primary hover:bg-salon-golden hover:text-salon-base transition-all duration-300 relative overflow-hidden bg-salon-surface/30 backdrop-blur-sm group/theme"
                        aria-label="Toggle theme"
                    >
                        <div className="relative w-5 h-5 md:w-6 md:h-6">
                            <AnimatePresence mode="wait">
                                {theme === 'dark' ? (
                                    <motion.svg 
                                        key="sun"
                                        initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        exit={{ opacity: 0, scale: 0.8, rotate: 45 }}
                                        className="w-full h-full absolute inset-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                                    >
                                        <circle cx="12" cy="12" r="4" />
                                        <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                                    </motion.svg>
                                ) : (
                                    <motion.svg 
                                        key="moon"
                                        initial={{ opacity: 0, scale: 0.8, rotate: 45 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        exit={{ opacity: 0, scale: 0.8, rotate: -45 }}
                                        className="w-full h-full absolute inset-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                                    </motion.svg>
                                )}
                            </AnimatePresence>
                        </div>
                    </button>

                    {/* Cart Icon */}
                    <div 
                        onClick={() => setIsCartOpen(true)}
                        className="relative cursor-pointer w-11 h-11 flex flex-col justify-center items-center text-salon-primary hover:text-salon-golden transition-colors group"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                        </svg>
                        {cartCount > 0 && (
                            <span className="absolute top-1 right-1 bg-salon-golden text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform">
                                {cartCount}
                            </span>
                        )}

                        {/* Dropdown Receipt Hover (Desktop Only) */}
                        <div className="absolute top-full right-0 mt-2 w-[20rem] bg-salon-base border border-salon-golden/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-md opacity-0 invisible group-hover:opacity-100 lg:group-hover:visible transition-all duration-300 z-[999] flex flex-col pointer-events-none group-hover:pointer-events-auto overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-salon-base before:-z-10 hidden lg:flex">
                            <div className="p-3 border-b border-salon-golden/10 bg-salon-surface relative z-10">
                                <h4 className="text-[9px] uppercase tracking-[0.2em] font-medium text-salon-primary">Your Order</h4>
                            </div>
                            <div className="max-h-60 overflow-y-auto p-3 flex flex-col gap-3 bg-salon-base relative z-10">
                                {cart.length === 0 ? (
                                    <p className="text-xs text-salon-golden-muted italic text-center py-3">Bag is empty</p>
                                ) : (
                                    cart.map(item => (
                                        <div key={item.id} className="flex items-center gap-3 text-salon-primary border-b border-salon-golden/5 pb-2 last:border-0 last:pb-0">
                                            <div className="w-10 h-10 bg-salon-surface rounded overflow-hidden flex-shrink-0">
                                                <img src={item.img} alt={item.title} className="w-full h-full object-cover mix-blend-luminosity opacity-80" />
                                            </div>
                                            <div className="flex flex-col flex-1 min-w-0">
                                                <span className="truncate text-[10px] text-salon-primary font-medium">{item.title}</span>
                                                <span className="text-[8px] text-salon-golden-muted uppercase tracking-wider mt-0.5">Qty: {item.quantity}</span>
                                            </div>
                                            <span className="font-serif text-sm">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="p-4 bg-salon-surface border-t border-salon-golden/10 flex justify-between items-center text-salon-primary font-serif relative z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.1)]">
                                <span className="text-xs uppercase tracking-widest font-sans font-medium">Total</span>
                                <span className="text-lg text-salon-golden">${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <Button as="a" href="/booking" variant="link" className="hidden md:block text-salon-primary hover:text-salon-golden border-b border-transparent hover:border-salon-golden ml-4">
                        Book Now
                    </Button>

                    {/* Mobile Hamburger Layout */}
                    <Button 
                        onClick={() => setIsMobileMenuOpen(true)}
                        variant="link" 
                        className="lg:hidden text-salon-primary ml-2 p-0"
                    >
                        <div className="flex flex-col gap-1.5 items-end">
                            <span className="w-8 h-[1px] bg-salon-primary"></span>
                            <span className="w-5 h-[1px] bg-salon-primary"></span>
                            <span className="w-8 h-[1px] bg-salon-secondary"></span>
                        </div>
                    </Button>
                </div>
            </motion.header>

            <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
};

export default Header;
