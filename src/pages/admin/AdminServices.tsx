import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useGetServices, useDeleteService } from '../../hooks/queries/useServices';
import AdminSlideOver from '../../components/admin/AdminSlideOver';
import ServiceForm from '../../components/admin/forms/ServiceForm';
import { Service } from '../../services/api/serviceService';

const AdminServices = () => {
    const { data, isLoading } = useGetServices();
    const { mutate: deleteService } = useDeleteService();
    const services = (data?.data as any)?.services || data?.data || [];

    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const handleAddClick = () => {
        setEditingService(null);
        setIsSlideOverOpen(true);
    };

    const handleEditClick = (s: Service) => {
        setEditingService(s);
        setIsSlideOverOpen(true);
    };

    const handleCloseSlideOver = () => {
        setIsSlideOverOpen(false);
        setEditingService(null);
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif text-salon-primary">Salon Services</h2>
                <button 
                    onClick={handleAddClick}
                    className="px-6 py-2.5 bg-salon-golden text-black text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-salon-golden-muted transition-colors rounded"
                >
                    <Plus className="w-4 h-4" /> Add Service
                </button>
            </div>
            
            <div className="bg-salon-surface/30 border border-salon-golden/10 rounded-lg p-6">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-salon-golden/20">
                            <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Service Name</th>
                            <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Category</th>
                            <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Duration</th>
                            <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Price</th>
                            <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={5} className="text-center py-10">Loading services...</td></tr>
                        ) : services.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-10 text-salon-muted italic">No services found. Add one to get started.</td></tr>
                        ) : services.map((s: any) => (
                            <tr key={s.id} className="border-b border-salon-golden/5 hover:bg-salon-surface/50 transition-colors group">
                                <td className="py-4 text-sm font-medium text-salon-primary">{s.name}</td>
                                <td className="py-4 text-sm text-salon-muted">{s.category_name || 'Uncategorized'}</td>
                                <td className="py-4 text-sm">{s.duration}</td>
                                <td className="py-4 text-sm font-serif text-salon-golden">${typeof s.price === 'string' ? parseFloat(s.price).toFixed(2) : s.price}</td>
                                <td className="py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEditClick(s)} className="text-salon-muted hover:text-salon-golden p-1">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => confirm('Are you sure you want to delete this service?') && deleteService(s.id)} className="text-salon-muted hover:text-red-500 p-1">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AdminSlideOver 
                isOpen={isSlideOverOpen} 
                onClose={handleCloseSlideOver}
                title={editingService ? "Edit Service" : "Add New Service"}
            >
                <ServiceForm 
                    initialData={editingService} 
                    onClose={handleCloseSlideOver} 
                />
            </AdminSlideOver>
        </div>
    );
};
export default AdminServices;
