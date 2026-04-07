import React from 'react';
import { Calendar, User, Clock, Scissors } from 'lucide-react';
import { Booking } from '../../services/api/bookingService';

interface BookingDetailsProps {
    booking: Booking;
    onClose: () => void;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ booking, onClose }) => {
    
    const getServicesList = (servicesJson: any) => {
        try {
            if (!servicesJson) return [];
            if (typeof servicesJson === 'string') {
                const parsed = JSON.parse(servicesJson);
                if (Array.isArray(parsed)) return parsed;
            }
            if (Array.isArray(servicesJson)) return servicesJson;
            return [];
        } catch (e) {
            return [];
        }
    };

    const services = getServicesList(booking.services);

    return (
        <div className="space-y-6 text-salon-primary">
            
            {/* Customer Section */}
            <div className="bg-salon-surface/30 p-4 border border-salon-golden/10 rounded-lg space-y-3">
                <h4 className="text-sm font-serif text-salon-golden border-b border-salon-golden/10 pb-2 flex items-center gap-2">
                    <User className="w-4 h-4" /> Customer Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                    <div>
                        <span className="block text-[10px] uppercase text-salon-muted tracking-widest">Name</span>
                        <span className="font-medium">{booking.first_name} {booking.last_name || ''}</span>
                    </div>
                    <div>
                        <span className="block text-[10px] uppercase text-salon-muted tracking-widest">Gender</span>
                        <span className="capitalize">{booking.gender || 'Not specified'}</span>
                    </div>
                    <div>
                        <span className="block text-[10px] uppercase text-salon-muted tracking-widest">Email</span>
                        <span className="truncate">{booking.email || 'N/A'}</span>
                    </div>
                    <div>
                        <span className="block text-[10px] uppercase text-salon-muted tracking-widest">Phone</span>
                        <span>{booking.phone}</span>
                    </div>
                </div>
            </div>

            {/* Appointment Section */}
            <div className="bg-salon-surface/30 p-4 border border-salon-golden/10 rounded-lg space-y-3">
                <h4 className="text-sm font-serif text-salon-golden border-b border-salon-golden/10 pb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Appointment Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                    <div>
                        <span className="block text-[10px] uppercase text-salon-muted tracking-widest">Date</span>
                        <span className="font-medium">{new Date(booking.booking_date).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div>
                        <span className="block text-[10px] uppercase text-salon-muted tracking-widest">Time</span>
                        <span className="flex items-center gap-1 font-medium"><Clock className="w-3 h-3 text-salon-golden" /> {booking.time_slot_label || booking.time_slot_id}</span>
                    </div>
                    <div className="col-span-2">
                        <span className="block text-[10px] uppercase text-salon-muted tracking-widest">Assigned Staff</span>
                        <span className="font-medium">{booking.staff_name || 'Unassigned'}</span>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div className="bg-salon-surface/30 p-4 border border-salon-golden/10 rounded-lg space-y-3">
                <h4 className="text-sm font-serif text-salon-golden border-b border-salon-golden/10 pb-2 flex items-center gap-2">
                    <Scissors className="w-4 h-4" /> Purchased Services
                </h4>
                {services.length === 0 ? (
                    <p className="text-sm text-salon-muted italic">No specific services tracked.</p>
                ) : (
                    <ul className="space-y-2 mt-2">
                        {services.map((s: any, i: number) => (
                            <li key={i} className="flex justify-between items-center text-sm border-b border-salon-golden/5 pb-2 last:border-0 last:pb-0">
                                <span>{s.name}</span>
                                {s.price && <span className="font-serif">${parseFloat(s.price).toFixed(2)}</span>}
                            </li>
                        ))}
                    </ul>
                )}
                
                <div className="flex justify-between items-center pt-2 mt-2 border-t border-salon-golden/20 font-serif">
                    <span className="text-sm text-salon-muted">Total Paid</span>
                    <span className="text-lg text-salon-golden font-medium">${typeof booking.total_price === 'string' ? parseFloat(booking.total_price).toFixed(2) : booking.total_price}</span>
                </div>
            </div>

            {/* Notes Section */}
            {booking.notes && (
                <div className="bg-salon-surface/30 p-4 border border-salon-golden/10 rounded-lg space-y-2">
                    <span className="block text-[10px] uppercase text-salon-muted tracking-widest">Internal Notes</span>
                    <p className="text-sm text-salon-primary italic bg-black/10 p-2 rounded">{booking.notes}</p>
                </div>
            )}
            
            <div className="pt-4 border-t border-salon-golden/10">
                <button
                    onClick={onClose}
                    className="w-full py-3 text-sm font-semibold tracking-wider uppercase text-salon-muted hover:text-black hover:bg-salon-golden transition-colors border border-salon-golden/20 rounded-md hover:border-salon-golden"
                >
                    Close Record
                </button>
            </div>
        </div>
    );
};

export default BookingDetails;
