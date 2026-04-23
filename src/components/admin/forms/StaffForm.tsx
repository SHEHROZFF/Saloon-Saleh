import React, { useState, useEffect } from 'react';
import { useCreateStaff, useUpdateStaff } from '../../../hooks/queries/useStaff';
import { Staff } from '../../../services/api/staffService';
import { useGetServices } from '../../../hooks/queries/useServices';
import { toast } from '../../ui/Toast';

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
        is_featured: false,
        service_ids: [] as string[],
        bio: '',
        experience_years: '',
        specialties: [] as string[],
        avatar_url: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                role: initialData.role || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                is_active: initialData.is_active !== false,
                is_featured: !!initialData.is_featured,
                service_ids: Array.isArray(initialData.services) 
                    ? initialData.services.map((s: any) => typeof s === 'object' ? s.id : s) 
                    : [],
                bio: (initialData as any).bio || '',
                experience_years: (initialData as any).experience_years || '',
                specialties: (initialData as any).specialties || [],
                avatar_url: initialData.avatar_url || ''
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (initialData) {
            updateStaff({ id: initialData.id, data: formData }, {
                onSuccess: () => { toast.success('Staff profile updated.'); onClose(); }
            });
        } else {
            createStaff(formData, {
                onSuccess: () => { toast.success('Staff member created.'); onClose(); }
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
        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
            <div className="space-y-4 text-salon-primary">
                <div className="grid grid-cols-2 gap-4">
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Email</label>
                        <input
                            required
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
                            required
                            type="text"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                            placeholder="Phone Number"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Avatar URL</label>
                    <input
                        type="url"
                        value={formData.avatar_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
                        className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                        placeholder="https://images.unsplash.com/..."
                    />
                </div>

                <div className="border-t border-salon-golden/10 pt-4 mt-4">
                    <h4 className="text-[10px] uppercase tracking-widest text-salon-golden mb-4 font-bold">Expert Portfolio Details</h4>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Experience Years</label>
                            <input
                                type="text"
                                value={formData.experience_years}
                                onChange={(e) => setFormData(prev => ({ ...prev, experience_years: e.target.value }))}
                                className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                                placeholder="e.g. 8 Years"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Specialties (comma separated)</label>
                            <input
                                type="text"
                                value={formData.specialties.join(', ')}
                                onChange={(e) => setFormData(prev => ({ ...prev, specialties: e.target.value.split(',').map(s => s.trim()) }))}
                                className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                                placeholder="e.g. Skin Fade, Beard Grooming"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Professional Bio</label>
                        <textarea
                            rows={4}
                            value={formData.bio}
                            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                            className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors resize-none"
                            placeholder="Briefly describe the expert's artistry..."
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-2">Assigned Services</label>
                    <div className="bg-salon-surface border border-salon-golden/10 rounded-md p-3 max-h-40 overflow-y-auto space-y-2">
                        {allServices.length === 0 ? (
                            <div className="text-xs text-salon-muted italic">No services available.</div>
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

                <div className="flex flex-col gap-3 pt-2">
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                            className="accent-salon-golden w-4 h-4"
                        />
                        <label htmlFor="is_active" className="text-sm cursor-pointer font-medium">Active Staff Member</label>
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_featured"
                            checked={formData.is_featured}
                            onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                            className="accent-salon-golden w-4 h-4"
                        />
                        <label htmlFor="is_featured" className="text-sm cursor-pointer font-medium text-salon-golden">Feature on Landing Page</label>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-salon-golden/10 bg-salon-base sticky bottom-0 z-10">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 text-sm font-semibold tracking-wider uppercase text-salon-muted hover:text-salon-primary transition-colors bg-salon-surface border border-salon-golden/10 rounded-md"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 py-3 text-sm font-bold tracking-wider uppercase text-black bg-salon-golden hover:bg-salon-golden-muted transition-colors rounded-md disabled:opacity-50 flex justify-center items-center gap-2"
                >
                    {isPending ? 'Saving...' : (initialData ? 'Update Profile' : 'Add Profile')}
                </button>
            </div>
        </form>
    );
};

export default StaffForm;
