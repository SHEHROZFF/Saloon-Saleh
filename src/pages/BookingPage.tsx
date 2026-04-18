import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import Header from '../components/layout/Header';
import Footer from '../components/landing/Footer';
import { useGetServices } from '../hooks/queries/useServices';
import { useGetStaff } from '../hooks/queries/useStaff';
import { useGetTimeSlots, useCheckAvailability, useCreateBooking } from '../hooks/queries/useBookings';
import { Service } from '../services/api/serviceService';
import { Staff } from '../services/api/staffService';
import { Loader2 } from 'lucide-react';

type BookingStep = 1 | 2 | 3 | 4 | 5 | 6;

interface BookingData {
    gender: string | null;
    services: Service[];
    staff: Staff | null;
    date: string | null;
    time: string | null;
    customer: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        notes: string;
    };
}

const BookingPage = () => {
    const [step, setStep] = useState<BookingStep>(1);
    const [bookingData, setBookingData] = useState<BookingData>({
        gender: null,
        services: [],
        staff: null,
        date: new Date().toISOString().split('T')[0],
        time: null,
        customer: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            notes: ''
        }
    });

    const nextStep = () => setStep(prev => Math.min(prev + 1, 6) as BookingStep);
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1) as BookingStep);

    const toggleService = (service: Service) => {
        setBookingData(prev => ({
            ...prev,
            services: prev.services.find(s => s.id === service.id)
                ? prev.services.filter(s => s.id !== service.id)
                : [...prev.services, service]
        }));
    };

    const totalPrice = useMemo(() => {
        return bookingData.services.reduce((acc, s) => acc + parseFloat(s.price.toString()), 0).toFixed(2);
    }, [bookingData.services]);

    const renderStep = () => {
        switch (step) {
            case 1: return <StepGender onSelect={(g) => { setBookingData(p => ({ ...p, gender: g })); nextStep(); }} />;
            case 2: return <StepServices gender={bookingData.gender} selected={bookingData.services} onToggle={toggleService} onNext={nextStep} />;
            case 3: return <StepStaff onSelect={(s) => { setBookingData(p => ({ ...p, staff: s })); nextStep(); }} onSkip={() => { setBookingData(p => ({ ...p, staff: null })); nextStep(); }} />;
            case 4: return <StepDateTime date={bookingData.date} time={bookingData.time} staffId={bookingData.staff?.id} onSelect={(d, t) => setBookingData(p => ({ ...p, date: d, time: t }))} onNext={nextStep} />;
            case 5: return <StepDetails data={bookingData} onChange={(c) => setBookingData(p => ({ ...p, customer: c }))} onNext={nextStep} />;
            case 6: return <StepConfirmation data={bookingData} total={totalPrice} />;
            default: return null;
        }
    };

    return (
        <div className="w-full min-h-screen bg-salon-base text-salon-primary">
            <Header />
            <main className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto min-h-[80vh] flex flex-col">
                {/* Progress Indicator */}
                <div className="flex justify-between items-center mb-12">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-salon-golden mb-1">Step 0{step} / 06</span>
                        <h2 className="text-2xl font-serif">
                            {step === 1 && "Choose Department"}
                            {step === 2 && "Select Services"}
                            {step === 3 && "Choose Your Professional"}
                            {step === 4 && "Preferred Timing"}
                            {step === 5 && "Your Information"}
                            {step === 6 && "Booking Received"}
                        </h2>
                    </div>
                    {step > 1 && step < 6 && (
                        <button onClick={prevStep} className="text-[10px] uppercase tracking-widest text-salon-golden-muted hover:text-salon-primary transition-colors flex items-center gap-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                            Back
                        </button>
                    )}
                </div>

                <div className="flex-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            {renderStep()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
            <Footer />
        </div>
    );
};

const StepGender = ({ onSelect }: { onSelect: (g: any) => void }) => {
    const genders = [
        { name: 'Women', image: '/step1/women.png' },
        { name: 'Men', image: '/step1/men.png' },
        { name: 'Kids', image: '/step1/kid.png' }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {genders.map(g => (
                <button
                    key={g.name}
                    onClick={() => onSelect(g.name)}
                    className="group relative h-80 bg-salon-surface border border-salon-golden/10 flex flex-col items-center justify-center overflow-hidden hover:border-salon-golden transition-all duration-700 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)]"
                >
                    <div className="absolute inset-0 bg-salon-golden/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Professional Icon Circular Backdrop */}
                    <div className="relative w-28 h-28 rounded-full bg-salon-golden/10 dark:bg-salon-golden/20 flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:bg-salon-golden/30">
                        <img
                            src={g.image}
                            alt={g.name}
                            className="w-20 h-20 object-contain transition-all duration-500 dark:invert opacity-80 group-hover:opacity-100"
                        />
                    </div>

                    <span className="relative text-xl font-serif mb-2 tracking-widest">{g.name}</span>
                    <span className="relative text-[8px] uppercase tracking-[0.4em] text-salon-golden-muted italic group-hover:text-salon-golden opacity-50 group-hover:opacity-100 transition-all">Click to Select</span>
                </button>
            ))}
        </div>
    );
};

const StepServices = ({ gender, selected, onToggle, onNext }: { gender: string | null, selected: Service[], onToggle: (s: Service) => void, onNext: () => void }) => {
    const { data: servicesData, isLoading } = useGetServices({ gender: gender === 'Kids' ? undefined : gender || undefined });
    const liveServices = (servicesData?.data as any)?.services || servicesData?.data || [];

    // Group categories dynamically
    const categories = [...new Set(liveServices.map((s: any) => s.category_name || 'General'))];

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-salon-golden" />
                <p className="text-sm font-serif text-salon-golden-muted tracking-widest uppercase">Fetching Services...</p>
            </div>
        );
    }
    return (
        <div className="space-y-8">
            <div className="space-y-12">
                {categories.map((cat: any) => (
                    <div key={cat} className="space-y-4">
                        <h3 className="text-xs uppercase tracking-[0.4em] text-salon-golden border-b border-salon-golden/20 pb-2">{cat as string}</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {liveServices.filter((s: any) => (s.category_name || 'General') === cat).map((s: any) => {
                                const isSelected = selected.some(item => item.id === s.id);
                                return (
                                    <div
                                        key={s.id}
                                        onClick={() => onToggle(s)}
                                        className={`p-5 flex justify-between items-center cursor-pointer transition-all duration-300 border ${isSelected
                                            ? 'bg-salon-surface border-salon-golden shadow-[inset_0_0_15px_rgba(212,175,55,0.1)]'
                                            : 'bg-salon-surface border-salon-golden/10 hover:border-salon-golden/40'
                                            }`}
                                    >
                                        <div>
                                            <p className={`font-serif text-lg ${isSelected ? 'text-salon-golden' : 'text-salon-primary'}`}>{s.name || s.title}</p>
                                            <p className="text-[10px] uppercase tracking-widest text-salon-golden-muted">{s.duration}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-serif text-xl mb-1 ${isSelected ? 'text-salon-golden' : 'text-salon-primary'}`}>${s.price}</p>
                                            <div className={`w-5 h-5 border flex items-center justify-center rounded-full transition-all ${isSelected ? 'bg-salon-golden border-salon-golden scale-110' : 'border-salon-golden/30'}`}>
                                                {isSelected && <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
            <div className="sticky bottom-8 pt-8 border-t border-salon-golden/10 bg-salon-base flex justify-between items-center">
                <div>
                    <span className="text-[10px] uppercase tracking-widest text-salon-golden-muted">Estimated Total</span>
                    <p className="text-2xl font-serif">${selected.reduce((a, b) => a + parseFloat(b.price.toString()), 0).toFixed(2)}</p>
                </div>
                <Button variant="golden" className="px-12" onClick={onNext} disabled={selected.length === 0}>
                    Next Step
                </Button>
            </div>
        </div>
    );
};

const StepStaff = ({ onSelect, onSkip }: { onSelect: (s: Staff) => void, onSkip: () => void }) => {
    const [search, setSearch] = useState('');
    const { data: staffData, isLoading } = useGetStaff();
    const liveStaff = (staffData?.data as any)?.staff || staffData?.data || [];
    const filteredStaff = liveStaff.filter((s: any) => s.name.toLowerCase().includes(search.toLowerCase()));

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-salon-golden" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="relative max-w-md mx-auto mb-10">
                <input
                    type="text"
                    placeholder="Search for a barber..."
                    className="w-full bg-salon-surface border border-salon-golden/10 px-10 py-4 text-xs focus:outline-none focus:border-salon-golden transition-colors"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-salon-golden-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredStaff.map((s: any) => (
                    <div
                        key={s.id}
                        onClick={() => onSelect(s)}
                        className="flex items-center gap-6 p-6 bg-salon-surface border border-salon-golden/10 hover:border-salon-golden cursor-pointer group transition-all"
                    >
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-salon-golden/20 group-hover:border-salon-golden transition-colors grayscale group-hover:grayscale-0">
                            <img src={s.avatar_url || '/step1/men.png'} alt={s.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h3 className="text-xl font-serif">{s.name}</h3>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-salon-golden-muted">{s.role}</p>
                        </div>
                    </div>
                ))}
            </div>

            {filteredStaff.length === 0 && (
                <p className="text-center text-salon-golden-muted italic py-10">No barber matches your search.</p>
            )}

            <div className="text-center">
                <Button variant="ghost" onClick={onSkip} className="text-salon-golden-muted hover:text-salon-primary">
                    Skip - Anyone is fine
                </Button>
            </div>
        </div>
    );
};

const StepDateTime = ({ date, time, staffId, onSelect, onNext }: { date: any, time: any, staffId: string | undefined, onSelect: (d: any, t: any) => void, onNext: () => void }) => {
    const [viewDate, setViewDate] = useState(new Date(date || new Date()));
    const scrollRef = useRef<HTMLDivElement>(null);

    // Remote checks
    const { data: slotsData, isLoading: slotsLoading } = useGetTimeSlots();
    const getLocalFormattedDate = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formattedDate = date || getLocalFormattedDate(new Date());
    const { data: availabilityData, isLoading: availLoading } = useCheckAvailability(formattedDate, staffId);

    const timeSlots = (slotsData?.data as any)?.time_slots || slotsData?.data || [];

    // Availability data returns objects: { id, slot_time, is_available: boolean }
    const availSlotsArray = (availabilityData?.data as any)?.slots || [];
    const bookedSlotIds = availSlotsArray.filter((s: any) => s.is_available === false).map((s: any) => s.id);

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const datesForMonth = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const d = [];
        for (let i = 1; i <= daysInMonth; i++) {
            const dateObj = new Date(year, month, i);
            d.push({
                full: getLocalFormattedDate(dateObj),
                day: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
                num: i,
                month: dateObj.toLocaleDateString('en-US', { month: 'short' }),
                raw: dateObj
            });
        }
        return d;
    }, [viewDate]);

    useEffect(() => {
        // Auto-scroll to today or selected date
        const targetId = date || new Date().toISOString().split('T')[0];
        const element = document.getElementById(`date-${targetId}`);
        if (element && scrollRef.current) {
            const container = scrollRef.current;
            const scrollPos = element.offsetLeft - container.offsetWidth / 2 + element.offsetWidth / 2;
            container.scrollTo({ left: scrollPos, behavior: 'smooth' });
        }
    }, [viewDate, date]);

    const changeMonth = (offset: number) => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setViewDate(newDate);
    };

    const isPast = (d: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return d < today;
    };

    const isToday = (d: Date) => {
        const today = new Date();
        return d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear();
    };

    return (
        <div className="space-y-16">
            <div className="flex flex-col gap-6">
                {/* Refined Month/Year Switcher */}
                <div className="flex justify-between items-center max-w-xs mx-auto w-full mb-4">
                    <button
                        onClick={() => changeMonth(-1)}
                        className="text-salon-golden-muted hover:text-salon-golden transition-colors p-2"
                        disabled={viewDate.getMonth() === new Date().getMonth() && viewDate.getFullYear() === new Date().getFullYear()}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h3 className="text-sm uppercase tracking-[0.4em] text-salon-golden font-medium">
                        {monthNames[viewDate.getMonth()]} <span className="opacity-60">{viewDate.getFullYear()}</span>
                    </h3>
                    <button onClick={() => changeMonth(1)} className="text-salon-golden-muted hover:text-salon-golden transition-colors p-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>

                {/* Premium Horizontal Scroller */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto py-8 no-scrollbar max-w-full px-4 scroll-smooth"
                >
                    {datesForMonth.map((d) => {
                        const isSelected = date === d.full;
                        const past = isPast(d.raw);
                        const today = isToday(d.raw);

                        return (
                            <button
                                key={d.full}
                                id={`date-${d.full}`}
                                disabled={past}
                                onClick={() => onSelect(d.full, time)}
                                className={`flex flex-col items-center justify-center min-w-[90px] h-32 border transition-all duration-500 relative ${isSelected
                                        ? 'bg-salon-surface border-salon-golden shadow-[0_10px_30px_rgba(212,175,55,0.2),inset_0_0_20px_rgba(212,175,55,0.2)] scale-110 z-10'
                                        : past
                                            ? 'opacity-20 cursor-not-allowed border-transparent'
                                            : 'bg-salon-surface border-salon-golden/10 hover:border-salon-golden/40 hover:scale-105'
                                    }`}
                            >
                                <span className={`text-[10px] uppercase tracking-[0.2em] mb-1 ${isSelected ? 'text-salon-golden' : 'text-salon-golden-muted'}`}>{d.day}</span>
                                <span className={`text-3xl font-serif ${isSelected ? 'text-salon-golden' : 'text-salon-primary'}`}>{d.num}</span>
                                <span className="text-[9px] uppercase tracking-widest opacity-40">{d.month}</span>
                                {today && !isSelected && (
                                    <div className="absolute bottom-2 w-1.5 h-1.5 bg-salon-golden rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Time Slots Section */}
            <div className="space-y-8">
                <h3 className="text-[10px] uppercase tracking-[0.5em] text-center text-salon-golden">Available Time</h3>

                {slotsLoading || availLoading ? (
                    <div className="flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-salon-golden" /></div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 max-w-3xl mx-auto">
                        {timeSlots.map((t: any) => {
                            const isSelectedTime = time === t.id;
                            const isBooked = bookedSlotIds.includes(t.id);

                            return (
                                <button
                                    key={t.id}
                                    onClick={() => onSelect(date, t.id)}
                                    disabled={isBooked}
                                    className={`p-4 border text-center transition-all duration-300 font-serif text-lg ${isBooked ? 'opacity-30 cursor-not-allowed bg-salon-surface border-transparent line-through text-salon-muted' :
                                            isSelectedTime
                                                ? 'bg-salon-surface border-salon-golden shadow-[0_5px_20px_rgba(212,175,55,0.15),inset_0_0_15px_rgba(212,175,55,0.15)] scale-105 z-10 text-salon-golden'
                                                : 'bg-salon-surface border-salon-golden/10 hover:border-salon-golden'
                                        }`}
                                >
                                    {t.display_label}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="flex justify-center pt-8 border-t border-salon-golden/10">
                <Button
                    variant="golden"
                    className="px-24 py-4"
                    onClick={onNext}
                    disabled={!date || !time}
                >
                    Review Details
                </Button>
            </div>
        </div>
    );
};

const StepDetails = ({ data, onChange, onNext }: { data: BookingData, onChange: (d: any) => void, onNext: () => void }) => {
    const { mutate, isPending } = useCreateBooking();
    const customer = data.customer;

    const handleBookingSubmit = () => {
        // Construct backend payload
        const payload = {
            gender: data.gender,
            staff_id: data.staff?.id,
            booking_date: data.date,
            time_slot_id: data.time,
            first_name: customer.firstName,
            last_name: customer.lastName,
            email: customer.email,
            phone: customer.phone,
            notes: customer.notes,
            total_price: data.services.reduce((a, b) => a + parseFloat(b.price.toString()), 0),
            service_ids: data.services.map(s => s.id)
        };

        mutate(payload, {
            onSuccess: () => onNext(),
            onError: (err) => alert("Failed to book appointment: " + err)
        });
    };

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-salon-golden-muted px-1">First Name</label>
                    <input
                        type="text"
                        placeholder="E.g. James"
                        className="w-full bg-salon-surface border border-salon-golden/10 px-4 py-4 focus:outline-none focus:border-salon-golden"
                        value={customer.firstName}
                        onChange={(e) => onChange({ ...customer, firstName: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-salon-golden-muted px-1">Last Name</label>
                    <input
                        type="text"
                        placeholder="E.g. Bond"
                        className="w-full bg-salon-surface border border-salon-golden/10 px-4 py-4 focus:outline-none focus:border-salon-golden"
                        value={customer.lastName}
                        onChange={(e) => onChange({ ...customer, lastName: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-salon-golden-muted px-1">Email Address</label>
                    <input
                        type="email"
                        placeholder="james@example.com"
                        className="w-full bg-salon-surface border border-salon-golden/10 px-4 py-4 focus:outline-none focus:border-salon-golden"
                        value={customer.email}
                        onChange={(e) => onChange({ ...customer, email: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-salon-golden-muted px-1">Phone Number</label>
                    <input
                        type="tel"
                        placeholder="+971 -- --- ----"
                        className="w-full bg-salon-surface border border-salon-golden/10 px-4 py-4 focus:outline-none focus:border-salon-golden"
                        value={customer.phone}
                        onChange={(e) => onChange({ ...customer, phone: e.target.value })}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-salon-golden-muted px-1">Special Notes</label>
                <textarea
                    rows={4}
                    className="w-full bg-salon-surface border border-salon-golden/10 px-4 py-4 focus:outline-none focus:border-salon-golden"
                    placeholder="Any specific requests or requirements..."
                    value={customer.notes}
                    onChange={(e) => onChange({ ...customer, notes: e.target.value })}
                />
            </div>
            <div className="flex justify-center">
                <Button
                    variant="golden"
                    className="px-20 py-5"
                    onClick={handleBookingSubmit}
                    disabled={!customer.firstName || !customer.email || !customer.phone || isPending}
                >
                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Appointment"}
                </Button>
            </div>
        </div>
    )
};

const StepConfirmation = ({ data, total }: { data: BookingData, total: string }) => (
    <div className="flex flex-col items-center">
        <div className="w-20 h-20 bg-salon-golden/10 rounded-full flex items-center justify-center mb-8">
            <svg className="w-10 h-10 text-salon-golden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
        </div>

        <div className="w-full max-w-md bg-white dark:bg-salon-surface dark:text-salon-primary text-black p-10 shadow-2xl relative overflow-hidden transition-colors duration-500">
            {/* Elegant Receipt Design with Theme Awareness */}
            <div className="absolute top-0 left-0 w-full h-1 bg-salon-golden" />
            <div className="text-center mb-10">
                <h3 className="text-2xl font-serif tracking-tighter">SALON SALEH</h3>
                <p className="text-[8px] uppercase tracking-[0.3em] font-medium text-salon-golden italic">Appointment Receipt</p>
            </div>

            <div className="space-y-6 text-sm mb-10">
                <div className="flex justify-between border-b border-gray-100 dark:border-salon-golden/10 pb-2">
                    <span className="text-gray-400 dark:text-salon-golden-muted uppercase text-[9px]">Customer</span>
                    <span className="font-serif">{data.customer.firstName} {data.customer.lastName}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-salon-golden/10 pb-2">
                    <span className="text-gray-400 dark:text-salon-golden-muted uppercase text-[9px]">Stylist</span>
                    <span className="font-serif">{data.staff?.name || "Unassigned"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-salon-golden/10 pb-2">
                    <span className="text-gray-400 dark:text-salon-golden-muted uppercase text-[9px]">Date & Time</span>
                    <span className="font-serif">{data.date} @ {data.time}</span>
                </div>

                <div className="space-y-3 pt-4">
                    <span className="text-gray-400 dark:text-salon-golden-muted uppercase text-[9px]">Services Summary</span>
                    {data.services.map(s => (
                        <div key={s.id} className="flex justify-between text-[11px]">
                            <span>{s.name}</span>
                            <span>${s.price}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t-2 border-dashed border-gray-200 dark:border-salon-golden/20 pt-6 flex justify-between items-center bg-gray-50 dark:bg-[#121212] -mx-10 px-10">
                <span className="text-gray-500 dark:text-salon-golden-muted uppercase text-[10px]">Grand Total</span>
                <span className="text-3xl font-serif text-black dark:text-salon-golden">${total}</span>
            </div>
        </div>

        <Button as="a" href="/" variant="ghost" className="mt-12 text-salon-golden hover:text-salon-primary">
            Return to Homepage
        </Button>
    </div>
);

export default BookingPage;
