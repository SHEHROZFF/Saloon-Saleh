import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';

interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
}

const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
    const navItems = [
        { label: 'Expertise', href: '/#expertise' },
        { label: 'Booking', href: '/booking' },
        { label: 'Shop', href: '/shop' },
    ];

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
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] lg:hidden"
                    />

                    {/* Menu Content */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 w-full max-w-sm h-full bg-salon-base z-[120] lg:hidden shadow-2xl p-8 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-12">
                            <div className="flex items-center gap-3">
                                <img src="/Main_logo_wo_BG.png" alt="Saloon Saleh Logo" className="w-8 h-8 object-contain" />
                                <span className="text-xl font-serif text-salon-primary tracking-tighter">SALOON SALEH</span>
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

                        <nav className="flex flex-col gap-8 flex-1">
                            {navItems.map((item, i) => (
                                <motion.a
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClose}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                    className="text-3xl font-serif text-salon-primary hover:text-salon-golden transition-colors block"
                                >
                                    {item.label}
                                </motion.a>
                            ))}
                        </nav>

                        <div className="mt-auto space-y-6">
                            <Button as="a" href="/booking" variant="golden" className="w-full h-14 text-sm tracking-[0.2em]">
                                Book Appointment
                            </Button>
                            
                            <div className="flex flex-col gap-2 text-center text-[10px] uppercase tracking-[0.3em] text-salon-golden-muted">
                                <span>123 Elite Avenue, Dubai</span>
                                <span>Mon - Sun: 10:00 - 22:00</span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MobileNav;
