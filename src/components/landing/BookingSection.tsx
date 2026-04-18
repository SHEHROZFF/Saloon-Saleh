import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import SectionHeader from '../ui/SectionHeader';
import DecorativeCard from '../ui/DecorativeCard';
import { useGetServices } from '../../hooks/queries/useServices';
import { useSubmitWaitlist } from '../../hooks/queries/useWaitlist';

const BookingSection = () => {
    const { data: servicesData } = useGetServices();
    const services = (servicesData?.data as any)?.services || servicesData?.data || [];
    const { mutate: submitWaitlist, isPending } = useSubmitWaitlist();

    const [formData, setFormData] = useState({ full_name: '', phone: '', email: '', desired_service: '' });
    const [statusText, setStatusText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.full_name || !formData.phone || !formData.email) {
            setStatusText('Please fill in your name, email, and phone number.');
            return;
        }

        submitWaitlist(formData, {
            onSuccess: () => {
                setStatusText('You have successfully joined the waiting list! Our team will contact you soon.');
                setFormData({ full_name: '', phone: '', email: '', desired_service: '' });
                setTimeout(() => setStatusText(''), 5000);
            },
            onError: () => {
                setStatusText('Something went wrong. Please try again.');
            }
        });
    };
    return (
        <section id="booking" className="py-12 md:py-24 w-full bg-salon-surface relative z-10 overflow-hidden">
            <div className="w-full max-w-[1400px] mx-auto px-8 md:px-16 flex flex-col lg:flex-row gap-8 items-center">

                {/* Left side: Context & Typography */}
                <div className="w-full lg:w-1/2">
                    <SectionHeader
                        title="Join the"
                        italicTitle="Waiting List"
                        description="To maintain the highest standards of our craft, Salon Saleh operates on a priority waiting list for men's grooming."
                        layout="stack"
                        border={false}
                        className="mb-4"
                    />

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex gap-6 text-salon-golden-muted text-[10px]">
                            <div>
                                <h4 className="uppercase tracking-[0.2em] text-salon-primary mb-1">Location</h4>
                                <p className="italic">Dubai, UAE</p>
                            </div>
                            <div>
                                <h4 className="uppercase tracking-[0.2em] text-salon-primary mb-1">Availability</h4>
                                <p className="italic">Limited Spots</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right side: Sleek Custom Booking Form (Replaces Iframe) */}
                <div className="w-full lg:w-1/2">
                    <DecorativeCard delay={0.2}>
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="w-full flex flex-col gap-2">
                                    <label className="text-[9px] uppercase tracking-[0.2em] text-salon-golden-muted">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.full_name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                                        className="bg-transparent border-b border-salon-primary/10 text-salon-primary text-md pb-2 focus:outline-none focus:border-salon-golden transition-colors rounded-none placeholder:text-salon-primary/20"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="w-full flex flex-col gap-2">
                                    <label className="text-[9px] uppercase tracking-[0.2em] text-salon-golden-muted">Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                        className="bg-transparent border-b border-salon-primary/10 text-salon-primary text-md pb-2 focus:outline-none focus:border-salon-golden transition-colors rounded-none placeholder:text-salon-primary/20"
                                        placeholder="+971 50 000 0000"
                                    />
                                </div>
                                <div className="w-full flex flex-col gap-2">
                                    <label className="text-[9px] uppercase tracking-[0.2em] text-salon-golden-muted">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        className="bg-transparent border-b border-salon-primary/10 text-salon-primary text-md pb-2 focus:outline-none focus:border-salon-golden transition-colors rounded-none placeholder:text-salon-primary/20"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="w-full flex flex-col gap-2">
                                <label className="text-[9px] uppercase tracking-[0.2em] text-salon-golden-muted">Desired Service</label>
                                <select
                                    value={formData.desired_service}
                                    onChange={(e) => setFormData(prev => ({ ...prev, desired_service: e.target.value }))}
                                    className="bg-transparent border-b border-salon-primary/10 text-salon-primary text-md pb-2 focus:outline-none focus:border-salon-golden appearance-none rounded-none cursor-pointer transition-colors"
                                >
                                    <option value="" className="bg-salon-surface text-salon-primary">Not Sure Yet</option>
                                    {services.map((service: any) => (
                                        <option key={service.id} value={service.name} className="bg-salon-surface text-salon-primary">
                                            {service.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <Button as="a" href="/booking" variant="golden" className="mt-2 w-full justify-center text-center">
                                <span>Start Interactive Booking</span>
                            </Button>

                            <div className="flex items-center gap-4 my-2">
                                <div className="h-[1px] flex-1 bg-salon-golden/10"></div>
                                <span className="text-[8px] uppercase tracking-widest text-salon-golden-muted">or quick request</span>
                                <div className="h-[1px] flex-1 bg-salon-golden/10"></div>
                            </div>

                            <Button variant="ghost" className="w-full justify-center text-[10px] tracking-widest border border-salon-golden/20" type="submit" disabled={isPending}>
                                <span>{isPending ? 'Joining...' : 'Join Waitlist Only'}</span>
                            </Button>

                            {statusText && (
                                <p className={`text-center text-[11px] uppercase tracking-[0.1em] mt-2 ${statusText.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
                                    {statusText}
                                </p>
                            )}

                            {!statusText && (
                                <p className="text-center text-[9px] text-salon-golden-muted uppercase tracking-[0.1em] mt-2">
                                    Our concierge will contact you to confirm.
                                </p>
                            )}
                        </form>
                    </DecorativeCard>
                </div>
            </div>
        </section>
    );
};

export default BookingSection;
