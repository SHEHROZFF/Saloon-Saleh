import React, { useState, useEffect } from 'react';
import { useCreateBooking, useUpdateBookingDetails, useCheckAvailability } from '../../../hooks/queries/useBookings';
import { useGetStaff } from '../../../hooks/queries/useStaff';
import { useGetServices } from '../../../hooks/queries/useServices';
import { Booking } from '../../../services/api/bookingService';
import { toast } from '../../ui/Toast';

interface ManualBookingFormProps {
    initialData?: Booking | null;
    onClose: () => void;
}

const ManualBookingForm: React.FC<ManualBookingFormProps> = ({ initialData, onClose }) => {
    const { mutate: createBooking, isPending: isCreating } = useCreateBooking();
    const { mutate: updateBooking, isPending: isUpdating } = useUpdateBookingDetails();
    
    const { data: staffData } = useGetStaff();
    const { data: servicesData } = useGetServices();

    const staffList = (staffData?.data as any)?.staff || staffData?.data || [];
    const servicesList = (servicesData?.data as any)?.services || servicesData?.data || [];

    const [date, setDate] = useState('');
    const [staffId, setStaffId] = useState('');

    const { data: availabilityData, isFetching: isChecking } = useCheckAvailability(date, staffId);
    
    const rawSlots = (availabilityData?.data as any)?.slots || [];
    const availableSlots = Array.isArray(rawSlots) ? rawSlots.filter(s => s.is_available) : [];

    // If editing, the original slot might be marked unavailable because it belongs to THIS booking constraint.
    // For proper UI, we push the currently assigned slot back into availableSlots if it's not there.
    const displaySlots = [...availableSlots];
    if (initialData && initialData.time_slot_id && initialData.booking_date.split('T')[0] === date && initialData.staff_id === staffId) {
        if (!displaySlots.find(s => s.id === initialData.time_slot_id)) {
            displaySlots.push({ id: initialData.time_slot_id, display_label: initialData.time_slot_label || 'Current Slot', is_available: true });
            // Sort them if needed, but pushing is fine for just satisfying the dropdown
        }
    }

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        gender: 'Men',
        time_slot_id: '',
        service_ids: [] as string[],
        notes: ''
    });

    useEffect(() => {
        if (initialData) {
            setDate(initialData.booking_date.split('T')[0]);
            setStaffId(initialData.staff_id);
            setFormData({
                first_name: initialData.first_name || '',
                last_name: initialData.last_name || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                gender: initialData.gender || 'Men',
                time_slot_id: initialData.time_slot_id || '',
                // Parse out the IDs if services arrive as objects
                service_ids: Array.isArray(initialData.services) 
                    ? initialData.services.map((s: any) => typeof s === 'object' ? s.id : s).filter(Boolean)
                    : [],
                notes: initialData.notes || ''
            });
        }
    }, [initialData]);

    const handleServiceToggle = (serviceId: string) => {
        setFormData(prev => ({
            ...prev,
            service_ids: prev.service_ids.includes(serviceId)
                ? prev.service_ids.filter(id => id !== serviceId)
                : [...prev.service_ids, serviceId]
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload = {
            ...formData,
            booking_date: date,
            staff_id: staffId
        };
        
        if (initialData) {
            updateBooking({ id: initialData.id, data: payload }, { onSuccess: () => { toast.success('Booking updated successfully.'); onClose(); } });
        } else {
            createBooking(payload, { onSuccess: () => { toast.success('Booking created successfully.'); onClose(); } });
        }
    };

    const isPending = isCreating || isUpdating;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 text-salon-primary">
                {/* Section: Appointment Details */}
                <div className="pt-2">
                    <h4 className="text-sm font-medium border-b border-salon-golden/20 pb-2 mb-4 text-salon-golden">Appointment Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Date</label>
                            <input
                                required
                                type="date"
                                min={!initialData ? new Date().toISOString().split('T')[0] : undefined}
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors [color-scheme:dark]"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Staff Member</label>
                            <select
                                required
                                value={staffId}
                                onChange={(e) => setStaffId(e.target.value)}
                                className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                            >
                                <option value="" disabled>Select Staff</option>
                                {staffList.map((s: any) => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1 flex items-center gap-2">
                            Time Slot
                            {isChecking && <span className="text-[10px] text-salon-golden animate-pulse lowercase">(checking...)</span>}
                        </label>
                        <select
                            required
                            disabled={!date || !staffId}
                            value={formData.time_slot_id}
                            onChange={(e) => setFormData(prev => ({ ...prev, time_slot_id: e.target.value }))}
                            className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors disabled:opacity-50"
                        >
                            <option value="" disabled>
                                {!date || !staffId ? 'Select Date & Staff first' : 'Select Time'}
                            </option>
                            {displaySlots.length === 0 && date && staffId && !isChecking && (
                                <option value="" disabled>No slots available for this date</option>
                            )}
                            {displaySlots.map((slot: any) => (
                                <option key={slot.id} value={slot.id}>{slot.display_label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-4">
                        <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-2">Services</label>
                        <div className="bg-salon-surface border border-salon-golden/10 rounded-md p-3 max-h-40 overflow-y-auto space-y-2">
                            {servicesList.length === 0 ? (
                                <div className="text-xs text-salon-muted italic">No services available.</div>
                            ) : servicesList.map((service: any) => (
                                <label key={service.id} className="flex items-center gap-3 p-2 hover:bg-salon-golden/5 rounded cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.service_ids.includes(service.id)}
                                        onChange={() => handleServiceToggle(service.id)}
                                        className="accent-salon-golden w-4 h-4"
                                    />
                                    <span className="text-sm flex-1">{service.name}</span>
                                    <span className="text-xs font-serif text-salon-golden">${typeof service.price === 'string' ? parseFloat(service.price).toFixed(2) : service.price}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Section: Customer Details */}
                <div className="pt-4 mt-4">
                    <h4 className="text-sm font-medium border-b border-salon-golden/20 pb-2 mb-4 text-salon-golden">Customer Details</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">First Name</label>
                            <input
                                required
                                type="text"
                                value={formData.first_name}
                                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                                className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Last Name</label>
                            <input
                                type="text"
                                value={formData.last_name}
                                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                                className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Email</label>
                            <input
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Phone</label>
                            <input
                                required
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Gender</label>
                            <select
                                required
                                value={formData.gender}
                                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                                className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                            >
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                                <option value="Kids">Kids</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Internal Notes</label>
                        <textarea
                            rows={2}
                            value={formData.notes}
                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                            className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors resize-none"
                            placeholder="Optional notes for staff..."
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-salon-golden/10">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 text-sm font-semibold tracking-wider uppercase text-salon-muted hover:text-salon-primary transition-colors bg-salon-surface/50 border border-salon-golden/10 rounded-md hover:border-salon-golden/30"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isPending || formData.service_ids.length === 0}
                    className="flex-1 py-3 text-sm font-bold tracking-wider uppercase text-black bg-salon-golden hover:bg-salon-golden-muted transition-colors rounded-md disabled:opacity-50 flex justify-center items-center gap-2"
                >
                    {isPending ? 'Saving...' : (initialData ? 'Update Booking' : 'Create Booking')}
                </button>
            </div>
        </form>
    );
};

export default ManualBookingForm;
