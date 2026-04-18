import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Loader2, Sparkles, Search } from 'lucide-react';
import { useGetBlogs } from '../hooks/queries/useBlogs';
import Header from '../components/layout/Header';
import Footer from '../components/landing/Footer';

const BlogListPage = () => {
    const navigate = useNavigate();
    const { data: blogsData, isLoading } = useGetBlogs();
    const blogs = blogsData?.data?.blogs || [];

    if (isLoading) return (
        <div className="min-h-screen bg-salon-base flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-salon-golden" />
        </div>
    );

    return (
        <div className="w-full min-h-screen bg-salon-base text-salon-primary">
            <Header />
            
            <main className="pt-40 pb-24">
                {/* Hero Header */}
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-center gap-3 text-salon-golden mb-2">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-[10px] uppercase tracking-[0.4em] font-bold">The Artisan's Library</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-serif leading-tight">Expert Insights</h1>
                        <p className="text-salon-muted uppercase tracking-[0.2em] text-xs font-bold max-w-2xl mx-auto">
                            Wisdom, Vision, and Industry Secrets from the Masters at Salon Saleh.
                        </p>
                    </motion.div>
                </div>

                {/* Blog Grid */}
                <section className="max-w-[1400px] mx-auto px-6 md:px-12">
                    {blogs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                            {blogs.map((blog, idx) => (
                                <motion.div 
                                    key={blog.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    onClick={() => navigate(`/blogs/${blog.slug}`)}
                                    className="group cursor-pointer"
                                >
                                    <div className="aspect-[4/3] overflow-hidden mb-8 relative border border-salon-golden/10 shadow-xl">
                                        <img 
                                            src={blog.image_url || "https://images.unsplash.com/photo-1560066984-138dadb4c035"} 
                                            alt={blog.title} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                                        />
                                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/0 transition-all duration-700"></div>
                                        
                                        <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10">
                                            <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md p-4 border border-salon-golden/20">
                                                <div className="w-8 h-8 rounded-full overflow-hidden border border-salon-golden/30">
                                                    <img src={blog.staff_avatar || "https://images.unsplash.com/photo-1599351431202-1e0f0137899a"} alt={blog.staff_name} className="w-full h-full object-cover" />
                                                </div>
                                                <span className="text-[10px] uppercase tracking-widest text-salon-golden font-bold">Written by {blog.staff_name}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 text-[9px] uppercase tracking-[0.2em] text-salon-golden font-bold">
                                            <span className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {new Date(blog.created_at).toLocaleDateString()}</span>
                                            <span className="w-1 h-1 rounded-full bg-salon-golden/30"></span>
                                            <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> 5 Min Read</span>
                                        </div>
                                        
                                        <h3 className="text-2xl font-serif group-hover:text-salon-golden transition-colors leading-snug">{blog.title}</h3>
                                        
                                        <p className="text-sm text-salon-muted line-clamp-2 font-light leading-relaxed">
                                            {blog.excerpt || 'Discover the latest trends and techniques in elite salon rituals as shared by our master artisans.'}
                                        </p>
                                        
                                        <div className="pt-4">
                                            <button className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-salon-golden font-bold group-hover:gap-5 transition-all">
                                                Read Article <ArrowRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-40 text-center border border-salon-golden/10 bg-salon-surface/30">
                            <Search className="w-12 h-12 text-salon-golden/20 mx-auto mb-6" />
                            <h3 className="text-2xl font-serif mb-2">The library is being curated</h3>
                            <p className="text-salon-muted uppercase tracking-widest text-[10px]">New expert insights arriving soon.</p>
                        </div>
                    )}
                </section>

                {/* Featured Expert Highlight */}
                <section className="mt-40 bg-salon-surface/50 py-32 border-y border-salon-golden/5">
                    <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-20">
                        <div className="flex-1 space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-6xl font-serif leading-tight italic">Learn from the <br/> Finest Masters</h2>
                                <p className="text-salon-muted leading-relaxed font-light text-lg">
                                    Our blogs aren't just articles—they are distilled wisdom from years of craft. From technical guides on hair restoration to the philosophy of grooming, our experts share it all.
                                </p>
                            </div>
                            <div className="flex gap-10">
                                <div>
                                    <p className="text-3xl font-serif text-salon-golden">15+</p>
                                    <p className="text-[10px] uppercase tracking-widest text-salon-muted mt-1">Master Artisans</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-serif text-salon-golden">100+</p>
                                    <p className="text-[10px] uppercase tracking-widest text-salon-muted mt-1">Expert Articles</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-4">
                            <div className="aspect-[3/4] overflow-hidden rounded-sm border border-salon-golden/10">
                                <img src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a" alt="Expert" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                            </div>
                            <div className="aspect-[3/4] overflow-hidden rounded-sm border border-salon-golden/10 translate-y-12">
                                <img src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70" alt="Expert" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default BlogListPage;
