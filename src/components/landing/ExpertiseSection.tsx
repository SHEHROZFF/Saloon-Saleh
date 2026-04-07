import { motion } from 'framer-motion';
import Button from '../ui/Button';
import SectionHeader from '../ui/SectionHeader';
import { useGetStaff } from '../../hooks/queries/useStaff';
import { useGetBootstrapSettings } from '../../hooks/queries/useSettings';

interface StaffService {
    id: string;
    name: string;
}

interface StaffMember {
    id: string;
    name: string;
    role: string;
    avatar_url: string;
    services: StaffService[];
}

const ExpertiseSection = () => {
    const { data: staffData } = useGetStaff();
    const { data: bootstrapData } = useGetBootstrapSettings();

    const liveStaff: StaffMember[] = (staffData?.data as any)?.staff || staffData?.data || [];
    const settings = bootstrapData?.data?.expertise_section || {
        title: "Our",
        italicTitle: "Expertise",
        description: "Meticulously crafted styles across all disciplines."
    };

    // Fallback if no staff exist
    const displayStaff: StaffMember[] = liveStaff.length > 0 ? liveStaff : [
        { id: '1', name: "Master Barber", role: "Precision Cuts", avatar_url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1474&q=80", services: [] },
    ];

    return (
        <section id="expertise" className="py-16 md:py-24 w-full bg-salon-base relative z-10 border-t border-salon-surface">
            <div className="w-full max-w-[1400px] mx-auto px-8 md:px-16">

                <SectionHeader
                    title={settings.title}
                    italicTitle={settings.italicTitle}
                    description={settings.description}
                    layout="side"
                    stackTitle={true}
                    border={false}
                    className="mb-8"
                />

                <div className="flex flex-col gap-0 border-t border-salon-surface relative">
                    {displayStaff.map((item, idx) => (
                        <motion.a
                            href="/booking"
                            key={item.id || idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="group flex items-center justify-between py-6 border-b border-salon-surface hover:bg-salon-surface/50 transition-all duration-500 cursor-pointer px-4 -mx-4 no-underline"
                        >
                            <div className="flex items-center gap-6 md:gap-10 min-w-0">
                                <span className="text-salon-golden-muted text-[10px] font-light font-serif tracking-widest shrink-0">0{idx + 1}</span>
                                <div className="min-w-0">
                                    <h3 className="text-2xl md:text-3xl font-serif text-salon-primary group-hover:translate-x-3 transition-transform duration-700">
                                        {item.name}
                                    </h3>
                                    <span className="text-sm text-salon-primary/50 block mt-1">{item.role}</span>
                                    {/* Staff Services Tags */}
                                    {item.services && item.services.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {item.services.map((svc) => (
                                                <span
                                                    key={svc.id}
                                                    className="text-[9px] uppercase tracking-widest text-salon-golden border border-salon-golden/20 bg-salon-golden/5 px-2.5 py-1 rounded-sm font-medium"
                                                >
                                                    {svc.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-8 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-x-5 group-hover:translate-x-0 shrink-0">
                                <div className="hidden lg:block w-40 h-20 overflow-hidden rounded-sm grayscale group-hover:grayscale-0 transition-all duration-1000 border border-salon-golden/10">
                                    <img src={item.avatar_url || "https://images.unsplash.com/photo-1599351431202-1e0f0137899a"} alt={item.name} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[2000ms]" />
                                </div>
                                <div className="flex items-center gap-2 group/btn">
                                    <span className="text-[10px] uppercase tracking-widest text-salon-golden translate-x-3 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">Book</span>
                                    <svg className="w-5 h-5 text-salon-golden transition-transform duration-500 group-hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                    </svg>
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </div>

                <div className="mt-12 flex justify-end">
                    <Button as="a" href="/booking" variant="link" className="text-salon-golden group flex items-center gap-3 font-medium">
                        View Full Menu
                        <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default ExpertiseSection;
