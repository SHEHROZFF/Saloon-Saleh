import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Calendar, Loader2, Sparkles, Quote } from 'lucide-react';
import { useGetStaffMember } from '../hooks/queries/useStaff';
import { useGetStaffBlogs } from '../hooks/queries/useBlogs';
import Header from '../components/layout/Header';
import Footer from '../components/landing/Footer';
import Button from '../components/ui/Button';

const ExpertProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: staffData, isLoading: isStaffLoading } = useGetStaffMember(id || '');
    const { data: blogsData } = useGetStaffBlogs(id || '');

    const staff = staffData?.data?.staff;
    const blogs = blogsData?.data?.blogs || [];

    if (isStaffLoading) return (
        <div className="min-h-screen bg-salon-base flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-salon-golden" />
        </div>
    );

    if (!staff) return (
        <div className="min-h-screen bg-salon-base flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-3xl font-serif text-salon-primary mb-4">Expert Not Found</h2>
            <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
    );

    return (
        <div className="w-full min-h-screen bg-salon-base text-salon-primary">
            <Header />
            
            <main className="pt-32 pb-24">
                {/* Hero Profile Section */}
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="aspect-[4/5] overflow-hidden rounded-sm border border-salon-golden/20 shadow-2xl relative z-10">
                            <img 
                                src={staff.avatar_url || "https://images.unsplash.com/photo-1599351431202-1e0f0137899a"} 
                                alt={staff.name} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Decorative Elements */}
                        <div className="absolute -top-10 -left-10 w-40 h-40 border-l border-t border-salon-golden/30 -z-0"></div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 border-r border-b border-salon-golden/30 -z-0"></div>
                        
                        <div className="absolute bottom-8 -left-6 bg-black p-6 border border-salon-golden/20 z-20 hidden md:block">
                            <span className="text-salon-golden text-[10px] uppercase tracking-[0.3em] font-bold block mb-1">Experience</span>
                            <span className="text-2xl font-serif text-white">{staff.experience_years || 'Master'} Level</span>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-8"
                    >
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 text-salon-golden mb-2">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-[10px] uppercase tracking-[0.4em] font-bold">The Artisan</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-serif leading-tight">{staff.name}</h1>
                            <p className="text-xl text-salon-golden-muted font-light italic">{staff.role}</p>
                            
                            {/* Services Bar */}
                            {staff.services && staff.services.length > 0 && (
                                <div className="flex flex-wrap gap-3 pt-4">
                                    {staff.services.map((svc: any) => (
                                        <span
                                            key={svc.id}
                                            className="px-4 py-2 border border-salon-golden/20 bg-salon-base text-[10px] uppercase tracking-widest text-salon-golden font-medium rounded-sm shadow-sm"
                                        >
                                            {svc.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <Quote className="w-8 h-8 text-salon-golden/20 shrink-0" />
                                <p className="text-lg text-salon-muted leading-relaxed font-light">
                                    {staff.bio || `Specializing in ${staff.role}, ${staff.name} brings a unique artistic vision to Salon Saleh. With a focus on precision and personalized elegance, every ritual is crafted to perfection.`}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-4">
                                {staff.specialties?.map((spec: string, i: number) => (
                                    <span key={i} className="px-4 py-2 border border-salon-golden/10 bg-salon-golden/5 text-[10px] uppercase tracking-widest text-salon-golden">
                                        {spec}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-6 pt-8 border-t border-salon-golden/10">
                            <Button onClick={() => navigate('/booking')} variant="golden" className="px-10 h-14">
                                Book a Ritual
                            </Button>
                            <div className="flex gap-4">
                                {staff.instagram_url && (
                                    <a href={staff.instagram_url} target="_blank" rel="noreferrer" className="w-10 h-10 border border-salon-golden/20 rounded-full flex items-center justify-center text-salon-golden hover:bg-salon-golden hover:text-black transition-all">
                                        <Instagram className="w-4 h-4" />
                                    </a>
                                )}
                                {staff.linkedin_url && (
                                    <a href={staff.linkedin_url} target="_blank" rel="noreferrer" className="w-10 h-10 border border-salon-golden/20 rounded-full flex items-center justify-center text-salon-golden hover:bg-salon-golden hover:text-black transition-all">
                                        <Linkedin className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Insights Section (Blogs) */}
                {blogs.length > 0 && (
                    <section className="bg-salon-surface/30 py-24">
                        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                                <div className="space-y-4">
                                    <h2 className="text-4xl font-serif tracking-tight">Expert Insights</h2>
                                    <p className="text-salon-muted uppercase tracking-[0.2em] text-[10px] font-bold">Wisdom and Vision from {staff.name}</p>
                                </div>
                                <div className="h-px bg-salon-golden/20 flex-1 mx-12 hidden lg:block"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                                {blogs.map((blog, idx) => (
                                    <motion.div 
                                        key={blog.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        onClick={() => navigate(`/blogs/${blog.slug}`)}
                                        className="group cursor-pointer"
                                    >
                                        <div className="aspect-[16/9] overflow-hidden mb-6 relative">
                                            <img 
                                                src={blog.image_url || "https://images.unsplash.com/photo-1560066984-138dadb4c035"} 
                                                alt={blog.title} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.2em] text-salon-golden font-bold">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(blog.created_at).toLocaleDateString()}
                                            </div>
                                            <h3 className="text-2xl font-serif group-hover:text-salon-golden transition-colors">{blog.title}</h3>
                                            <p className="text-sm text-salon-muted line-clamp-2 font-light">{blog.excerpt || 'Discover the latest trends and techniques in elite salon rituals.'}</p>
                                            <div className="pt-2">
                                                <span className="text-[10px] uppercase tracking-widest text-salon-golden font-bold border-b border-salon-golden/20 pb-1 group-hover:border-salon-golden transition-all">Read Insight</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default ExpertProfilePage;
