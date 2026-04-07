import React, { useState, useEffect } from 'react';
import { useCreateStaff, useUpdateStaff } from '../../../hooks/queries/useStaff';
import { Staff } from '../../../services/api/staffService';
import { useGetServices } from '../../../hooks/queries/useServices';

interface StaffFormProps {
    initialData?: Staff | null;
    onClose: () => void;
}

const StaffForm: React.FC<StaffFormProps> = ({ initialData, onClose }) => {
    const { mutate: createStaff, isPending: isCreating } = useCreateStaff();
    const { mutate: updateStaff, isPending: isUpdating } = useUpdateStaff();
    const { data: servicesData } = useGetServices();
    const allServices = (servicesData?.data as any)?.services || servicesData?.data || [];

    const [formData, setFormData] = useState({
        name: '',
        role: '',
        email: '',
        phone: '',
        is_active: true,
        service_ids: [] as string[]
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                role: initialData.role || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                is_active: initialData.is_active !== false,
                service_ids: Array.isArray(initialData.services) 
                    ? initialData.services.map((s: any) => typeof s === 'object' ? s.id : s) 
                    : []
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (initialData) {
            updateStaff({ id: initialData.id, data: formData }, {
                onSuccess: () => onClose()
            });
        } else {
            createStaff(formData, {
                onSuccess: () => onClose()
            });
        }
    };

    const handleServiceToggle = (serviceId: string) => {
        setFormData(prev => ({
            ...prev,
            service_ids: prev.service_ids.includes(serviceId)
                ? prev.service_ids.filter(id => id !== serviceId)
                : [...prev.service_ids, serviceId]
        }));
    };

    const isPending = isCreating || isUpdating;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 text-salon-primary">
                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Name</label>
                    <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                        placeholder="Staff Name"
                    />
                </div>

                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Role</label>
                    <input
                        required
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                        className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                        placeholder="e.g. Senior Barber"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                            placeholder="Email Address"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Phone</label>
                        <input
                            type="text"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                            placeholder="Phone Number"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-2">Assigned Services</label>
                    <div className="bg-salon-surface border border-salon-golden/10 rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                        {allServices.length === 0 ? (
                            <div className="text-xs text-salon-muted italic">No services available. Create them first.</div>
                        ) : allServices.map((service: any) => (
                            <label key={service.id} className="flex items-center gap-3 p-2 hover:bg-salon-golden/5 rounded cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.service_ids.includes(service.id)}
                                    onChange={() => handleServiceToggle(service.id)}
                                    className="accent-salon-golden w-4 h-4"
                                />
                                <span className="text-sm">{service.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                        className="accent-salon-golden w-4 h-4"
                    />
                    <label htmlFor="is_active" className="text-sm cursor-pointer">Active Staff Member</label>
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
                    disabled={isPending}
                    className="flex-1 py-3 text-sm font-bold tracking-wider uppercase text-black bg-salon-golden hover:bg-salon-golden-muted transition-colors rounded-md disabled:opacity-50 flex justify-center items-center gap-2"
                >
                    {isPending ? 'Saving...' : (initialData ? 'Update Staff' : 'Add Staff')}
                </button>
            </div>
        </form>
    );
};

export default StaffForm;
