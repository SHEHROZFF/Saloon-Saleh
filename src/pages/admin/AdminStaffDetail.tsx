import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Calendar, DollarSign, Loader2,
    Star, UserCheck, TrendingUp,
    Shield, Mail, Phone, Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useGetStaffDetailReport } from '../../hooks/queries/useReports';

const AdminStaffDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const timeframe = '30d'; // Could be made dynamic later

    const { data: detailData, isLoading, isError } = useGetStaffDetailReport(id || null, timeframe);
    const report = detailData?.data;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-salon-golden" />
                <p className="text-[10px] uppercase tracking-[0.4em] text-salon-muted animate-pulse font-bold">Initializing Staff Intelligence...</p>
            </div>
        );
    }

    if (isError || !report) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <Shield className="w-16 h-16 text-red-500/20 mb-6" />
                <h3 className="text-2xl font-serif text-salon-primary mb-2">Access Error</h3>
                <p className="text-salon-muted mb-8 max-w-md">The staff intelligence data could not be retrieved. Please verify the ID or try again later.</p>
                <button onClick={() => navigate('/admin/reports')} className="px-8 py-3 bg-salon-golden text-black text-xs font-bold uppercase tracking-widest rounded transition-all hover:bg-salon-golden-muted">
                    Return to Analytics
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            {/* Navigation Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <button
                        onClick={() => navigate('/admin/reports')}
                        className="flex items-center gap-2 text-xs text-salon-muted hover:text-salon-primary mb-4 transition-colors uppercase tracking-widest font-semibold group"
                    >
                        <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" /> Back to Staff Reports
                    </button>
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-salon-golden/10 border border-salon-golden/20 flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(197,160,89,0.1)]">
                            {report.summary.avatar_url ? (
                                <img src={report.summary.avatar_url} alt={report.summary.name} className="w-full h-full object-cover" />
                            ) : (
                                <UserCheck className="w-10 h-10 text-salon-golden" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-4xl font-serif text-salon-primary">{report.summary.name}</h2>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-salon-golden uppercase tracking-[0.2em] font-bold">{report.summary.role}</span>
                                <span className="text-salon-golden/30 text-lg">•</span>
                                <span className="text-xs text-salon-muted uppercase tracking-widest">Expert ID: {id?.substring(0, 8)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="px-6 py-3 bg-salon-surface/50 border border-salon-golden/10 rounded-lg text-center backdrop-blur-sm">
                        <p className="text-[10px] uppercase tracking-widest text-salon-muted mb-1 font-bold">Retention Score</p>
                        <p className="text-xl font-serif text-salon-golden">
                            {(() => {
                                const total = Number(report.summary.total_bookings) + Number(report.summary.cancellations);
                                if (total === 0) return '100';
                                return (100 - (Number(report.summary.cancellations) / total * 100)).toFixed(0);
                            })()}%
                        </p>
                    </div>
                </div>
            </div>

            {/* Top KPI Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    label="Gross Revenue"
                    value={`$${Number(report.summary.revenue || 0).toLocaleString()}`}
                    icon={<DollarSign className="w-5 h-5" />}
                    trend="Productivity"
                    highlight
                />
                <MetricCard
                    label="Confirmed Rituals"
                    value={report.summary.total_bookings}
                    icon={<Calendar className="w-5 h-5" />}
                    trend="Booking Volume"
                />
                <MetricCard
                    label="Avg. Session Value"
                    value={`$${Number(report.summary.avg_booking_value || 0).toFixed(2)}`}
                    icon={<TrendingUp className="w-5 h-5" />}
                    trend="Upsell Performance"
                />
                <MetricCard
                    label="No-Show Frequency"
                    value={report.summary.no_shows}
                    icon={<Star className="w-5 h-5" />}
                    trend="Reliability"
                    alert={report.summary.no_shows > 5}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Ritual Ledger (Main) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-salon-surface/30 border border-salon-golden/10 rounded-2xl p-8 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-serif text-salon-primary">Ritual Ledger</h3>
                                <p className="text-xs text-salon-muted uppercase tracking-widest mt-1">Chronological history of professional engagements.</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-salon-golden/10 text-salon-muted">
                                        <th className="pb-4 font-bold uppercase tracking-widest text-[10px]">Client Intelligence</th>
                                        <th className="pb-4 font-bold uppercase tracking-widest text-[10px]">Schedule</th>
                                        <th className="pb-4 font-bold uppercase tracking-widest text-[10px]">Engagements</th>
                                        <th className="pb-4 font-bold uppercase tracking-widest text-[10px] text-right">Revenue</th>
                                        <th className="pb-4 font-bold uppercase tracking-widest text-[10px] text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-salon-golden/5">
                                    {report.bookings.length > 0 ? report.bookings.map((b) => (
                                        <tr key={b.id} className="hover:bg-salon-golden/[0.03] transition-colors group">
                                            <td className="py-5 font-medium">
                                                <div className="text-salon-primary text-sm font-serif">{b.first_name} {b.last_name}</div>
                                                <div className="text-[9px] text-salon-muted uppercase tracking-tighter">Verified Client</div>
                                            </td>
                                            <td className="py-5">
                                                <div className="text-salon-primary">{new Date(b.booking_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                                <div className="text-[10px] text-salon-muted font-bold">{b.time_label}</div>
                                            </td>
                                            <td className="py-5">
                                                <div className="text-salon-muted text-[10px] max-w-[200px] truncate" title={b.services}>
                                                    {b.services}
                                                </div>
                                            </td>
                                            <td className="py-5 text-right font-serif text-salon-golden text-sm font-bold">
                                                ${Number(b.total_price).toFixed(2)}
                                            </td>
                                            <td className="py-5 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${b.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                                        b.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                                                            'bg-salon-golden/10 text-salon-golden'
                                                    }`}>
                                                    {b.status}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={5} className="py-20 text-center text-salon-muted italic">No ritual data available for this professional.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Performance Analytics (Sidebar) */}
                <div className="space-y-8">
                    {/* Ritual Mix */}
                    <div className="bg-salon-surface/30 border border-salon-golden/10 rounded-2xl p-8 backdrop-blur-sm">
                        <h4 className="text-[11px] uppercase tracking-[0.3em] text-salon-golden font-bold mb-8">Ritual Mix Analytics</h4>
                        <div className="space-y-6">
                            {report.services.map((s, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between text-[11px] uppercase tracking-widest font-bold">
                                        <span className="text-salon-primary">{s.name}</span>
                                        <span className="text-salon-muted">{s.count} Engagements</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 h-2 bg-salon-base rounded-full overflow-hidden border border-salon-golden/5">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(s.revenue / Number(report.summary.revenue || 1)) * 100}%` }}
                                                className="h-full bg-gradient-to-r from-salon-golden to-salon-golden-muted"
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-salon-golden min-w-[50px] font-serif">${Number(s.revenue).toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact & Administrative */}
                    <div className="bg-salon-surface/30 border border-salon-golden/10 rounded-2xl p-8 backdrop-blur-sm">
                        <h4 className="text-[11px] uppercase tracking-[0.3em] text-salon-golden font-bold mb-8">Administrative Profile</h4>
                        <div className="space-y-6">
                            <InfoRow icon={<Mail className="w-4 h-4" />} label="Email Address" value={report.summary.email || 'None'} />
                            <InfoRow icon={<Phone className="w-4 h-4" />} label="Direct Line" value={report.summary.phone || 'None'} />
                            <InfoRow icon={<Briefcase className="w-4 h-4" />} label="Position Role" value={report.summary.role} />

                            <div className="pt-6 border-t border-salon-golden/10 mt-6 grid grid-cols-2 gap-4 text-center">
                                <div className="p-3 rounded-lg bg-salon-base/40 border border-salon-golden/5">
                                    <p className="text-[9px] uppercase tracking-widest text-salon-muted mb-1">Cancellations</p>
                                    <p className="text-xl font-serif text-salon-primary">{report.summary.cancellations}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-salon-base/40 border border-salon-golden/5">
                                    <p className="text-[9px] uppercase tracking-widest text-salon-muted mb-1">No-Shows</p>
                                    <p className="text-xl font-serif text-salon-primary">{report.summary.no_shows}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ label, value, icon, trend, highlight = false, alert = false }: any) => (
    <div className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${highlight
            ? 'bg-salon-golden/10 border-salon-golden/40 shadow-[0_0_30px_rgba(197,160,89,0.15)]'
            : 'bg-salon-surface/40 border-salon-golden/10 hover:border-salon-golden/30'
        }`}>
        <div className="flex justify-between items-start mb-6">
            <div className={`p-3 rounded-xl ${highlight ? 'bg-salon-golden text-black' : 'bg-salon-golden/10 text-salon-golden'}`}>
                {icon}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${alert ? 'text-red-500 animate-pulse' : 'text-salon-muted'}`}>
                {trend}
            </span>
        </div>
        <div className={`text-3xl font-serif mb-2 ${highlight ? 'text-salon-primary' : 'text-salon-primary'}`}>{value}</div>
        <p className="text-[10px] uppercase tracking-widest text-salon-muted font-bold">{label}</p>
    </div>
);

const InfoRow = ({ icon, label, value }: any) => (
    <div className="flex items-center gap-4 group">
        <div className="text-salon-golden/40 group-hover:text-salon-golden transition-colors">
            {icon}
        </div>
        <div>
            <p className="text-[9px] uppercase tracking-widest text-salon-muted">{label}</p>
            <p className="text-sm text-salon-primary font-medium">{value}</p>
        </div>
    </div>
);

export default AdminStaffDetail;
