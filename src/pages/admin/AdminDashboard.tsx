import { useAppSelector } from '@store/hooks';
import { Users, CalendarCheck, Clock, DollarSign, ArrowUpRight, Loader2 } from 'lucide-react';
import { useGetAllBookings } from '../../hooks/queries/useBookings';
import { useGetAdminStats } from '../../hooks/queries/useAdmin';
import { Link } from 'react-router-dom';

const ICON_MAP: Record<string, any> = {
    DollarSign,
    CalendarCheck,
    Users,
    Clock
};

const AdminDashboard = () => {
    const user = useAppSelector(state => state.auth.user);

    const { data: statsData, isLoading: statsLoading } = useGetAdminStats();
    const liveStats = statsData?.data?.stats || [];

    const { data: bookingsData, isLoading: bookingsLoading } = useGetAllBookings();
    const liveBookings = bookingsData?.data?.bookings || [];
    const recentBookings = liveBookings.slice(0, 5);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
            {/* Greeting */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-serif text-salon-primary">Welcome back, {user?.name?.split(' ')[0] || 'Admin'}</h2>
                    <p className="text-sm text-salon-muted mt-2">Here is what's happening at your salon today.</p>
                </div>
                <Link 
                    to="/admin/reports"
                    className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-salon-golden text-black text-xs font-bold tracking-widest uppercase hover:bg-salon-golden-muted transition-colors rounded"
                >
                    Report <ArrowUpRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {statsLoading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="bg-salon-surface/50 border border-salon-golden/10 p-6 rounded-lg animate-pulse">
                            <div className="h-4 w-20 bg-salon-golden/10 rounded mb-4"></div>
                            <div className="h-8 w-24 bg-salon-golden/10 rounded"></div>
                        </div>
                    ))
                ) : liveStats.map((stat, idx) => {
                    const Icon = ICON_MAP[stat.icon] || Clock;
                    return (
                        <div key={idx} className="bg-salon-surface/50 border border-salon-golden/10 p-6 rounded-lg relative overflow-hidden group hover:border-salon-golden/30 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] uppercase tracking-widest text-salon-muted font-semibold">{stat.label}</span>
                                <span className="p-2 bg-salon-golden/10 text-salon-golden rounded-md group-hover:bg-salon-golden group-hover:text-black transition-colors">
                                    <Icon className="w-4 h-4" />
                                </span>
                            </div>
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-serif text-salon-primary">{stat.value}</span>
                                <span className="text-xs text-green-500 font-medium tracking-wider">{stat.change}</span>
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-salon-golden/5 rounded-full blur-2xl group-hover:bg-salon-golden/10 transition-colors pointer-events-none"></div>
                        </div>
                    );
                })}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Recent Bookings Table */}
                <div className="xl:col-span-2 bg-salon-surface/30 border border-salon-golden/10 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-serif text-xl text-salon-primary">Today's Appointments</h3>
                        <button className="text-[10px] text-salon-golden uppercase tracking-widest hover:underline hover:underline-offset-4">View All</button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-salon-golden/20">
                                    <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Client</th>
                                    <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Service</th>
                                    <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Staff</th>
                                    <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Time</th>
                                    <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookingsLoading ? (
                                    <tr>
                                        <td colSpan={5} className="py-10 text-center text-salon-muted">
                                            <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-salon-golden" />
                                            Loading recent bookings...
                                        </td>
                                    </tr>
                                ) : recentBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-10 text-center text-salon-muted">No appointments found today.</td>
                                    </tr>
                                ) : recentBookings.map((booking: any) => (
                                    <tr key={booking.id} className="border-b border-salon-golden/5 hover:bg-salon-surface/50 transition-colors group">
                                        <td className="py-4 text-sm font-medium text-salon-primary">{booking.first_name} {booking.last_name}</td>
                                        <td className="py-4 text-sm text-salon-muted">{booking.service_names?.join(', ') || 'N/A'}</td>
                                        <td className="py-4 text-sm flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-salon-golden/20 border border-salon-golden text-[8px] flex items-center justify-center text-salon-golden font-bold">
                                                {booking.staff_name?.charAt(0) || 'S'}
                                            </div>
                                            <span className="text-salon-primary">{booking.staff_name || 'Unassigned'}</span>
                                        </td>
                                        <td className="py-4 text-sm text-salon-muted font-serif">{booking.time_slot_label || 'TBD'}</td>
                                        <td className="py-4">
                                            <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-sm font-semibold
                                                ${booking.status === 'confirmed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : ''}
                                                ${booking.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : ''}
                                                ${booking.status === 'completed' ? 'bg-salon-golden/10 text-salon-golden border border-salon-golden/20' : ''}
                                                ${booking.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : ''}
                                            `}>
                                                {booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Performance Chart Placeholder */}
                <div className="bg-salon-surface/30 border border-salon-golden/10 rounded-lg p-6 relative overflow-hidden flex flex-col">
                    <h3 className="font-serif text-xl text-salon-primary mb-2">Weekly Performance</h3>
                    <p className="text-xs text-salon-muted mb-8">Revenue breakdown by service category.</p>
                    
                    <div className="flex-1 flex items-end justify-between gap-2 z-10">
                        {/* Mock Bar Chart */}
                        <div className="w-full bg-salon-golden/20 rounded-t-sm h-1/3 relative group"><div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-salon-primary opacity-0 group-hover:opacity-100 transition-opacity">Mon</div></div>
                        <div className="w-full bg-salon-golden/40 rounded-t-sm h-1/2 relative group"><div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-salon-primary opacity-0 group-hover:opacity-100 transition-opacity">Tue</div></div>
                        <div className="w-full bg-salon-golden/60 rounded-t-sm h-3/4 relative group"><div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-salon-primary opacity-0 group-hover:opacity-100 transition-opacity">Wed</div></div>
                        <div className="w-full bg-salon-golden rounded-t-sm h-full relative group shadow-[0_0_15px_rgba(197,160,89,0.3)]"><div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-salon-primary opacity-0 group-hover:opacity-100 transition-opacity font-bold">Thu</div></div>
                        <div className="w-full bg-salon-golden/30 rounded-t-sm h-2/5 relative group"><div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-salon-primary opacity-0 group-hover:opacity-100 transition-opacity">Fri</div></div>
                        <div className="w-full bg-salon-golden/80 rounded-t-sm h-5/6 relative group"><div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-salon-primary opacity-0 group-hover:opacity-100 transition-opacity">Sat</div></div>
                        <div className="w-full bg-salon-golden/10 rounded-t-sm h-1/4 relative group"><div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-salon-primary opacity-0 group-hover:opacity-100 transition-opacity">Sun</div></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
