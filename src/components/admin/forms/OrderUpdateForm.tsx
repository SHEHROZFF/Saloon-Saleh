import React, { useState } from 'react';
import { useUpdateOrderStatus } from '../../../hooks/queries/useOrders';
import { CheckCircle, Loader2 } from 'lucide-react';

interface OrderUpdateFormProps {
    order: any;
    onClose: () => void;
}

const OrderUpdateForm: React.FC<OrderUpdateFormProps> = ({ order, onClose }) => {
    const { mutate: updateStatus, isPending } = useUpdateOrderStatus();
    const [orderStatus, setOrderStatus] = useState(order.order_status);
    const [paymentStatus, setPaymentStatus] = useState(order.payment_status);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateStatus(
            { 
                id: order.id, 
                updates: { order_status: orderStatus, payment_status: paymentStatus } 
            },
            {
                onSuccess: () => onClose()
            }
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 bg-salon-surface/50 border border-salon-golden/20 rounded-md">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-salon-muted">Order ID</span>
                    <span className="text-xs font-serif text-salon-golden">#{order.order_number}</span>
                </div>
                <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase tracking-widest text-salon-muted">Customer</span>
                    <span className="text-xs text-salon-primary">{order.first_name} {order.last_name}</span>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-2">Order Status</label>
                    <select
                        value={orderStatus}
                        onChange={(e) => setOrderStatus(e.target.value)}
                        className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                    >
                        <option value="awaiting">Awaiting</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-2">Payment Status</label>
                    <select
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                        className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                    >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                    </select>
                </div>
            </div>

            <div className="p-4 bg-salon-golden/5 border border-salon-golden/10 rounded-md">
                <p className="text-[9px] text-salon-muted uppercase leading-relaxed">
                    Note: Updating the order or payment status will automatically trigger an email notification to the customer.
                </p>
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
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    {isPending ? 'Updating...' : 'Update Status'}
                </button>
            </div>
        </form>
    );
};

export default OrderUpdateForm;
