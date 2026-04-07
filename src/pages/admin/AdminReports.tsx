import { useMemo } from 'react';
import { Download, TrendingUp, Users, Calendar, DollarSign, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetAllBookings } from '../../hooks/queries/useBookings';

const AdminReports = () => {
    const navigate = useNavigate();
    const { data, isLoading } = useGetAllBookings();
    const bookings = (data?.data as any)?.bookings || data?.data || [];

    // Simple robust aggregation logic for the reports
    const stats = useMemo(() => {
        let totalRevenue = 0;
        let completedCount = 0;
        let pendingCount = 0;
        let cancelledCount = 0;
        const serviceCounts: Record<string, number> = {};
        const staffRevenue: Record<string, number> = {};
        const dailyRevenue: Record<string, number> = {}; // Format 'YYYY-MM-DD'

        bookings.forEach((b: any) => {
            const price = typeof b.total_price === 'string' ? parseFloat(b.total_price) : (b.total_price || 0);
            
            if (b.status === 'completed' || b.status === 'confirmed') {
                totalRevenue += price;
                
                // Staff Performance
                const sName = b.staff_name || 'Unassigned';
                staffRevenue[sName] = (staffRevenue[sName] || 0) + price;
                
                // Daily Revenue
                const dateKey = b.booking_date.split('T')[0];
                dailyRevenue[dateKey] = (dailyRevenue[dateKey] || 0) + price;
            }

            if (b.status === 'completed') completedCount++;
            else if (b.status === 'pending') pendingCount++;
            else if (b.status === 'cancelled') cancelledCount++;

            // Service Popularity
            if (b.service_names && Array.isArray(b.service_names)) {
                b.service_names.forEach((s: string) => {
                    serviceCounts[s] = (serviceCounts[s] || 0) + 1;
                });
            } else if (b.services && Array.isArray(b.services)) {
                b.services.forEach((s: any) => {
                    const sName = typeof s === 'string' ? s : s.name;
                    if (sName) serviceCounts[sName] = (serviceCounts[sName] || 0) + 1;
                });
            }
        });

        // Sort Top Services
        const topServices = Object.entries(serviceCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        // Sort Top Staff
        const topStaff = Object.entries(staffRevenue)
            .sort((a, b) => b[1] - a[1]);

        // Get Last 7 Days of Revenue
        const today = new Date();
        const last7Days = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            return {
                label: d.toLocaleDateString(undefined, { weekday: 'short' }),
                revenue: dailyRevenue[dateStr] || 0
            };
        }).reverse(); // chronological

        return { 
            totalRevenue, completedCount, pendingCount, cancelledCount, 
            topServices, topStaff, last7Days 
        };
    }, [bookings]);

    const handleExportCSV = () => {
        const headers = ["Booking ID", "Date", "Client", "Staff", "Amount", "Status"];
        const rows = bookings.map((b: any) => [
            b.id,
            b.booking_date.split('T')[0],
            `${b.first_name || ''} ${b.last_name || ''}`.trim(),
            b.staff_name || 'Unassigned',
            b.total_price || 0,
            b.status
        ]);
        
        let csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `salon_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Loader2 className="w-8 h-8 text-salon-golden animate-spin" />
            </div>
        );
    }

    // For chart mapping visually (max height calculation)
    const maxRevenue = Math.max(...stats.last7Days.map(d => d.revenue), 1);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <button 
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 text-xs text-salon-muted hover:text-salon-primary mb-2 transition-colors uppercase tracking-widest font-semibold"
                    >
                        <ArrowLeft className="w-3 h-3" /> Back to Dashboard
                    </button>
                    <h2 className="text-3xl font-serif text-salon-primary">Executive Reports</h2>
                    <p className="text-sm text-salon-muted mt-1">Comprehensive breakdown of salon performance.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => window.print()}
                        className="px-5 py-2.5 bg-salon-surface border border-salon-golden/20 text-salon-primary text-xs font-bold tracking-widest uppercase hover:border-salon-golden transition-colors rounded"
                    >
                        Print PDF
                    </button>
                    <button 
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-6 py-2.5 bg-salon-golden text-black text-xs font-bold tracking-widest uppercase hover:bg-salon-golden-muted transition-colors rounded shadow-[0_0_15px_rgba(197,160,89,0.2)]"
                    >
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                </div>
            </div>

            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-salon-surface/50 border border-salon-golden/10 p-6 rounded-lg relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] uppercase tracking-widest text-salon-muted font-semibold">Total Revenue Map</span>
                        <span className="text-salon-golden"><DollarSign className="w-4 h-4" /></span>
                    </div>
                    <span className="text-3xl font-serif text-salon-primary">${stats.totalRevenue.toFixed(2)}</span>
                </div>
                <div className="bg-salon-surface/50 border border-salon-golden/10 p-6 rounded-lg relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] uppercase tracking-widest text-salon-muted font-semibold">Completed Slots</span>
                        <span className="text-green-500"><TrendingUp className="w-4 h-4" /></span>
                    </div>
                    <span className="text-3xl font-serif text-salon-primary">{stats.completedCount}</span>
                </div>
                <div className="bg-salon-surface/50 border border-salon-golden/10 p-6 rounded-lg relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] uppercase tracking-widest text-salon-muted font-semibold">Pending Requests</span>
                        <span className="text-yellow-500"><Calendar className="w-4 h-4" /></span>
                    </div>
                    <span className="text-3xl font-serif text-salon-primary">{stats.pendingCount}</span>
                </div>
                <div className="bg-salon-surface/50 border border-salon-golden/10 p-6 rounded-lg relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] uppercase tracking-widest text-salon-muted font-semibold">Cancelled Slots</span>
                        <span className="text-red-500"><Users className="w-4 h-4" /></span>
                    </div>
                    <span className="text-3xl font-serif text-salon-primary">{stats.cancelledCount}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 7-Day Revenue Graph */}
                <div className="lg:col-span-2 bg-salon-surface/30 border border-salon-golden/10 rounded-lg p-6 flex flex-col">
                    <h3 className="font-serif text-xl text-salon-primary mb-2">7-Day Revenue Trajectory</h3>
                    <p className="text-xs text-salon-muted mb-8">Gross revenue aggregated from confirmed and completed bookings.</p>
                    
                    <div className="flex-1 flex items-end justify-between gap-4 h-64 mt-auto border-b border-salon-golden/20 pb-2 relative">
                        {/* Background grid lines */}
                        <div className="absolute inset-x-0 bottom-0 h-full flex flex-col justify-between pointer-events-none opacity-10">
                            {[0, 1, 2, 3].map(i => <div key={i} className="border-t border-salon-golden/50 w-full"></div>)}
                        </div>
                        
                        {stats.last7Days.map((day, idx) => {
                            const pct = Math.max((day.revenue / maxRevenue) * 100, 5); // minimum 5% height for visibility
                            return (
                                <div key={idx} className="w-full relative group flex flex-col justify-end h-full z-10">
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-serif text-salon-primary opacity-0 group-hover:opacity-100 transition-opacity bg-black px-2 py-1 rounded">
                                        ${day.revenue.toFixed(2)}
                                    </div>
                                    <div 
                                        style={{ height: `${pct}%` }} 
                                        className="w-full bg-salon-golden/60 group-hover:bg-salon-golden transition-all rounded-t-sm"
                                    ></div>
                                    <div className="text-center mt-3 text-[10px] text-salon-muted uppercase tracking-widest">{day.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Popular Services & Top Staff */}
                <div className="space-y-8">
                    {/* Top Staff */}
                    <div className="bg-salon-surface/30 border border-salon-golden/10 rounded-lg p-6">
                        <h3 className="font-serif text-lg text-salon-primary mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-salon-golden" /> Staff Revenue Leaders
                        </h3>
                        {stats.topStaff.length === 0 ? (
                            <p className="text-sm text-salon-muted italic">Not enough data.</p>
                        ) : (
                            <ul className="space-y-4">
                                {stats.topStaff.map(([name, rev], idx) => (
                                    <li key={idx} className="flex justify-between items-center text-sm border-b border-salon-golden/5 pb-2 last:border-0 last:pb-0">
                                        <span className="text-salon-primary">{name}</span>
                                        <span className="font-serif text-salon-golden font-medium">${rev.toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Popular Services */}
                    <div className="bg-salon-surface/30 border border-salon-golden/10 rounded-lg p-6">
                        <h3 className="font-serif text-lg text-salon-primary mb-4">Most Booked Services</h3>
                        {stats.topServices.length === 0 ? (
                            <p className="text-sm text-salon-muted italic">Not enough data.</p>
                        ) : (
                            <ul className="space-y-4">
                                {stats.topServices.map(([name, count], idx) => (
                                    <li key={idx} className="flex justify-between items-center text-sm">
                                        <span className="truncate pr-4 text-salon-primary">{name}</span>
                                        <span className="px-2 py-0.5 bg-salon-golden/10 text-salon-golden rounded-sm text-xs font-bold">{count}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
