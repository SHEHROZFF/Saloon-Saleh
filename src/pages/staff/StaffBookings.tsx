import { useGetStaffBookings, useUpdateStaffBookingStatus } from '../../hooks/queries/useBookings';

// Helper: extract service names from the services JSON array
const getServiceNames = (services: any[]): string => {
    if (!services || !Array.isArray(services) || services.length === 0) return 'N/A';
    return services.map((s: any) => s.name).join(', ');
};

const StaffBookings = () => {
    const { data, isLoading } = useGetStaffBookings();
    const { mutate: updateStatus } = useUpdateStaffBookingStatus();
    const bookings = data?.data?.bookings || [];

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-serif text-salon-primary">My Schedule</h2>
                    <p className="text-xs text-salon-muted mt-1">Review all your upcoming appointments.</p>
                </div>
            </div>

            <div className="bg-salon-surface/30 border border-salon-golden/10 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-salon-base border-b border-salon-golden/20">
                                <th className="p-4 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Client</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Service</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Date & Time</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Status</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-salon-muted font-normal text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={5} className="text-center py-10">Loading your schedule...</td></tr>
                            ) : bookings.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-10 text-salon-muted italic">You have no appointments assigned.</td></tr>
                            ) : bookings.map((booking: any) => (
                                <tr key={booking.id} className="border-b border-salon-golden/5 hover:bg-salon-surface/50 transition-colors group">
                                    <td className="p-4 text-sm font-medium text-salon-primary">{booking.first_name} {booking.last_name}</td>
                                    <td className="p-4 text-sm text-salon-muted">{getServiceNames(booking.services)}</td>
                                    <td className="p-4">
                                        <div className="text-sm text-salon-primary">{new Date(booking.booking_date).toLocaleDateString()}</div>
                                        <div className="text-[10px] font-serif text-salon-golden uppercase tracking-widest">{booking.time_label || 'TBD'}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-sm font-semibold
                                            ${booking.status === 'confirmed' ? 'bg-green-500/10 text-green-500' : ''}
                                            ${booking.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : ''}
                                            ${booking.status === 'completed' ? 'bg-salon-golden/10 text-salon-golden' : ''}
                                            ${booking.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : ''}
                                        `}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <select 
                                            value={booking.status} 
                                            onChange={(e) => updateStatus({ id: booking.id, status: e.target.value })}
                                            className="bg-salon-base border border-salon-golden/20 rounded px-2 py-1 text-[10px] uppercase text-salon-primary focus:outline-none focus:border-salon-golden cursor-pointer transition-colors"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-salon-golden/10 bg-salon-base">
                    <span className="text-[10px] uppercase tracking-widest text-salon-muted">Showing {bookings.length} appointment{bookings.length !== 1 ? 's' : ''}</span>
                </div>
            </div>
        </div>
    );
};

export default StaffBookings;
