import { useState } from 'react';
import { Search, Eye, Edit } from 'lucide-react';

import { useGetAllOrders } from '../../hooks/queries/useOrders';

const AdminOrders = () => {
    const [search, setSearch] = useState('');
    const { data, isLoading } = useGetAllOrders();
    const orders = data?.data?.orders || [];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-serif text-salon-primary">Orders Management</h2>
                    <p className="text-xs text-salon-muted mt-1">Manage e-commerce product orders.</p>
                </div>
            </div>

            <div className="bg-salon-surface/50 border border-salon-golden/10 p-4 rounded-lg flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-salon-muted" />
                    <input 
                        type="text" 
                        placeholder="Search orders..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-salon-base border border-salon-golden/20 rounded pl-10 pr-4 py-2.5 text-sm text-salon-primary placeholder-salon-muted focus:outline-none focus:border-salon-golden transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    <select className="bg-salon-base border border-salon-golden/20 rounded px-4 py-2.5 text-sm text-salon-primary focus:outline-none focus:border-salon-golden appearance-none cursor-pointer">
                        <option value="">All Statuses</option>
                        <option value="pending">Processing</option>
                        <option value="shipped">Shipped</option>
                    </select>
                </div>
            </div>

            <div className="bg-salon-surface/30 border border-salon-golden/10 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-salon-base border-b border-salon-golden/20">
                                <th className="p-4 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Order ID</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Customer</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Date</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Total</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Payment</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Status</th>
                                <th className="p-4 text-[10px] uppercase tracking-widest text-salon-muted font-normal text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={7} className="text-center py-10">Loading orders...</td></tr>
                            ) : orders.map((order: any) => (
                                <tr key={order.id} className="border-b border-salon-golden/5 hover:bg-salon-surface/50 transition-colors group">
                                    <td className="p-4 text-xs font-serif text-salon-golden">{order.id.substring(0, 8).toUpperCase()}</td>
                                    <td className="p-4">
                                        <div className="text-sm font-medium text-salon-primary">{order.billing_address?.firstName} {order.billing_address?.lastName || 'N/A'}</div>
                                    </td>
                                    <td className="p-4 text-sm font-medium text-salon-primary">{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td className="p-4 text-sm font-serif text-salon-primary">${typeof order.total === 'string' ? parseFloat(order.total).toFixed(2) : order.total}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-sm font-semibold inline-block
                                            ${order.payment_status === 'paid' ? 'bg-green-500/10 text-green-500' : ''}
                                            ${order.payment_status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : ''}
                                            ${order.payment_status === 'failed' ? 'bg-red-500/10 text-red-500' : ''}
                                        `}>
                                            {order.payment_status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-sm font-semibold inline-block
                                            ${order.order_status === 'delivered' ? 'bg-salon-golden/10 text-salon-golden' : ''}
                                            ${order.order_status === 'shipped' ? 'bg-blue-500/10 text-blue-500' : ''}
                                            ${order.order_status === 'processing' || order.order_status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : ''}
                                            ${order.order_status === 'cancelled' ? 'bg-salon-muted/10 text-salon-muted' : ''}
                                        `}>
                                            {order.order_status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 text-salon-muted hover:text-salon-golden transition-colors"><Eye className="w-4 h-4" /></button>
                                            <button className="p-1.5 text-salon-muted hover:text-salon-primary transition-colors"><Edit className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
