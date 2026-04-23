import React, { useState } from 'react';
import { useCreateCoupon } from '../../../hooks/queries/useOrders';
import { toast } from '../../ui/Toast';

interface CouponFormProps {
    onClose: () => void;
}

const CouponForm: React.FC<CouponFormProps> = ({ onClose }) => {
    const { mutate: createCoupon, isPending: isCreating } = useCreateCoupon();

    const [formData, setFormData] = useState({
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        min_order_amount: '0',
        usage_limit: '',
        valid_until: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload = {
            ...formData,
            discount_value: parseFloat(formData.discount_value),
            min_order_amount: parseFloat(formData.min_order_amount) || 0,
            usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
            valid_until: formData.valid_until ? new Date(formData.valid_until).toISOString() : null
        };

        createCoupon(payload, {
            onSuccess: () => { toast.success('Coupon created successfully.'); onClose(); }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 text-salon-primary">
                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Coupon Code</label>
                    <input
                        required
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors uppercase font-mono tracking-wider"
                        placeholder="e.g. SUMMER20"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Discount Type</label>
                        <select
                            required
                            value={formData.discount_type}
                            onChange={(e) => setFormData(prev => ({ ...prev, discount_type: e.target.value }))}
                            className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                        >
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed">Fixed Amount ($)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Discount Value</label>
                        <input
                            required
                            type="number"
                            min="0"
                            step={formData.discount_type === 'percentage' ? "1" : "0.01"}
                            max={formData.discount_type === 'percentage' ? "100" : undefined}
                            value={formData.discount_value}
                            onChange={(e) => setFormData(prev => ({ ...prev, discount_value: e.target.value }))}
                            className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                            placeholder={formData.discount_type === 'percentage' ? "20" : "50.00"}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Min Order Amount (Opt.)</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.min_order_amount}
                            onChange={(e) => setFormData(prev => ({ ...prev, min_order_amount: e.target.value }))}
                            className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Usage Limit (Opt.)</label>
                        <input
                            type="number"
                            min="1"
                            value={formData.usage_limit}
                            onChange={(e) => setFormData(prev => ({ ...prev, usage_limit: e.target.value }))}
                            className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                            placeholder="Unlimited"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Expiry Date (Opt.)</label>
                    <input
                        type="date"
                        value={formData.valid_until}
                        onChange={(e) => setFormData(prev => ({ ...prev, valid_until: e.target.value }))}
                        className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors [color-scheme:dark]"
                    />
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
                    disabled={isCreating}
                    className="flex-1 py-3 text-sm font-bold tracking-wider uppercase text-black bg-salon-golden hover:bg-salon-golden-muted transition-colors rounded-md disabled:opacity-50 flex justify-center items-center gap-2"
                >
                    {isCreating ? 'Creating...' : 'Create Coupon'}
                </button>
            </div>
        </form>
    );
};

export default CouponForm;
