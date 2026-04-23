import { useState } from 'react';
import { Search, Filter, Eye, Trash2, Edit2, Ban } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { useGetAllBookings, useDeleteBooking, useUpdateBookingStatus } from '../../hooks/queries/useBookings';
import { useGetStaff } from '../../hooks/queries/useStaff';
import AdminSlideOver from '../../components/admin/AdminSlideOver';
import ManualBookingForm from '../../components/admin/forms/ManualBookingForm';
import BookingDetails from '../../components/admin/BookingDetails';
import { Booking } from '../../services/api/bookingService';

const AdminBookings = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [staffFilter, setStaffFilter] = useState('');
    
    const debouncedSearch = useDebounce(searchTerm, 500);

    const { data, isLoading } = useGetAllBookings({ 
        search: debouncedSearch, 
        status: statusFilter,
        date: dateFilter,
        staff_id: staffFilter
    });
    
    const { data: staffData } = useGetStaff();
    const staffList = (staffData?.data as any)?.staff || [];

    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        setDateFilter('');
        setStaffFilter('');
    };
    const { mutate: deleteBooking } = useDeleteBooking();
    const { mutate: updateStatus } = useUpdateBookingStatus();
    const bookings = (data?.data as any)?.bookings || data?.data || [];

    const [slideOverMode, setSlideOverMode] = useState<'create' | 'view' | 'edit' | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    const handleCreateClick = () => {
        setSelectedBooking(null);
        setSlideOverMode('create');
    };

    const handleViewClick = (booking: Booking) => {
        setSelectedBooking(booking);
        setSlideOverMode('view');
    };

    const handleEditClick = (booking: Booking) => {
        setSelectedBooking(booking);
        setSlideOverMode('edit');
    };

    const handleCloseSlideOver = () => {
        setSlideOverMode(null);
        setSelectedBooking(null);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-serif text-salon-primary">Bookings Management</h2>
                    <p className="text-xs text-salon-muted mt-1">View and manage all salon appointments.</p>
                </div>
                <button 
                    onClick={handleCreateClick}
                    className="px-6 py-2.5 bg-salon-golden text-black text-xs font-bold tracking-widest uppercase hover:bg-salon-golden-muted transition-colors rounded"
                >
                    + New Booking
                </button>
            </div>

            {/* Filters / Search */}
            <div className="bg-salon-surface/50 border border-salon-golden/10 p-4 rounded-lg flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-salon-muted" />
                    <input 
                        type="text" 
                        placeholder="Search by client name, ID, or phone..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-salon-base border border-salon-golden/20 rounded pl-10 pr-4 py-2.5 text-sm text-salon-primary placeholder-salon-muted focus:outline-none focus:border-salon-golden transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-salon-base border border-salon-golden/20 rounded px-4 py-2.5 text-sm text-salon-primary focus:outline-none focus:border-salon-golden appearance-none cursor-pointer"
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <select 
                        value={staffFilter}
                        onChange={(e) => setStaffFilter(e.target.value)}
                        className="bg-salon-base border border-salon-golden/20 rounded px-4 py-2.5 text-sm text-salon-primary focus:outline-none focus:border-salon-golden appearance-none cursor-pointer min-w-[140px]"
                    >
                        <option value="">All Experts</option>
                        {staffList.map((s: any) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                    <input 
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="bg-salon-base border border-salon-golden/20 rounded px-4 py-2.5 text-sm text-salon-primary focus:outline-none focus:border-salon-golden cursor-pointer"
                    />
                    <button 
                        onClick={resetFilters}
                        className="px-4 py-2.5 bg-salon-base border border-salon-golden/20 rounded text-salon-primary hover:border-salon-golden transition-colors flex items-center gap-2 hover:bg-salon-golden/5"
                    >
                        <Filter className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-widest font-medium hidden sm:inline">Reset</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-salon-surface/30 border border-salon-golden/10 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-salon-base border-b border-salon-golden/20">
                                <th className="p-4 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Booking ID</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Client Info</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Service & Staff</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Date & Time</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Amount</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Status</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-salon-muted font-normal text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={7} className="text-center py-10">Loading bookings...</td></tr>
                            ) : bookings.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-10 text-salon-muted italic">No bookings found in the system.</td></tr>
                            ) : bookings.map((booking: any) => (
                                <tr key={booking.id} className="border-b border-salon-golden/5 hover:bg-salon-surface/50 transition-colors group">
                                    <td className="p-4 text-xs font-serif text-salon-golden">{booking.id.substring(0, 8).toUpperCase()}</td>
                                    <td className="p-4">
                                        <div className="text-sm font-medium text-salon-primary">{booking.first_name} {booking.last_name || ''}</div>
                                        <div className="text-xs text-salon-muted mt-0.5">{booking.phone}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm text-salon-primary">{booking.service_names?.join(', ') || 'Service Booked'}</div>
                                        <div className="text-[10px] uppercase tracking-widest text-salon-golden-muted mt-1">{booking.staff_name || 'Unassigned'}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm font-medium text-salon-primary">{new Date(booking.booking_date).toLocaleDateString()}</div>
                                        <div className="text-xs text-salon-muted font-serif mt-0.5">{booking.time_slot_label || booking.time_slot_id || 'Time not specified'}</div>
                                    </td>
                                    <td className="p-4 text-sm font-serif text-salon-primary">${typeof booking.total_price === 'string' ? parseFloat(booking.total_price).toFixed(2) : booking.total_price}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-sm font-semibold inline-block
                                            ${booking.status === 'confirmed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : ''}
                                            ${booking.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : ''}
                                            ${booking.status === 'completed' ? 'bg-salon-golden/10 text-salon-golden border border-salon-golden/20' : ''}
                                            ${booking.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : ''}
                                        `}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleViewClick(booking)}
                                                className="p-1.5 text-salon-muted hover:text-salon-primary transition-colors" 
                                                title="View details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleEditClick(booking)}
                                                className="p-1.5 text-salon-muted hover:text-salon-golden transition-colors" 
                                                title="Edit booking"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            {booking.status !== 'cancelled' && (
                                                <button 
                                                    onClick={() => confirm('Soft Cancel this booking?') && updateStatus({ id: booking.id, status: 'cancelled' })} 
                                                    className="p-1.5 text-salon-muted hover:text-yellow-500 transition-colors" 
                                                    title="Cancel booking"
                                                >
                                                    <Ban className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => confirm('Are you sure you want to PERMANENTLY delete this booking entry?') && deleteBooking(booking.id)} 
                                                className="p-1.5 text-salon-muted hover:text-red-500 transition-colors" 
                                                title="Delete booking permanently"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                <div className="p-4 border-t border-salon-golden/10 bg-salon-base flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-salon-muted">Showing {bookings.length} bookings</span>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 text-xs border border-salon-golden/20 text-salon-muted rounded hover:border-salon-golden transition-colors disabled:opacity-50">Prev</button>
                        <button className="px-3 py-1 text-xs border border-salon-golden bg-salon-golden/10 text-salon-golden rounded">1</button>
                        <button className="px-3 py-1 text-xs border border-salon-golden/20 text-salon-muted rounded hover:border-salon-golden transition-colors disabled:opacity-50">Next</button>
                    </div>
                </div>
            </div>

            <AdminSlideOver 
                isOpen={slideOverMode !== null} 
                onClose={handleCloseSlideOver}
                title={slideOverMode === 'create' ? "Create Manual Booking" : slideOverMode === 'edit' ? "Edit Booking" : "Booking Details"}
            >
                {slideOverMode === 'create' && <ManualBookingForm onClose={handleCloseSlideOver} />}
                {slideOverMode === 'edit' && selectedBooking && <ManualBookingForm initialData={selectedBooking} onClose={handleCloseSlideOver} />}
                {slideOverMode === 'view' && selectedBooking && <BookingDetails booking={selectedBooking} onClose={handleCloseSlideOver} />}
            </AdminSlideOver>
        </div>
    );
};

export default AdminBookings;
