import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useGetStaff, useDeleteStaff } from '../../hooks/queries/useStaff';
import AdminSlideOver from '../../components/admin/AdminSlideOver';
import StaffForm from '../../components/admin/forms/StaffForm';
import { Staff } from '../../services/api/staffService';

const AdminStaff = () => {
    const { data, isLoading } = useGetStaff();
    const { mutate: deleteStaff } = useDeleteStaff();
    const staff = (data?.data as any)?.staff || data?.data || [];

    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

    const handleAddClick = () => {
        setEditingStaff(null);
        setIsSlideOverOpen(true);
    };

    const handleEditClick = (s: Staff) => {
        setEditingStaff(s);
        setIsSlideOverOpen(true);
    };

    const handleCloseSlideOver = () => {
        setIsSlideOverOpen(false);
        setEditingStaff(null);
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif text-salon-primary">Staff Management</h2>
                <button 
                    onClick={handleAddClick}
                    className="px-6 py-2.5 bg-salon-golden text-black text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-salon-golden-muted transition-colors rounded"
                >
                    <Plus className="w-4 h-4" /> Add Staff
                </button>
            </div>
            
            <div className="bg-salon-surface/30 border border-salon-golden/10 rounded-lg p-6">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-salon-golden/20">
                            <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Name</th>
                            <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Role</th>
                            <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Phone</th>
                            <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Status</th>
                            <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={5} className="text-center py-10">Loading staff...</td></tr>
                        ) : staff.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-10 text-salon-muted italic">No staff found. Added personnel will appear here.</td></tr>
                        ) : staff.map((s: any) => (
                            <tr key={s.id} className="border-b border-salon-golden/5 hover:bg-salon-surface/50 transition-colors group">
                                <td className="py-4 text-sm font-medium text-salon-primary flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-salon-golden/20 flex items-center justify-center text-salon-golden text-xs border border-salon-golden/30">{s.name.charAt(0)}</div>
                                    {s.name}
                                </td>
                                <td className="py-4 text-sm text-salon-muted">{s.role}</td>
                                <td className="py-4 text-sm">{s.phone || 'N/A'}</td>
                                <td className="py-4 text-[10px] uppercase tracking-wider">{s.is_active ? 'Active' : 'Inactive'}</td>
                                <td className="py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEditClick(s)} className="text-salon-muted hover:text-salon-golden p-1">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => confirm('Are you sure you want to delete this staff member?') && deleteStaff(s.id)} className="text-salon-muted hover:text-red-500 p-1">
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
                title={editingStaff ? "Edit Staff Member" : "Add New Staff"}
            >
                <StaffForm 
                    initialData={editingStaff} 
                    onClose={handleCloseSlideOver} 
                />
            </AdminSlideOver>
        </div>
    );
};
export default AdminStaff;
