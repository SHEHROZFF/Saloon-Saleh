import { useGetWaitlist, useUpdateWaitlistStatus } from '../../hooks/queries/useWaitlist';
import { Phone } from 'lucide-react';

const AdminWaitlist = () => {
    const { data, isLoading } = useGetWaitlist();
    const { mutate: updateStatus } = useUpdateWaitlistStatus();
    const list = data?.data?.waitlist || [];

    return (
        <div className="space-y-6 animate-in fade-in">
            <div>
                <h2 className="text-2xl font-serif text-salon-primary">Waitlist Leads</h2>
                <p className="text-xs text-salon-muted mt-1">Inquiries submitted from the hero section of the landing page.</p>
            </div>
            
            <div className="bg-salon-surface/30 border border-salon-golden/10 rounded-lg p-6">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-salon-golden/20">
                            <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Lead Name</th>
                            <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Contact</th>
                            <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Desired Service</th>
                            <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Submitted On</th>
                            <th className="pb-3 text-[10px] uppercase tracking-widest text-salon-muted font-normal">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={5} className="text-center py-10">Loading leads...</td></tr>
                        ) : list.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-10 text-salon-muted italic">There are no waitlist entries yet.</td></tr>
                        ) : list.map((l: any) => (
                            <tr key={l.id} className="border-b border-salon-golden/5 hover:bg-salon-surface/50 transition-colors group">
                                <td className="py-4 text-sm font-medium text-salon-primary">{l.full_name}</td>
                                <td className="py-4 text-sm text-salon-muted flex items-center gap-2">
                                    <Phone className="w-3 h-3 text-salon-golden" /> {l.phone}
                                </td>
                                <td className="py-4 text-sm text-salon-primary">{l.desired_service}</td>
                                <td className="py-4 text-sm text-salon-muted">{new Date(l.created_at).toLocaleDateString()}</td>
                                <td className="py-4 text-right">
                                    <select 
                                        value={l.status} 
                                        onChange={(e) => updateStatus({ id: l.id, status: e.target.value })}
                                        className="bg-salon-base border border-salon-golden/20 rounded px-2 py-1 text-[10px] uppercase text-salon-primary focus:outline-none"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="contacted">Contacted</option>
                                        <option value="booked">Booked</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default AdminWaitlist;
