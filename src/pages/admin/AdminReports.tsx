import { useState } from 'react';
import { 
    Download, Calendar, DollarSign, 
    Loader2, ArrowLeft, UserCheck, Percent,
    ShoppingCart, Star, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetBusinessReport, useGetStaffReport } from '../../hooks/queries/useReports';
import type { StaffPerformance } from '../../services/api/reportService';

const AdminReports = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'business' | 'staff'>('business');
    const [timeframe, setTimeframe] = useState('30d');
    const [selectedStaff, setSelectedStaff] = useState<null | StaffPerformance>(null);

    const { data: bizData, isLoading: isBizLoading } = useGetBusinessReport(timeframe);
    const { data: staffData, isLoading: isStaffLoading } = useGetStaffReport(timeframe);

    const business = bizData?.data;
    const staff = staffData?.data?.staff || [];

    const timeframes = [
        { id: '7d', label: 'Last 7 Days' },
        { id: '30d', label: 'Last 30 Days' },
        { id: '90d', label: 'Last Quarter' },
        { id: '12m', label: 'Full Year' },
    ];

    const handleExportCSV = () => {
        // Simple export for current view
        const dataToExport = activeTab === 'business' ? business?.trajectory : staff;
        if (!dataToExport) return;

        let csvContent = "data:text/csv;charset=utf-8,";
        if (activeTab === 'business') {
            if (business) {
            csvContent += "Date,Revenue\n" + business.trajectory.map(t => `${new Date(t.day).toLocaleDateString()},${t.total}`).join("\n");
        }
        } else {
            csvContent += "Staff Name,Role,Total Bookings,Revenue,Cancellations\n" + staff.map(s => `${s.name},${s.role},${s.total_bookings},${s.revenue},${s.cancellations}`).join("\n");
        }
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `salon_${activeTab}_report_${timeframe}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const maxRevenue = business?.trajectory ? Math.max(...business.trajectory.map(d => Number(d.total)), 1) : 1;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <button 
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 text-xs text-salon-muted hover:text-salon-primary mb-2 transition-colors uppercase tracking-widest font-semibold"
                    >
                        <ArrowLeft className="w-3 h-3" /> Back to Dashboard
                    </button>
                    <h2 className="text-3xl font-serif text-salon-primary">Elite Analytics</h2>
                    <p className="text-sm text-salon-muted mt-1">High-fidelity data insights for Salon Saleh operations.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                    {/* Timeframe Selector */}
                    <div className="flex bg-salon-surface/50 border border-salon-golden/10 p-1 rounded-md">
                        {timeframes.map((tf) => (
                            <button
                                key={tf.id}
                                onClick={() => setTimeframe(tf.id)}
                                className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold transition-all rounded ${
                                    timeframe === tf.id 
                                    ? 'bg-salon-golden text-black' 
                                    : 'text-salon-muted hover:text-salon-primary'
                                }`}
                            >
                                {tf.id.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <button 
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-6 py-2.5 bg-salon-golden text-black text-xs font-bold tracking-widest uppercase hover:bg-salon-golden-muted transition-colors rounded shadow-[0_0_15px_rgba(197,160,89,0.2)]"
                    >
                        <Download className="w-4 h-4" /> Export
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-salon-golden/10 gap-8">
                <button 
                    onClick={() => setActiveTab('business')}
                    className={`pb-4 text-xs uppercase tracking-[0.2em] font-bold transition-all relative ${
                        activeTab === 'business' ? 'text-salon-golden' : 'text-salon-muted hover:text-salon-primary'
                    }`}
                >
                    Business Intelligence
                    {activeTab === 'business' && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-salon-golden" />}
                </button>
                <button 
                    onClick={() => setActiveTab('staff')}
                    className={`pb-4 text-xs uppercase tracking-[0.2em] font-bold transition-all relative ${
                        activeTab === 'staff' ? 'text-salon-golden' : 'text-salon-muted hover:text-salon-primary'
                    }`}
                >
                    Staff Performance
                    {activeTab === 'staff' && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-salon-golden" />}
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'business' ? (
                    <motion.div 
                        key="business"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-8"
                    >
                        {isBizLoading ? (
                            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-salon-golden" /></div>
                        ) : (
                            <>
                                {/* Business KPI Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="bg-salon-surface/50 border border-salon-golden/10 p-6 rounded-lg">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[10px] uppercase tracking-widest text-salon-muted font-semibold">Net Ecosystem Revenue</span>
                                            <DollarSign className="w-4 h-4 text-salon-golden" />
                                        </div>
                                        <div className="text-3xl font-serif text-salon-primary">${business?.summary.totalRevenue.toLocaleString()}</div>
                                        <div className="text-[10px] text-salon-muted mt-2 flex gap-2">
                                            <span className="text-salon-golden">Bks: ${business?.summary.bookingRevenue.toLocaleString()}</span>
                                            <span className="opacity-30">|</span>
                                            <span>Shop: ${business?.summary.orderRevenue.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-salon-surface/50 border border-salon-golden/10 p-6 rounded-lg">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[10px] uppercase tracking-widest text-salon-muted font-semibold">Waitlist Conversion</span>
                                            <Percent className="w-4 h-4 text-salon-golden" />
                                        </div>
                                        <div className="text-3xl font-serif text-salon-primary">{business?.summary.conversionRate}</div>
                                        <div className="text-[10px] text-salon-muted mt-2">
                                            {business?.summary.waitlistConverted} out of {business?.summary.waitlistTotal} leads converted
                                        </div>
                                    </div>

                                    <div className="bg-salon-surface/50 border border-salon-golden/10 p-6 rounded-lg">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[10px] uppercase tracking-widest text-salon-muted font-semibold">Active Rituals</span>
                                            <Calendar className="w-4 h-4 text-salon-golden" />
                                        </div>
                                        <div className="text-3xl font-serif text-salon-primary">{business?.summary.waitlistConverted}</div>
                                        <div className="text-[10px] text-salon-muted mt-2">Total bookings in this period</div>
                                    </div>

                                    <div className="bg-salon-surface/50 border border-salon-golden/10 p-6 rounded-lg">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[10px] uppercase tracking-widest text-salon-muted font-semibold">Inventory Sales</span>
                                            <ShoppingCart className="w-4 h-4 text-salon-golden" />
                                        </div>
                                        <div className="text-3xl font-serif text-salon-primary">${business?.summary.orderRevenue.toLocaleString()}</div>
                                        <div className="text-[10px] text-salon-muted mt-2">Revenue from product orders</div>
                                    </div>
                                </div>

                                {/* Charts & Tables */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 bg-salon-surface/30 border border-salon-golden/10 rounded-lg p-8">
                                        <h3 className="font-serif text-xl text-salon-primary mb-2">Revenue Growth Path</h3>
                                        <p className="text-xs text-salon-muted mb-12 uppercase tracking-widest">Aggregate growth including bookings and inventory.</p>
                                        
                                        <div className="flex items-end justify-between gap-2 h-72 border-b border-salon-golden/20 pb-4 relative">
                                            {business?.trajectory.map((day, idx) => {
                                                const pct = Math.max((Number(day.total) / maxRevenue) * 100, 5);
                                                return (
                                                    <div key={idx} className="flex-1 relative group flex flex-col justify-end h-full">
                                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-bold text-salon-primary opacity-0 group-hover:opacity-100 transition-opacity bg-salon-surface border border-salon-golden/30 px-2 py-1 rounded shadow-xl z-20 whitespace-nowrap">
                                                            ${Number(day.total).toFixed(2)}
                                                        </div>
                                                        <motion.div 
                                                            initial={{ height: 0 }}
                                                            animate={{ height: `${pct}%` }}
                                                            className="w-full bg-salon-golden transition-all rounded-t-sm cursor-pointer relative group-hover:bg-salon-golden/80 group-hover:outline group-hover:outline-1 group-hover:outline-dotted group-hover:outline-salon-golden group-hover:outline-offset-4 shadow-[0_0_10px_rgba(197,160,89,0.2)]"
                                                        ></motion.div>
                                                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] text-salon-muted uppercase tracking-tighter whitespace-nowrap rotate-45 origin-left">
                                                            {new Date(day.day).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="bg-salon-surface/30 border border-salon-golden/10 rounded-lg p-8">
                                        <h3 className="font-serif text-xl text-salon-primary mb-6 flex items-center gap-2">
                                            <Star className="w-4 h-4 text-salon-golden" /> Elite Coupons
                                        </h3>
                                        <div className="space-y-6">
                                            {business?.topCoupons.map((coupon, idx) => (
                                                <div key={idx} className="flex flex-col gap-2 border-b border-salon-golden/5 pb-4 last:border-0">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs font-bold tracking-widest text-salon-golden uppercase">{coupon.code}</span>
                                                        <span className="text-[10px] text-salon-muted">{coupon.usage_count} Uses</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[10px] text-salon-muted uppercase tracking-widest">Total Value Given</span>
                                                        <span className="text-sm font-serif text-salon-primary">${Number(coupon.total_discount).toFixed(2)}</span>
                                                    </div>
                                                    <div className="w-full h-1 bg-salon-base rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-salon-golden" 
                                                            style={{ width: `${(coupon.usage_count / (business?.topCoupons[0].usage_count || 1)) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            {business?.topCoupons.length === 0 && (
                                                <div className="text-center py-10 text-salon-muted italic text-sm">No coupon data for this period.</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                ) : (
                    <motion.div 
                        key="staff"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-8"
                    >
                        {isStaffLoading ? (
                            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-salon-golden" /></div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {staff.map((s, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setSelectedStaff(s)}
                                            className={`bg-salon-surface/40 border rounded-lg p-8 transition-all relative overflow-hidden text-left ${selectedStaff?.name === s.name ? 'border-salon-golden/40 shadow-[0_0_30px_rgba(212,175,55,0.15)]' : 'border-salon-golden/10 hover:border-salon-golden/30'}`}
                                        >
                                            <div className="absolute -right-4 -top-4 w-16 h-16 bg-salon-golden/5 flex items-center justify-center rotate-45 text-salon-golden text-xl font-serif transition-all">
                                                <span className="-rotate-45 ml-2 mt-2">#{idx + 1}</span>
                                            </div>

                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="w-16 h-16 rounded-full bg-salon-golden/10 border border-salon-golden/20 flex items-center justify-center">
                                                    <UserCheck className="w-8 h-8 text-salon-golden" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-serif text-salon-primary">{s.name}</h4>
                                                    <p className="text-[10px] uppercase tracking-[0.2em] text-salon-muted">{s.role}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] uppercase tracking-widest text-salon-muted">Revenue Generated</span>
                                                    <span className="text-xl font-serif text-salon-golden">${Number(s.revenue || 0).toLocaleString()}</span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-salon-base/40 p-3 rounded border border-salon-golden/5">
                                                        <div className="text-[9px] uppercase tracking-widest text-salon-muted mb-1">Rituals Confirmed</div>
                                                        <div className="text-lg font-serif text-salon-primary">{s.total_bookings}</div>
                                                    </div>
                                                    <div className="bg-salon-base/40 p-3 rounded border border-salon-golden/5">
                                                        <div className="text-[9px] uppercase tracking-widest text-salon-muted mb-1">Cancellations</div>
                                                        <div className="text-lg font-serif text-salon-primary">{s.cancellations}</div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="flex justify-between text-[9px] uppercase tracking-widest mb-1">
                                                        <span className="text-salon-muted">Retention Score</span>
                                                        <span className="text-salon-golden">
                                                            {s.total_bookings > 0
                                                                ? (100 - (s.cancellations / (Number(s.total_bookings) + Number(s.cancellations)) * 100)).toFixed(0)
                                                                : 100}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full h-1 bg-salon-base rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-salon-golden"
                                                            style={{ width: `${s.total_bookings > 0 ? (100 - (s.cancellations / (Number(s.total_bookings) + Number(s.cancellations)) * 100)) : 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {selectedStaff ? (
                                    <div className="bg-salon-surface/40 border border-salon-golden/10 rounded-lg p-8 mt-8">
                                        <div className="flex flex-col lg:flex-row justify-between gap-6 items-start">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-[0.3em] text-salon-golden font-bold mb-2">Staff Detail</p>
                                                <h3 className="text-2xl font-serif text-salon-primary mb-1">{selectedStaff.name}</h3>
                                                <p className="text-sm text-salon-muted uppercase tracking-[0.2em]">{selectedStaff.role}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedStaff(null)}
                                                className="text-xs uppercase tracking-[0.3em] text-salon-golden font-bold border border-salon-golden/20 rounded px-4 py-2 hover:bg-salon-golden/10 transition-colors"
                                            >
                                                Clear Selection
                                            </button>
                                        </div>

                                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="bg-salon-base/40 rounded-lg p-5 border border-salon-golden/10">
                                                <p className="text-[10px] uppercase tracking-[0.3em] text-salon-muted mb-2">Total Bookings</p>
                                                <p className="text-3xl font-serif text-salon-primary">{selectedStaff.total_bookings}</p>
                                            </div>
                                            <div className="bg-salon-base/40 rounded-lg p-5 border border-salon-golden/10">
                                                <p className="text-[10px] uppercase tracking-[0.3em] text-salon-muted mb-2">Revenue</p>
                                                <p className="text-3xl font-serif text-salon-golden">${Number(selectedStaff.revenue || 0).toLocaleString()}</p>
                                            </div>
                                            <div className="bg-salon-base/40 rounded-lg p-5 border border-salon-golden/10">
                                                <p className="text-[10px] uppercase tracking-[0.3em] text-salon-muted mb-2">Cancellations</p>
                                                <p className="text-3xl font-serif text-salon-primary">{selectedStaff.cancellations}</p>
                                            </div>
                                        </div>

                                        <div className="mt-8">
                                            <p className="text-[10px] uppercase tracking-[0.3em] text-salon-muted mb-2">Booking Performance</p>
                                            <div className="w-full h-3 bg-salon-base rounded-full overflow-hidden border border-salon-golden/10">
                                                <div
                                                    className="h-full bg-salon-golden"
                                                    style={{ width: `${selectedStaff.total_bookings > 0 ? (100 - (selectedStaff.cancellations / (Number(selectedStaff.total_bookings) + Number(selectedStaff.cancellations)) * 100)) : 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {selectedStaff && activeTab === 'staff' && (
                <div
                    className="fixed inset-0 z-50 grid place-items-center  px-4 py-6"
                    onClick={() => setSelectedStaff(null)}
                >
                    <div
                        className="w-full max-w-5xl max-h-[calc(100vh-3rem)] overflow-y-auto rounded-[1.5rem] border border-salon-golden/20 bg-salon-surface p-6 shadow-2xl text-salon-primary"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-salon-golden font-bold mb-2">Staff Detail</p>
                                <h3 className="text-3xl leading-tight font-serif text-salon-primary">{selectedStaff.name}</h3>
                                <p className="text-sm text-salon-muted uppercase tracking-[0.2em]">{selectedStaff.role}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedStaff(null)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-salon-golden/20 bg-salon-surface text-salon-golden transition hover:bg-salon-golden/10"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                            <div className="space-y-6">
                                <div className="flex flex-col gap-5 rounded-3xl border border-salon-golden/10 bg-salon-surface p-6">
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-salon-golden/20 bg-salon-golden/10">
                                                {selectedStaff.avatar_url ? (
                                                    <img
                                                        src={selectedStaff.avatar_url}
                                                        alt={selectedStaff.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <UserCheck className="h-10 w-10 text-salon-golden" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[11px] uppercase tracking-[0.3em] text-salon-muted">Status</p>
                                                <p className="text-sm font-semibold text-salon-primary">
                                                    {selectedStaff.is_active ? 'Active' : 'Inactive'}{selectedStaff.is_deleted ? ' • Deleted' : ''}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                            <div className="rounded-2xl bg-salon-surface/80 p-4 text-center border border-salon-golden/10 min-h-[92px] flex flex-col justify-center whitespace-normal">
                                                <p className="text-[10px] uppercase tracking-[0.3em] text-salon-muted leading-tight">Bookings</p>
                                                <p className="text-2xl font-serif text-salon-primary break-words">{selectedStaff.total_bookings}</p>
                                            </div>
                                            <div className="rounded-2xl bg-salon-surface/80 p-4 text-center border border-salon-golden/10 min-h-[92px] flex flex-col justify-center whitespace-normal">
                                                <p className="text-[10px] uppercase tracking-[0.3em] text-salon-muted leading-tight">Revenue</p>
                                                <p className="text-2xl font-serif text-salon-golden break-words">${Number(selectedStaff.revenue || 0).toLocaleString()}</p>
                                            </div>
                                            <div className="rounded-2xl bg-salon-surface/80 p-4 text-center border border-salon-golden/10 min-h-[92px] flex flex-col justify-center whitespace-normal">
                                                <p className="text-[10px] uppercase tracking-[0.3em] text-salon-muted leading-tight">Cancellations</p>
                                                <p className="text-2xl font-serif text-salon-primary break-words">{selectedStaff.cancellations}</p>
                                            </div>
                                            <div className="rounded-2xl bg-salon-surface/80 p-4 text-center border border-salon-golden/10 min-h-[92px] flex flex-col justify-center whitespace-normal">
                                                <p className="text-[10px] uppercase tracking-[0.3em] text-salon-muted leading-tight">Retention</p>
                                                <p className="text-2xl font-serif text-salon-golden break-words">
                                                    {selectedStaff.total_bookings > 0
                                                        ? `${(100 - (selectedStaff.cancellations / (Number(selectedStaff.total_bookings) + Number(selectedStaff.cancellations)) * 100)).toFixed(0)}%`
                                                        : '100%'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="rounded-3xl bg-salon-base/40 p-5 border border-salon-golden/10">
                                            <p className="text-[10px] uppercase tracking-[0.3em] text-salon-muted mb-2">Email</p>
                                            <p className="text-sm text-salon-primary">{selectedStaff.email || 'Not provided'}</p>
                                        </div>
                                        <div className="rounded-3xl bg-salon-base/40 p-5 border border-salon-golden/10">
                                            <p className="text-[10px] uppercase tracking-[0.3em] text-salon-muted mb-2">Phone</p>
                                            <p className="text-sm text-salon-primary">{selectedStaff.phone || 'Not provided'}</p>
                                        </div>
                                        <div className="rounded-3xl bg-salon-base/40 p-5 border border-salon-golden/10">
                                            <p className="text-[10px] uppercase tracking-[0.3em] text-salon-muted mb-2">Staff ID</p>
                                            <p className="text-sm text-salon-primary break-all">{selectedStaff.id}</p>
                                        </div>
                                        <div className="rounded-3xl bg-salon-base/40 p-5 border border-salon-golden/10">
                                            <p className="text-[10px] uppercase tracking-[0.3em] text-salon-muted mb-2">User ID</p>
                                            <p className="text-sm text-salon-primary break-all">{selectedStaff.user_id || 'None'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="rounded-3xl bg-salon-base/40 p-6 border border-salon-golden/10">
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-salon-muted mb-4">Database Fields</p>
                                    <div className="grid gap-4 text-sm text-salon-primary sm:grid-cols-2">
                                        <div className="space-y-1 rounded-2xl bg-salon-surface/80 p-4 border border-salon-golden/10">
                                            <p className="text-[10px] uppercase tracking-[0.3em] text-salon-muted">Active</p>
                                            <p>{selectedStaff.is_active ? 'Yes' : 'No'}</p>
                                        </div>
                                        <div className="space-y-1 rounded-2xl bg-salon-surface/80 p-4 border border-salon-golden/10">
                                            <p className="text-[10px] uppercase tracking-[0.3em] text-salon-muted">Deleted</p>
                                            <p>{selectedStaff.is_deleted ? 'Yes' : 'No'}</p>
                                        </div>
                                        <div className="space-y-1 rounded-2xl bg-salon-surface/80 p-4 border border-salon-golden/10">
                                            <p className="text-[10px] uppercase tracking-[0.3em] text-salon-muted">Sort Order</p>
                                            <p>{selectedStaff.sort_order}</p>
                                        </div>
                                        <div className="space-y-1 rounded-2xl bg-salon-surface/80 p-4 border border-salon-golden/10">
                                            <p className="text-[10px] uppercase tracking-[0.3em] text-salon-muted">Joined</p>
                                            <p>{new Date(selectedStaff.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <div className="space-y-1 rounded-2xl bg-salon-surface/80 p-4 border border-salon-golden/10 sm:col-span-2">
                                            <p className="text-[10px] uppercase tracking-[0.3em] text-salon-muted">Last Updated</p>
                                            <p>{new Date(selectedStaff.updated_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-3xl bg-salon-base/40 p-6 border border-salon-golden/10">
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-salon-muted mb-4">Detailed Performance</p>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-[0.3em] text-salon-muted mb-2">Booking Performance</p>
                                            <div className="w-full h-3 rounded-full bg-salon-base overflow-hidden border border-salon-golden/10">
                                                <div
                                                    className="h-full bg-salon-golden"
                                                    style={{ width: `${selectedStaff.total_bookings > 0 ? (100 - (selectedStaff.cancellations / (Number(selectedStaff.total_bookings) + Number(selectedStaff.cancellations)) * 100)) : 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="rounded-2xl bg-salon-surface/80 p-4 border border-salon-golden/10">
                                                <p className="text-[10px] uppercase tracking-[0.3em] text-salon-muted">Average Revenue / Booking</p>
                                                <p className="text-sm text-salon-primary">
                                                    ${selectedStaff.total_bookings > 0 ? (Number(selectedStaff.revenue || 0) / selectedStaff.total_bookings).toFixed(2) : '0.00'}
                                                </p>
                                            </div>
                                            <div className="rounded-2xl bg-salon-surface/80 p-4 border border-salon-golden/10">
                                                <p className="text-[10px] uppercase tracking-[0.3em] text-salon-muted">Cancellation Rate</p>
                                                <p className="text-sm text-salon-primary">
                                                    {selectedStaff.total_bookings > 0
                                                        ? `${((selectedStaff.cancellations / Number(selectedStaff.total_bookings)) * 100).toFixed(1)}%`
                                                        : '0%'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReports;
