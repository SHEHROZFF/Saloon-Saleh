import React, { useState, useEffect } from 'react';
import { useCreateService, useUpdateService, useGetServiceCategories } from '../../../hooks/queries/useServices';
import { Service } from '../../../services/api/serviceService';
import { toast } from '../../ui/Toast';

interface ServiceFormProps {
    initialData?: Service | null;
    onClose: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ initialData, onClose }) => {
    const { mutate: createService, isPending: isCreating } = useCreateService();
    const { mutate: updateService, isPending: isUpdating } = useUpdateService();
    const { data: categoriesData } = useGetServiceCategories();
    
    // Fallback based on how the backend sends it
    const categories = (categoriesData?.data as any)?.categories || categoriesData?.data || [];

    const [formData, setFormData] = useState<Partial<Service>>({
        name: '',
        price: '',
        duration: '30 mins',
        category_id: '',
        description: '',
        gender_target: 'All',
        is_active: true
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                price: initialData.price || '',
                duration: initialData.duration || '30 mins',
                category_id: initialData.category_id || '',
                description: initialData.description || '',
                gender_target: initialData.gender_target || 'All',
                is_active: initialData.is_active !== false
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (initialData) {
            updateService({ id: initialData.id, data: formData }, {
                onSuccess: () => { toast.success('Service updated.'); onClose(); }
            });
        } else {
            createService(formData, {
                onSuccess: () => { toast.success('Service created.'); onClose(); }
            });
        }
    };

    const isPending = isCreating || isUpdating;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 text-salon-primary">
                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Service Name</label>
                    <input
                        required
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                        placeholder="e.g. Premium Haircut"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Category</label>
                        <select
                            required
                            value={formData.category_id || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                            className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                        >
                            <option value="" disabled>Select Category</option>
                            {categories.map((cat: any) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Target Gender</label>
                        <select
                            required
                            value={formData.gender_target || 'All'}
                            onChange={(e) => setFormData(prev => ({ ...prev, gender_target: e.target.value as any }))}
                            className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                        >
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                            <option value="Kids">Kids</option>
                            <option value="All">All</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Price (DH)</label>
                        <input
                            required
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.price || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                            className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Duration</label>
                        <select
                            required
                            value={formData.duration || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                            className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                        >
                            <option value="15 mins">15 mins</option>
                            <option value="30 mins">30 mins</option>
                            <option value="45 mins">45 mins</option>
                            <option value="1 hour">1 hour</option>
                            <option value="1.5 hours">1.5 hours</option>
                            <option value="2 hours">2+ hours</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Description</label>
                    <textarea
                        rows={3}
                        value={formData.description || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors resize-none"
                        placeholder="Brief description of the service"
                    />
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                        className="accent-salon-golden w-4 h-4"
                    />
                    <label htmlFor="is_active" className="text-sm cursor-pointer">Service is Active</label>
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
                    {isPending ? 'Saving...' : (initialData ? 'Update Service' : 'Add Service')}
                </button>
            </div>
        </form>
    );
};

export default ServiceForm;
