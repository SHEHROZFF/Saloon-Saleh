import React, { useState } from 'react';
import { useDistributeCoupon } from '../../../hooks/queries/useOrders';
import { Send, Loader2 } from 'lucide-react';

interface DistributeCouponFormProps {
    coupon: any;
    onClose: () => void;
}

const DistributeCouponForm: React.FC<DistributeCouponFormProps> = ({ coupon, onClose }) => {
    const { mutate: distribute, isPending } = useDistributeCoupon();
    const [emails, setEmails] = useState('');
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const emailList = emails.split(',').map(e => e.trim()).filter(e => e.length > 5);
        
        if (emailList.length === 0) {
            setStatus({ type: 'error', message: 'Please enter at least one valid email address.' });
            return;
        }

        distribute({ coupon_id: coupon.id, emails: emailList }, {
            onSuccess: () => {
                setStatus({ type: 'success', message: `Coupon ${coupon.code} successfully distributed to ${emailList.length} recipients.` });
                setEmails('');
                setTimeout(() => onClose(), 3000);
            },
            onError: (err: any) => {
                setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to distribute coupon.' });
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 bg-salon-golden/5 border border-salon-golden/20 rounded-md">
                <p className="text-[10px] uppercase tracking-widest text-salon-golden mb-1">Coupon Details</p>
                <h4 className="text-lg font-serif text-salon-primary uppercase">{coupon.code}</h4>
                <p className="text-xs text-salon-muted">
                    {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% Discount` : `$${coupon.discount_value} Off`}
                </p>
            </div>

            <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-salon-muted">Recipient Emails</label>
                <textarea
                    required
                    value={emails}
                    onChange={(e) => setEmails(e.target.value)}
                    rows={6}
                    className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-salon-golden transition-colors resize-none placeholder:text-salon-muted/50"
                    placeholder="Enter emails separated by commas (e.g. customer1@gmail.com, customer2@gmail.com)"
                />
                <p className="text-[9px] text-salon-muted uppercase tracking-wider italic">
                    Tip: You can copy-paste a list of emails separated by commas.
                </p>
            </div>

            {status && (
                <div className={`p-3 rounded text-xs font-sans tracking-wide border ${
                    status.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-500' : 'bg-red-500/10 border-red-500/50 text-red-500'
                }`}>
                    {status.message}
                </div>
            )}

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
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {isPending ? 'Sending...' : 'Send Coupon'}
                </button>
            </div>
        </form>
    );
};

export default DistributeCouponForm;
