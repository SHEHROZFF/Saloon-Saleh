import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/landing/Footer';
import Button from '../components/ui/Button';

const OrderSuccessPage = () => {
    // In a real app, we'd pull the last order from state or API
    // For this mock, we'll just show a generic "Success" with order number
    const orderNumber = useMemo(() => Math.floor(100000 + Math.random() * 900000), []);
    const date = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="w-full min-h-screen bg-salon-base text-salon-primary">
            <Header />
            <main className="pt-40 pb-24 px-6 md:px-12 max-w-2xl mx-auto">
                {/* Stage Indicator */}
                <div className="flex items-center justify-center gap-4 mb-16 text-[10px] uppercase tracking-[0.3em]">
                    <span className="text-salon-golden-muted">01. Shopping Cart</span>
                    <span className="text-salon-golden-muted opacity-30">/</span>
                    <span className="text-salon-golden-muted">02. Checkout Details</span>
                    <span className="text-salon-golden-muted opacity-30">/</span>
                    <span className="text-salon-primary font-bold">03. Order Complete</span>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-salon-surface border border-salon-golden/10 p-10 md:p-16 text-center space-y-12 shadow-2xl relative overflow-hidden"
                >
                    {/* Decorative Background Element */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-salon-golden" />
                    
                    <div className="space-y-4">
                        <div className="w-20 h-20 bg-salon-golden rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(212,175,55,0.2)]">
                            <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif tracking-tighter italic">Thank you.</h2>
                        <p className="text-[10px] uppercase tracking-[0.5em] text-salon-golden font-bold">Your order has been received</p>
                    </div>

                    {/* Order Meta */}
                    <div className="grid grid-cols-2 gap-8 border-y border-salon-golden/10 py-10">
                        <div className="space-y-1">
                            <span className="text-[10px] uppercase tracking-widest text-salon-golden-muted">Order Number</span>
                            <p className="font-serif text-lg">#S-{orderNumber}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] uppercase tracking-widest text-salon-golden-muted">Date</span>
                            <p className="font-serif text-lg">{date}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] uppercase tracking-widest text-salon-golden-muted">Payment</span>
                            <p className="font-serif text-lg italic">Cash on Delivery</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] uppercase tracking-widest text-salon-golden-muted">Status</span>
                            <p className="font-serif text-lg text-emerald-500 uppercase tracking-widest text-sm font-bold">Awaiting Ritual</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <p className="text-sm text-salon-golden-muted font-light leading-relaxed max-w-sm mx-auto">
                            A master barber will begin preparing your collection for delivery. You will receive an update as soon as your premium ritual is en route.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                            <Link to="/shop" className="w-full sm:w-auto">
                                <Button variant="golden" className="w-full h-14 px-12 text-[10px] font-bold uppercase tracking-[0.3em]">Return to Collection</Button>
                            </Link>
                            <Link to="/" className="w-full sm:w-auto">
                                <Button variant="outline" className="w-full h-14 px-12 text-[10px] border-salon-golden/20 hover:border-salon-golden/60 transition-all uppercase tracking-[0.3em] font-bold">Back to Home</Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default OrderSuccessPage;
