import { useAppSelector } from '@store/hooks';
import { CalendarCheck, Clock, Scissors, TrendingUp, Loader2 } from 'lucide-react';
import { useGetStaffBookings, useUpdateStaffBookingStatus } from '../../hooks/queries/useBookings';

// Helper: extract service names from the services JSON array
const getServiceNames = (services: any[]): string => {
    if (!services || !Array.isArray(services) || services.length === 0) return 'N/A';
    return services.map((s: any) => s.name).join(', ');
};

const StaffDashboard = () => {
    const user = useAppSelector(state => state.auth.user);

    const { data: bookingsData, isLoading } = useGetStaffBookings();
    const { mutate: updateStatus } = useUpdateStaffBookingStatus();
    const liveBookings = bookingsData?.data?.bookings || [];
    
    // Sort and limit for dashboard
    const todaysSchedule = liveBookings.slice(0, 5);

    const stats = [
        { label: 'Upcoming Appointments', value: liveBookings.filter((b: any) => b.status === 'confirmed').length.toString(), icon: CalendarCheck },
        { label: 'Total Assigned', value: liveBookings.length.toString(), icon: TrendingUp },
        { label: 'Hours Scheduled', value: (liveBookings.length * 1.5).toString(), icon: Clock },
        { label: 'Services Completed', value: liveBookings.filter((b: any) => b.status === 'completed').length.toString(), icon: Scissors },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
            {/* Greeting */}
            <div>
                <h2 className="text-3xl font-serif text-salon-primary">Hello, {user?.name?.split(' ')[0] || 'Staff'}</h2>
                <p className="text-sm text-salon-muted mt-2">Here is your schedule for today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {isLoading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="bg-salon-surface/50 border border-salon-golden/10 p-6 rounded-lg animate-pulse">
                            <div className="h-4 w-20 bg-salon-golden/10 rounded mb-4"></div>
                            <div className="h-8 w-24 bg-salon-golden/10 rounded"></div>
                        </div>
                    ))
                ) : stats.map((stat, idx) => (
                    <div key={idx} className="bg-salon-surface/50 border border-salon-golden/10 p-6 rounded-lg relative overflow-hidden group hover:border-salon-golden/30 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] uppercase tracking-widest text-salon-muted font-semibold">{stat.label}</span>
                            <span className="p-2 bg-salon-golden/10 text-salon-golden rounded-md group-hover:bg-salon-golden group-hover:text-black transition-colors">
                                <stat.icon className="w-4 h-4" />
                            </span>
                        </div>
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-serif text-salon-primary">{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Schedule Timeline View */}
            <div className="bg-salon-surface/30 border border-salon-golden/10 rounded-lg p-6 max-w-4xl">
                <h3 className="font-serif text-xl text-salon-primary mb-6">Today's Schedule</h3>
                
                <div className="relative border-l border-salon-golden/20 ml-4 space-y-8 pb-4">
                    {isLoading ? (
                        <div className="py-10 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-salon-golden" /></div>
                    ) : todaysSchedule.length === 0 ? (
                        <div className="py-10 text-center text-salon-muted italic">You have no appointments scheduled.</div>
                    ) : todaysSchedule.map((slot: any) => (
                        <div key={slot.id} className="relative pl-8 group">
                            {/* Timeline dot */}
                            <div className={`absolute -left-2 top-1.5 w-4 h-4 rounded-full border-2 border-salon-surface
                                ${slot.status === 'completed' ? 'bg-salon-golden' : ''}
                                ${slot.status === 'confirmed' ? 'bg-green-500' : ''}
                                ${slot.status === 'pending' ? 'bg-yellow-500' : ''}
                                ${slot.status === 'cancelled' ? 'bg-red-500' : ''}
                            `}></div>
                            
                            <div className={`p-5 rounded-lg border transition-all duration-300
                                ${slot.status === 'cancelled' ? 'bg-salon-surface border-transparent opacity-60' : 'bg-salon-base border-salon-golden/10 hover:border-salon-golden/30'}
                            `}>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-serif text-lg text-salon-primary">{slot.time_label || 'TBD'}</span>
                                            <span className={`px-2 py-0.5 text-[9px] uppercase tracking-wider rounded-sm font-semibold
                                                ${slot.status === 'confirmed' ? 'bg-green-500/10 text-green-500' : ''}
                                                ${slot.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : ''}
                                                ${slot.status === 'completed' ? 'bg-salon-golden/10 text-salon-golden' : ''}
                                                ${slot.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : ''}
                                            `}>
                                                {slot.status}
                                            </span>
                                        </div>
                                        <h4 className="text-sm font-medium text-salon-primary">{slot.first_name} {slot.last_name}</h4>
                                        <p className="text-xs text-salon-muted mt-1">{getServiceNames(slot.services)}</p>
                                    </div>
                                    <div className="text-right flex flex-col justify-between h-full">
                                        <span className="text-[10px] uppercase tracking-widest text-salon-muted inline-flex items-center gap-1.5">
                                            <Clock className="w-3 h-3" /> {new Date(slot.booking_date).toLocaleDateString()}
                                        </span>
                                        {slot.status !== 'cancelled' && slot.status !== 'completed' && (
                                            <select
                                                value={slot.status}
                                                onChange={(e) => updateStatus({ id: slot.id, status: e.target.value })}
                                                className="mt-3 sm:mt-auto bg-salon-base border border-salon-golden/30 hover:border-salon-golden rounded px-3 py-1.5 text-[10px] text-salon-golden uppercase tracking-widest transition-colors focus:outline-none cursor-pointer"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
