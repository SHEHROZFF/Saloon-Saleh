import { useState } from 'react';
import { Plus, Trash2, Send } from 'lucide-react';
import { useGetAllCoupons, useDeleteCoupon } from '../../hooks/queries/useOrders';
import AdminSlideOver from '../../components/admin/AdminSlideOver';
import CouponForm from '../../components/admin/forms/CouponForm';
import DistributeCouponForm from '../../components/admin/forms/DistributeCouponForm';

const AdminCoupons = () => {
    const { data, isLoading } = useGetAllCoupons();
    const { mutate: deleteCoupon } = useDeleteCoupon();
    const coupons = (data?.data as any)?.coupons || data?.data || [];

    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
    const [isDistributeOpen, setIsDistributeOpen] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState<any>(null);

    const handleAddClick = () => {
        setIsSlideOverOpen(true);
    };

    const handleDistributeClick = (coupon: any) => {
        setSelectedCoupon(coupon);
        setIsDistributeOpen(true);
    };



    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif text-salon-primary">Discount Coupons</h2>
                <button 
                    onClick={handleAddClick}
                    className="px-6 py-2.5 bg-salon-golden text-black text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-salon-golden-muted transition-colors rounded"
                >
                    <Plus className="w-4 h-4" /> Create Coupon
                </button>
            </div>
            
            <div className="bg-salon-surface/30 border border-salon-golden/10 rounded-lg p-6">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-salon-golden/20">
                            <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Code</th>
                            <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Discount</th>
                            <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Usage</th>
                            <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Status</th>
                            <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={5} className="text-center py-10">Loading coupons...</td></tr>
                        ) : coupons.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-10 text-salon-muted italic">No coupons found. Create seasonal discounts here.</td></tr>
                        ) : coupons.map((c: any) => (
                            <tr key={c.id} className="border-b border-salon-golden/5 hover:bg-salon-surface/50 transition-colors group">
                                <td className="py-4 text-sm font-medium text-salon-golden tracking-wider">{c.code}</td>
                                <td className="py-4 text-sm text-salon-primary">{c.discount_type === 'percentage' ? `${c.discount_value}%` : `$${c.discount_value}`}</td>
                                <td className="py-4 text-sm text-salon-muted">{c.usage_limit ? `${c.times_used}/${c.usage_limit}` : `${c.times_used}/Unlimited`}</td>
                                <td className="py-4 text-[10px] uppercase tracking-wider">{c.is_active ? 'Active' : 'Inactive'}</td>
                                <td className="py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleDistributeClick(c)}
                                            className="text-salon-muted hover:text-salon-golden p-1 transition-colors"
                                            title="Send via Email"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => confirm('Delete coupon permanently?') && deleteCoupon(c.id)} 
                                            className="text-salon-muted hover:text-red-500 p-1 transition-colors"
                                            title="Delete"
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

            <AdminSlideOver 
                isOpen={isSlideOverOpen} 
                onClose={() => setIsSlideOverOpen(false)}
                title="Create New Coupon"
            >
                <CouponForm onClose={() => setIsSlideOverOpen(false)} />
            </AdminSlideOver>

            <AdminSlideOver 
                isOpen={isDistributeOpen} 
                onClose={() => setIsDistributeOpen(false)}
                title="Distribute Coupon"
            >
                {selectedCoupon && (
                    <DistributeCouponForm 
                        coupon={selectedCoupon} 
                        onClose={() => setIsDistributeOpen(false)} 
                    />
                )}
            </AdminSlideOver>
        </div>
    );
};
export default AdminCoupons;
