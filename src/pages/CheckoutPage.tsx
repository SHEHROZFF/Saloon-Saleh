import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useCreateOrder } from '../hooks/queries/useOrders';
import { Loader2 } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/landing/Footer';
import Button from '../components/ui/Button';

const CheckoutPage = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [shipToDifferent, setShipToDifferent] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    
    // Mock shipping cost logic (sharing with CartPage logic typically via state/context in real app)
    const shippingCost = 3.00;
    const grandTotal = cartTotal + shippingCost;

    const { mutate, isPending } = useCreateOrder();
    const [billingDetails, setBillingDetails] = useState({
        firstName: '', lastName: '', address: '', city: '', phone: '', email: '', country: 'UK', postcode: ''
    });

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();
        
        const orderPayload = {
            subtotal: cartTotal,
            shipping_cost: shippingCost,
            discount_amount: 0,
            total: grandTotal,
            shipping_method: 'delivery',
            payment_method: paymentMethod,
            payment_status: paymentMethod === 'card' ? 'paid' : 'pending',
            items: cart.map(item => ({
                product_id: item.id,
                product_title: item.title,
                product_brand: item.brand || 'Saloon Saleh',
                price: Number(item.price),
                quantity: item.quantity
            })),
            billing_address: {
                first_name: billingDetails.firstName,
                last_name: billingDetails.lastName,
                country: billingDetails.country,
                street_address: billingDetails.address,
                city: billingDetails.city,
                postcode: billingDetails.postcode,
                phone: billingDetails.phone,
                email: billingDetails.email
            }
        };

        mutate(orderPayload, {
            onSuccess: () => {
                clearCart();
                navigate('/order-success');
            },
            onError: (err) => {
                alert("Order failed: " + err);
            }
        });
    };

    if (cart.length === 0) {
        navigate('/shop');
        return null;
    }

    const FormInput = ({ label, placeholder, required = true, type = "text", className = "", value, onChange }: any) => (
        <div className={`space-y-2 ${className}`}>
            <label className="text-[10px] uppercase tracking-[0.2em] text-salon-golden-muted font-bold block px-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input 
                type={type}
                required={required}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full bg-salon-surface border border-salon-golden/10 px-6 py-4 text-xs focus:outline-none focus:border-salon-golden transition-all"
            />
        </div>
    );

    return (
        <div className="w-full min-h-screen bg-salon-base text-salon-primary">
            <Header />
            <main className="pt-40 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto">
                {/* Stage Indicator */}
                <div className="flex items-center justify-center gap-4 mb-16 text-[10px] uppercase tracking-[0.3em]">
                    <span className="text-salon-golden-muted">01. Shopping Cart</span>
                    <span className="text-salon-golden-muted opacity-30">/</span>
                    <span className="text-salon-primary font-bold">02. Checkout Details</span>
                    <span className="text-salon-golden-muted opacity-30">/</span>
                    <span className="text-salon-golden-muted">03. Order Complete</span>
                </div>

                <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-16">
                    {/* Main Billing/Shipping Form */}
                    <div className="flex-1 space-y-12">
                        <section className="space-y-8">
                            <h3 className="text-2xl font-serif border-b border-salon-golden/10 pb-6 uppercase tracking-widest">Billing Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput label="First Name" placeholder="e.g. John" value={billingDetails.firstName} onChange={(e:any) => setBillingDetails({...billingDetails, firstName: e.target.value})} />
                                <FormInput label="Last Name" placeholder="e.g. Doe" value={billingDetails.lastName} onChange={(e:any) => setBillingDetails({...billingDetails, lastName: e.target.value})} />
                            </div>
                            <FormInput label="Company Name (Optional)" placeholder="e.g. Salon LTD" required={false} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput label="Country" placeholder="e.g. United Kingdom" value={billingDetails.country} onChange={(e:any) => setBillingDetails({...billingDetails, country: e.target.value})} />
                                <FormInput label="Town / City" placeholder="e.g. London" value={billingDetails.city} onChange={(e:any) => setBillingDetails({...billingDetails, city: e.target.value})} />
                            </div>
                            <FormInput label="Street Address" placeholder="House number and street name" value={billingDetails.address} onChange={(e:any) => setBillingDetails({...billingDetails, address: e.target.value})} />
                            <FormInput label="Postcode" placeholder="e.g. EC1A 1BB" value={billingDetails.postcode} onChange={(e:any) => setBillingDetails({...billingDetails, postcode: e.target.value})} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput label="Phone" placeholder="+44 20 7946 0000" type="tel" value={billingDetails.phone} onChange={(e:any) => setBillingDetails({...billingDetails, phone: e.target.value})} />
                                <FormInput label="Email Address" placeholder="john.doe@example.com" type="email" value={billingDetails.email} onChange={(e:any) => setBillingDetails({...billingDetails, email: e.target.value})} />
                            </div>
                        </section>

                        <section className="pt-8 border-t border-salon-golden/10">
                            <label className="flex items-center gap-3 cursor-pointer group mb-10 w-fit">
                                <div className={`w-5 h-5 border transition-all flex items-center justify-center ${shipToDifferent ? 'bg-salon-golden border-salon-golden scale-110' : 'border-salon-golden/20 group-hover:border-salon-golden/40'}`}>
                                    {shipToDifferent && <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <input type="checkbox" checked={shipToDifferent} onChange={(e) => setShipToDifferent(e.target.checked)} className="hidden" />
                                <span className="text-sm font-serif uppercase tracking-widest">Ship to a different address?</span>
                            </label>

                            <AnimatePresence>
                                {shipToDifferent && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden space-y-8"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormInput label="Shipping First Name" placeholder="John" />
                                            <FormInput label="Shipping Last Name" placeholder="Doe" />
                                        </div>
                                        <FormInput label="Shipping Street Address" placeholder="House number and street name" />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormInput label="Shipping Town / City" placeholder="London" />
                                            <FormInput label="Shipping Postcode" placeholder="EC1A 1BB" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </section>

                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-salon-golden-muted font-bold block px-1">Order Notes (Optional)</label>
                            <textarea 
                                placeholder="Notes about your order, e.g. special notes for delivery."
                                rows={4}
                                className="w-full bg-salon-surface border border-salon-golden/10 px-6 py-4 text-xs focus:outline-none focus:border-salon-golden transition-all resize-none"
                            ></textarea>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="w-full lg:w-[450px]">
                        <div className="bg-salon-surface border border-salon-golden/10 p-10 lg:sticky lg:top-40">
                            <h3 className="text-xl font-serif mb-8 border-b border-salon-golden/10 pb-6 uppercase tracking-widest text-center">Your Order</h3>
                            
                            <div className="space-y-6">
                                <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex justify-between items-center text-sm gap-4">
                                            <span className="font-light text-salon-golden-muted leading-tight">
                                                {item.title} x <span className="text-salon-primary font-bold">{item.quantity}</span>
                                            </span>
                                            <span className="font-serif">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 border-t border-salon-golden/10 space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-salon-golden-muted uppercase tracking-widest">Subtotal</span>
                                        <span className="font-serif font-bold text-lg">${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-salon-golden-muted uppercase tracking-widest">Shipment</span>
                                        <span className="font-serif">${shippingCost.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-salon-golden/20 flex justify-between items-center">
                                    <span className="text-salon-primary font-bold uppercase tracking-[0.2em] text-sm">Total</span>
                                    <span className="text-3xl font-serif text-salon-golden">${grandTotal.toFixed(2)}</span>
                                </div>

                                {/* Payment Methods Selection */}
                                <div className="pt-10 space-y-4">
                                    <h4 className="text-[10px] uppercase tracking-[0.3em] text-salon-golden font-bold mb-6">Ceremonial Payment</h4>
                                    
                                    <div className="space-y-3">
                                        {[
                                            { id: 'cod', title: 'Cash on Delivery', desc: 'Pay with cash upon delivery. Ensure the exact amount is ready for the delivery ritual.' },
                                            { id: 'card', title: 'Credit / Debit Card', desc: 'Securely pay via Mastercard, Visa, or American Express.' },
                                            { id: 'transfer', title: 'Direct Bank Transfer', desc: 'Transfer directly to our vaults. Your ritual begins as soon as the funds clear.' }
                                        ].map((method) => (
                                            <label 
                                                key={method.id}
                                                className={`block cursor-pointer border transition-all p-5 ${
                                                    paymentMethod === method.id 
                                                    ? 'bg-salon-base/60 border-salon-golden' 
                                                    : 'bg-salon-base/20 border-salon-golden/5 hover:border-salon-golden/20'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all ${paymentMethod === method.id ? 'border-salon-golden' : 'border-salon-golden/20'}`}>
                                                            {paymentMethod === method.id && <div className="w-1.5 h-1.5 rounded-full bg-salon-golden" />}
                                                        </div>
                                                        <span className="text-xs uppercase tracking-widest font-bold">{method.title}</span>
                                                    </div>
                                                </div>
                                                {paymentMethod === method.id && (
                                                    <motion.p 
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        className="text-[11px] text-salon-golden-muted font-light leading-relaxed pl-6"
                                                    >
                                                        {method.desc}
                                                    </motion.p>
                                                )}
                                                <input 
                                                    type="radio" 
                                                    value={method.id} 
                                                    checked={paymentMethod === method.id} 
                                                    onChange={() => setPaymentMethod(method.id)} 
                                                    className="hidden" 
                                                />
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <Button 
                                    type="submit"
                                    variant="golden" 
                                    disabled={isPending}
                                    className="w-full h-16 text-[11px] uppercase tracking-[0.4em] font-bold shadow-[0_15px_40px_rgba(212,175,55,0.15)] group mt-8"
                                >
                                    {isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (
                                        <span className="flex items-center justify-center gap-2">
                                            Seal the Ritual
                                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </span>
                                    )}
                                </Button>

                                <p className="text-[9px] text-center text-salon-golden-muted/40 uppercase tracking-widest font-light leading-relaxed mt-6">
                                    Your personal data will be used to process your order and support your experience throughout this website.
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
            <Footer />
        </div>
    );
};

export default CheckoutPage;
