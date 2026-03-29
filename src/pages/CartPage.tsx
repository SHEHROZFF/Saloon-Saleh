import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Header from '../components/layout/Header';
import Footer from '../components/landing/Footer';
import Button from '../components/ui/Button';

const CartPage = () => {
    const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
    const navigate = useNavigate();
    const [shipping, setShipping] = useState('delivery');

    const totalWithShipping = shipping === 'delivery' ? cartTotal + 3 : cartTotal;

    if (cart.length === 0) {
        return (
            <div className="w-full min-h-screen bg-salon-base text-salon-primary">
                <Header />
                <main className="pt-40 pb-24 px-6 flex flex-col items-center justify-center text-center">
                    <h2 className="text-4xl font-serif mb-6">Your bag is <span className="italic">empty.</span></h2>
                    <p className="text-salon-golden-muted mb-8 max-w-md font-light">It seems you haven't added any premium rituals to your collection yet.</p>
                    <Link to="/shop">
                        <Button variant="golden" className="px-12">Return to Shop</Button>
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-salon-base text-salon-primary">
            <Header />
            <main className="pt-40 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto">
                {/* Stage Indicator */}
                <div className="flex items-center justify-center gap-4 mb-16 text-[10px] uppercase tracking-[0.3em]">
                    <span className="text-salon-primary font-bold">01. Shopping Cart</span>
                    <span className="text-salon-golden-muted opacity-30">/</span>
                    <span className="text-salon-golden-muted">02. Checkout Details</span>
                    <span className="text-salon-golden-muted opacity-30">/</span>
                    <span className="text-salon-golden-muted">03. Order Complete</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Cart Items Table */}
                    <div className="flex-1">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-salon-golden/10">
                                    <th className="pb-6 text-[10px] uppercase tracking-widest text-salon-golden font-bold">Product</th>
                                    <th className="pb-6 text-[10px] uppercase tracking-widest text-salon-golden font-bold text-center">Price</th>
                                    <th className="pb-6 text-[10px] uppercase tracking-widest text-salon-golden font-bold text-center">Quantity</th>
                                    <th className="pb-6 text-[10px] uppercase tracking-widest text-salon-golden font-bold text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-salon-golden/5">
                                {cart.map((item) => (
                                    <tr key={item.id} className="group">
                                        <td className="py-8">
                                            <div className="flex items-center gap-6">
                                                <button 
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-salon-golden-muted hover:text-red-500 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                                <div className="w-24 h-24 bg-salon-surface border border-salon-golden/10 overflow-hidden relative">
                                                    <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-[0.2em] text-salon-golden mb-1">{item.brand}</p>
                                                    <h3 className="text-lg font-serif">{item.title}</h3>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-8 text-center font-serif text-salon-golden-muted">${item.price}</td>
                                        <td className="py-8">
                                            <div className="flex items-center justify-center border border-salon-golden/10 bg-salon-surface w-fit mx-auto">
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-10 h-10 flex items-center justify-center hover:text-salon-golden transition-all"
                                                >
                                                    -
                                                </button>
                                                <span className="w-10 text-center text-xs font-serif">{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-10 h-10 flex items-center justify-center hover:text-salon-golden transition-all"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-8 text-right font-serif text-lg">${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="mt-12 flex justify-start">
                            <Button 
                                variant="outline" 
                                onClick={() => navigate('/shop')}
                                className="px-12 h-14 text-[10px] border-salon-golden/20 hover:border-salon-golden/60 transition-all uppercase tracking-[0.3em] font-bold"
                            >
                                <span className="flex items-center gap-2">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                    Continue Shopping
                                </span>
                            </Button>
                        </div>
                    </div>

                    {/* Sidebar: Totals & Coupon */}
                    <div className="w-full lg:w-[450px]">
                        <div className="bg-salon-surface border border-salon-golden/10 p-10 lg:sticky lg:top-40">
                            <h3 className="text-xl font-serif mb-8 border-b border-salon-golden/10 pb-6 uppercase tracking-widest text-center">Cart Totals</h3>
                            
                            <div className="space-y-8">
                                {/* Coupon in Sidebar */}
                                <div className="space-y-4">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-salon-golden-muted font-bold">Have a Coupon?</p>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Code" 
                                            className="bg-salon-base border border-salon-golden/10 px-5 py-3 text-[10px] uppercase tracking-widest focus:outline-none focus:border-salon-golden flex-1 transition-all"
                                        />
                                        <Button 
                                            variant="outline" 
                                            className="px-6 text-[9px] border-salon-golden/20 whitespace-nowrap uppercase tracking-widest font-bold"
                                        >
                                            Apply
                                        </Button>
                                    </div>
                                </div>

                                <div className="pt-4 space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-salon-golden-muted font-light uppercase tracking-widest">Subtotal</span>
                                        <span className="font-serif text-lg">${cartTotal.toFixed(2)}</span>
                                    </div>

                                    <div className="pt-6 border-t border-salon-golden/10 space-y-4">
                                        <span className="text-[10px] uppercase tracking-widest text-salon-golden font-bold block mb-4">Shipment Method</span>
                                        
                                        <label className="flex items-center justify-between group cursor-pointer p-4 border border-salon-golden/5 hover:border-salon-golden/20 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${shipping === 'delivery' ? 'border-salon-golden scale-110' : 'border-salon-golden/20'}`}>
                                                    {shipping === 'delivery' && <div className="w-2 h-2 rounded-full bg-salon-golden" />}
                                                </div>
                                                <span className="text-xs uppercase tracking-widest">Delivery Service</span>
                                            </div>
                                            <input type="radio" value="delivery" checked={shipping === 'delivery'} onChange={() => setShipping('delivery')} className="hidden" />
                                            <span className="font-serif text-sm text-salon-golden">$3.00</span>
                                        </label>

                                        <label className="flex items-center justify-between group cursor-pointer p-4 border border-salon-golden/5 hover:border-salon-golden/20 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${shipping === 'pickup' ? 'border-salon-golden scale-110' : 'border-salon-golden/20'}`}>
                                                    {shipping === 'pickup' && <div className="w-2 h-2 rounded-full bg-salon-golden" />}
                                                </div>
                                                <span className="text-xs uppercase tracking-widest">Self Pickup</span>
                                            </div>
                                            <input type="radio" value="pickup" checked={shipping === 'pickup'} onChange={() => setShipping('pickup')} className="hidden" />
                                            <span className="font-serif text-sm text-salon-golden">Free</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-salon-golden/20 flex justify-between items-center">
                                    <span className="text-salon-primary font-bold uppercase tracking-[0.2em] text-sm">Total</span>
                                    <span className="text-3xl font-serif text-salon-golden tracking-tighter">${totalWithShipping.toFixed(2)}</span>
                                </div>

                                <Button 
                                    onClick={() => navigate('/checkout')}
                                    variant="golden" 
                                    className="w-full h-16 text-[10px] uppercase tracking-[0.3em] font-bold shadow-[0_10px_30px_rgba(212,175,55,0.1)] group"
                                >
                                    Proceed to Checkout
                                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CartPage;
