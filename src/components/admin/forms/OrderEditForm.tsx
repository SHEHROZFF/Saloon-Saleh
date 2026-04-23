import React, { useState, useEffect } from 'react';
import { useUpdateOrder, useUpdateOrderStatus } from '../../../hooks/queries/useOrders';
import { orderService } from '../../../services/api/orderService';
import { CheckCircle, Loader2, User, MapPin, Clipboard } from 'lucide-react';
import { toast } from '../../ui/Toast';

interface OrderEditFormProps {
    orderId: string;
    onClose: () => void;
}

const OrderEditForm: React.FC<OrderEditFormProps> = ({ orderId, onClose }) => {
    const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateOrderStatus();
    const { mutate: updateDetails, isPending: isUpdatingDetails } = useUpdateOrder();
    
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<any>(null);
    const [formData, setFormData] = useState<any>({
        order_status: '',
        payment_status: '',
        order_notes: '',
        billing_address: {
            first_name: '',
            last_name: '',
            phone: '',
            email: '',
            street_address: '',
            apartment: '',
            city: '',
            postcode: '',
            country: ''
        },
        shipping_address: null
    });

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await orderService.getOrderDetails(orderId);
                const orderData = response.data.order;
                setOrder(orderData);
                setFormData({
                    order_status: orderData.order_status,
                    payment_status: orderData.payment_status,
                    order_notes: orderData.order_notes || '',
                    billing_address: {
                        first_name: orderData.billing_address?.first_name || '',
                        last_name: orderData.billing_address?.last_name || '',
                        phone: orderData.billing_address?.phone || '',
                        email: orderData.billing_address?.email || '',
                        street_address: orderData.billing_address?.street_address || '',
                        apartment: orderData.billing_address?.apartment || '',
                        city: orderData.billing_address?.city || '',
                        postcode: orderData.billing_address?.postcode || '',
                        country: orderData.billing_address?.country || ''
                    },
                    shipping_address: orderData.shipping_address ? {
                        first_name: orderData.shipping_address.first_name || '',
                        last_name: orderData.shipping_address.last_name || '',
                        street_address: orderData.shipping_address.street_address || '',
                        city: orderData.shipping_address.city || '',
                        postcode: orderData.shipping_address.postcode || ''
                    } : null
                });
            } catch (err) {
                console.error("Failed to fetch order", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // 1. Update Status first
        updateStatus({
            id: orderId,
            updates: {
                order_status: formData.order_status,
                payment_status: formData.payment_status
            }
        });

        // 2. Update Details
        updateDetails({
            id: orderId,
            data: {
                order_notes: formData.order_notes,
                billing_address: formData.billing_address,
                shipping_address: formData.shipping_address
            }
        }, {
            onSuccess: () => { toast.success('Order details updated successfully.'); onClose(); }
        });
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-salon-golden" /></div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-8 pb-10">
            {/* Order Header Summary */}
            <div className="p-4 bg-salon-surface/50 border border-salon-golden/20 rounded-md">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-salon-muted">Order Reference</span>
                    <span className="text-xs font-serif text-salon-golden">#{order?.order_number}</span>
                </div>
                <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase tracking-widest text-salon-muted">Placement Date</span>
                    <span className="text-xs text-salon-primary">{order?.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}</span>
                </div>
            </div>

            {/* Status Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-salon-golden border-b border-salon-golden/10 pb-2">
                    <CheckCircle className="w-4 h-4" />
                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold">Workflow Status</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-2">Order Status</label>
                        <select
                            value={formData.order_status}
                            onChange={(e) => setFormData((prev: any) => ({ ...prev, order_status: e.target.value }))}
                            className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
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
                            value={formData.payment_status}
                            onChange={(e) => setFormData((prev: any) => ({ ...prev, payment_status: e.target.value }))}
                            className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                        >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-salon-golden border-b border-salon-golden/10 pb-2">
                    <User className="w-4 h-4" />
                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold">Customer Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">First Name</label>
                        <input
                            type="text"
                            value={formData.billing_address.first_name}
                            onChange={(e) => setFormData((prev: any) => ({
                                ...prev,
                                billing_address: { ...prev.billing_address, first_name: e.target.value }
                            }))}
                            className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Last Name</label>
                        <input
                            type="text"
                            value={formData.billing_address.last_name}
                            onChange={(e) => setFormData((prev: any) => ({
                                ...prev,
                                billing_address: { ...prev.billing_address, last_name: e.target.value }
                            }))}
                            className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Email</label>
                    <input
                        type="email"
                        value={formData.billing_address.email}
                        onChange={(e) => setFormData((prev: any) => ({
                            ...prev,
                            billing_address: { ...prev.billing_address, email: e.target.value }
                        }))}
                        className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Phone</label>
                    <input
                        type="text"
                        value={formData.billing_address.phone}
                        onChange={(e) => setFormData((prev: any) => ({
                            ...prev,
                            billing_address: { ...prev.billing_address, phone: e.target.value }
                        }))}
                        className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                    />
                </div>
            </div>

            {/* Address Details */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-salon-golden border-b border-salon-golden/10 pb-2">
                    <MapPin className="w-4 h-4" />
                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold">Shipping Address</h3>
                </div>
                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Street Address</label>
                    <input
                        type="text"
                        value={formData.billing_address.street_address}
                        onChange={(e) => setFormData((prev: any) => ({
                            ...prev,
                            billing_address: { ...prev.billing_address, street_address: e.target.value }
                        }))}
                        className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Apartment, suite, etc. (optional)</label>
                    <input
                        type="text"
                        value={formData.billing_address.apartment}
                        onChange={(e) => setFormData((prev: any) => ({
                            ...prev,
                            billing_address: { ...prev.billing_address, apartment: e.target.value }
                        }))}
                        className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">City</label>
                        <input
                            type="text"
                            value={formData.billing_address.city}
                            onChange={(e) => setFormData((prev: any) => ({
                                ...prev,
                                billing_address: { ...prev.billing_address, city: e.target.value }
                            }))}
                            className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Postcode</label>
                        <input
                            type="text"
                            value={formData.billing_address.postcode}
                            onChange={(e) => setFormData((prev: any) => ({
                                ...prev,
                                billing_address: { ...prev.billing_address, postcode: e.target.value }
                            }))}
                            className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* Shipping Address (Conditional) */}
            {formData.shipping_address && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-salon-golden border-b border-salon-golden/10 pb-2">
                        <MapPin className="w-4 h-4" />
                        <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold">Specific Shipping Address</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">First Name</label>
                            <input
                                type="text"
                                value={formData.shipping_address.first_name}
                                onChange={(e) => setFormData((prev: any) => ({
                                    ...prev,
                                    shipping_address: { ...prev.shipping_address, first_name: e.target.value }
                                }))}
                                className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Last Name</label>
                            <input
                                type="text"
                                value={formData.shipping_address.last_name}
                                onChange={(e) => setFormData((prev: any) => ({
                                    ...prev,
                                    shipping_address: { ...prev.shipping_address, last_name: e.target.value }
                                }))}
                                className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Street Address</label>
                        <input
                            type="text"
                            value={formData.shipping_address.street_address}
                            onChange={(e) => setFormData((prev: any) => ({
                                ...prev,
                                shipping_address: { ...prev.shipping_address, street_address: e.target.value }
                            }))}
                            className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">City</label>
                            <input
                                type="text"
                                value={formData.shipping_address.city}
                                onChange={(e) => setFormData((prev: any) => ({
                                    ...prev,
                                    shipping_address: { ...prev.shipping_address, city: e.target.value }
                                }))}
                                className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1">Postcode</label>
                            <input
                                type="text"
                                value={formData.shipping_address.postcode}
                                onChange={(e) => setFormData((prev: any) => ({
                                    ...prev,
                                    shipping_address: { ...prev.shipping_address, postcode: e.target.value }
                                }))}
                                className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Order Items Summary */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-salon-golden border-b border-salon-golden/10 pb-2">
                    <Clipboard className="w-4 h-4" />
                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold">Ordered Rituals</h3>
                </div>
                <div className="bg-salon-surface/30 border border-salon-golden/10 rounded-md overflow-hidden">
                    <table className="w-full text-left text-[11px]">
                        <thead className="bg-salon-golden/5 border-b border-salon-golden/10">
                            <tr>
                                <th className="px-4 py-2 uppercase tracking-widest font-normal text-salon-muted">Item</th>
                                <th className="px-4 py-2 uppercase tracking-widest font-normal text-salon-muted text-center">Qty</th>
                                <th className="px-4 py-2 uppercase tracking-widest font-normal text-salon-muted text-right">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order?.items?.map((item: any, idx: number) => (
                                <tr key={idx} className="border-b border-salon-golden/5">
                                    <td className="px-4 py-3 text-salon-primary font-medium">{item.product_title}</td>
                                    <td className="px-4 py-3 text-salon-muted text-center">{item.quantity}</td>
                                    <td className="px-4 py-3 text-salon-golden text-right font-serif">${parseFloat(item.price_at_purchase).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-salon-golden/5 font-bold">
                            <tr>
                                <td colSpan={2} className="px-4 py-2 text-salon-muted uppercase tracking-widest text-[9px]">Subtotal</td>
                                <td className="px-4 py-2 text-right font-serif">${parseFloat(order?.subtotal || 0).toFixed(2)}</td>
                            </tr>
                            {parseFloat(order?.discount_amount) > 0 && (
                                <tr>
                                    <td colSpan={2} className="px-4 py-2 text-red-400 uppercase tracking-widest text-[9px]">Discount</td>
                                    <td className="px-4 py-2 text-right font-serif text-red-400">-${parseFloat(order?.discount_amount).toFixed(2)}</td>
                                </tr>
                            )}
                            <tr>
                                <td colSpan={2} className="px-4 py-2 text-salon-golden uppercase tracking-widest text-[9px]">Total Ritual Value</td>
                                <td className="px-4 py-2 text-right font-serif text-salon-golden text-lg">${parseFloat(order?.total || 0).toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Order Notes */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-salon-golden border-b border-salon-golden/10 pb-2">
                    <Clipboard className="w-4 h-4" />
                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold">Admin Notes</h3>
                </div>
                <textarea
                    value={formData.order_notes}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, order_notes: e.target.value }))}
                    rows={4}
                    className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-salon-golden transition-colors resize-none"
                    placeholder="Enter private notes about this order..."
                />
            </div>

            <div className="flex gap-4 pt-6 border-t border-salon-golden/10 sticky bottom-0 bg-salon-base pb-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 text-sm font-semibold tracking-wider uppercase text-salon-muted hover:text-salon-primary transition-colors bg-salon-surface/50 border border-salon-golden/10 rounded-md"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isUpdatingStatus || isUpdatingDetails}
                    className="flex-1 py-3 text-sm font-bold tracking-wider uppercase text-black bg-salon-golden hover:bg-salon-golden-muted transition-colors rounded-md disabled:opacity-50 flex justify-center items-center gap-2"
                >
                    {(isUpdatingStatus || isUpdatingDetails) ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Save All Changes
                </button>
            </div>
        </form>
    );
};

export default OrderEditForm;
