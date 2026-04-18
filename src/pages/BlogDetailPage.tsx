import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Loader2, Clock, Share2, Sparkles, Award } from 'lucide-react';
import { useGetBlogBySlug } from '../hooks/queries/useBlogs';
import Header from '../components/layout/Header';
import Footer from '../components/landing/Footer';
import Button from '../components/ui/Button';

const BlogDetailPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { data: blogData, isLoading } = useGetBlogBySlug(slug || '');

    const blog = blogData?.data?.blog;

    if (isLoading) return (
        <div className="min-h-screen bg-salon-base flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-salon-golden" />
        </div>
    );

    if (!blog) return (
        <div className="min-h-screen bg-salon-base flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-3xl font-serif text-salon-primary mb-4">Insight Not Found</h2>
            <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
    );

    return (
        <div className="w-full min-h-screen bg-salon-base text-salon-primary">
            <Header />
            
            <main className="pt-32 pb-24">
                {/* Hero Header */}
                <div className="max-w-[1000px] mx-auto px-6 mb-16">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-xs text-salon-muted hover:text-salon-golden mb-8 transition-colors uppercase tracking-widest font-bold"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Experts
                    </button>
                    
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-salon-golden font-bold">
                            <span className="bg-salon-golden/10 px-3 py-1 rounded-sm">The Artisan Perspective</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-salon-golden"></span>
                            <span className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {new Date(blog.created_at).toLocaleDateString()}</span>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl font-serif leading-tight">{blog.title}</h1>
                        
                        <div className="flex items-center gap-6 pt-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-salon-golden/20">
                                    <img src={blog.staff_avatar || "https://images.unsplash.com/photo-1599351431202-1e0f0137899a"} alt={blog.staff_name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold tracking-widest uppercase">{blog.staff_name}</p>
                                    <p className="text-[10px] text-salon-muted uppercase tracking-widest">{blog.staff_role}</p>
                                </div>
                            </div>
                            <div className="h-10 w-px bg-salon-golden/10 hidden md:block"></div>
                            <div className="hidden md:flex items-center gap-2 text-salon-golden">
                                <Award className="w-4 h-4" />
                                <span className="text-[10px] uppercase tracking-widest font-bold">{blog.staff_experience || 'Master'} Level</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hero Image */}
                <div className="max-w-[1400px] mx-auto px-6 mb-20">
                    <div className="aspect-[21/9] w-full overflow-hidden rounded-sm border border-salon-golden/10 shadow-2xl">
                        <img src={blog.image_url || "https://images.unsplash.com/photo-1560066984-138dadb4c035"} alt={blog.title} className="w-full h-full object-cover" />
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-[800px] mx-auto px-6">
                    <div className="flex justify-between items-center mb-12 border-b border-salon-golden/10 pb-6">
                        <div className="flex gap-6 text-[10px] uppercase tracking-widest text-salon-muted font-bold">
                            <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> 5 Min Read</span>
                            <span className="flex items-center gap-2 cursor-pointer hover:text-salon-golden transition-colors"><Share2 className="w-3 h-3" /> Share</span>
                        </div>
                    </div>

                    <div className="prose prose-invert prose-salon max-w-none">
                        <div className="text-xl text-salon-golden-muted font-light italic mb-10 leading-relaxed border-l-4 border-salon-golden pl-8 py-2">
                            {blog.excerpt || "An exploration of artistic vision and refined technique in the modern world of beauty rituals."}
                        </div>
                        
                        <div className="text-lg text-salon-primary/80 leading-[1.8] font-light space-y-8 whitespace-pre-wrap">
                            {blog.content}
                        </div>
                    </div>

                    {/* Footer Author Bio */}
                    <div className="mt-24 p-10 bg-salon-surface/50 border border-salon-golden/10 rounded-sm">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-salon-golden shrink-0 shadow-xl">
                                <img src={blog.staff_avatar || "https://images.unsplash.com/photo-1599351431202-1e0f0137899a"} alt={blog.staff_name} className="w-full h-full object-cover" />
                            </div>
                            <div className="space-y-4 flex-1">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h4 className="text-2xl font-serif text-salon-primary">Meet {blog.staff_name}</h4>
                                        <p className="text-[10px] text-salon-golden uppercase tracking-[0.2em] font-bold mt-1">{blog.staff_role} • {blog.staff_experience || 'Master Artisan'}</p>
                                    </div>
                                    <Button variant="outline" onClick={() => navigate(`/experts/${blog.staff_id}`)} className="text-[10px] px-6 h-10 border-salon-golden/20 hover:border-salon-golden">
                                        View Expert Profile
                                    </Button>
                                </div>
                                
                                <p className="text-sm text-salon-muted leading-relaxed font-light italic border-l border-salon-golden/10 pl-6">
                                    {blog.staff_bio || `${blog.staff_name} is a dedicated artisan at Salon Saleh, bringing years of expertise and a unique vision to the world of refined beauty rituals.`}
                                </p>

                                {blog.staff_specialties && blog.staff_specialties.length > 0 && (
                                    <div className="pt-4 flex flex-wrap gap-2">
                                        <span className="text-[9px] uppercase tracking-widest text-salon-muted font-bold mr-2 flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" /> Core Expertise:
                                        </span>
                                        {blog.staff_specialties.map((spec, i) => (
                                            <span key={i} className="px-3 py-1 bg-salon-golden/5 border border-salon-golden/10 text-[9px] uppercase tracking-widest text-salon-golden">
                                                {spec}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default BlogDetailPage;
