import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BlogPost } from '../../services/api/blogService';
import { staffService } from '../../services/api/staffService';
import { Loader2, Plus, Edit, Trash2, Eye, Calendar, Image as ImageIcon, CheckCircle, XCircle } from 'lucide-react';
import { useGetStaffBlogs, useCreateBlog, useUpdateBlog, useDeleteBlog } from '../../hooks/queries/useBlogs';

const StaffBlogs = () => {
    const { data: profileData } = useQuery({ queryKey: ['staff', 'me'], queryFn: () => staffService.getMyProfile() });
    const staffId = profileData?.data?.staff?.id;

    const { data: blogsData, isLoading } = useGetStaffBlogs(staffId || '');
    const blogs = blogsData?.data?.blogs || [];

    const [isEditing, setIsEditing] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState<Partial<BlogPost> | null>(null);

    const createMutation = useCreateBlog();
    const updateMutation = useUpdateBlog();
    const deleteMutation = useDeleteBlog();

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBlog) return;

        if (selectedBlog.id) {
            updateMutation.mutate({ id: selectedBlog.id, data: selectedBlog }, { onSuccess: () => setIsEditing(false) });
        } else {
            createMutation.mutate(selectedBlog, { onSuccess: () => setIsEditing(false) });
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this insight?')) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-salon-golden" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex justify-between items-end border-b border-salon-golden/10 pb-6">
                <div>
                    <h2 className="text-3xl font-serif text-salon-primary">My Professional Blogs</h2>
                    <p className="text-sm text-salon-muted mt-2 uppercase tracking-widest">Manage your expert insights and articles.</p>
                </div>
                {!isEditing && (
                    <button 
                        onClick={() => { setSelectedBlog({ title: '', content: '', excerpt: '', image_url: '', status: 'published' }); setIsEditing(true); }}
                        className="flex items-center gap-2 px-6 py-3 bg-salon-golden text-black text-xs font-bold tracking-widest uppercase hover:bg-salon-golden-muted transition-all rounded"
                    >
                        <Plus className="w-4 h-4" /> New Insight
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="bg-salon-surface/30 border border-salon-golden/10 p-10 rounded-sm space-y-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-serif text-salon-primary">{selectedBlog?.id ? 'Refine Insight' : 'Draft New Insight'}</h3>
                        <button onClick={() => setIsEditing(false)} className="text-salon-muted hover:text-salon-primary transition-colors"><XCircle className="w-6 h-6" /></button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-2 font-bold">Insight Title</label>
                                    <input 
                                        type="text"
                                        required
                                        value={selectedBlog?.title}
                                        onChange={(e) => setSelectedBlog({...selectedBlog, title: e.target.value})}
                                        className="w-full bg-salon-surface border border-salon-golden/10 px-6 py-4 text-sm focus:outline-none focus:border-salon-golden transition-all"
                                        placeholder="e.g. The Philosophy of the Modern Fade"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-2 font-bold">Hero Image URL</label>
                                    <div className="relative">
                                        <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-salon-muted" />
                                        <input 
                                            type="url"
                                            value={selectedBlog?.image_url}
                                            onChange={(e) => setSelectedBlog({...selectedBlog, image_url: e.target.value})}
                                            className="w-full bg-salon-surface border border-salon-golden/10 pl-14 pr-6 py-4 text-sm focus:outline-none focus:border-salon-golden transition-all"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-2 font-bold">Short Summary (Excerpt)</label>
                                    <textarea 
                                        rows={3}
                                        value={selectedBlog?.excerpt}
                                        onChange={(e) => setSelectedBlog({...selectedBlog, excerpt: e.target.value})}
                                        className="w-full bg-salon-surface border border-salon-golden/10 px-6 py-4 text-sm focus:outline-none focus:border-salon-golden transition-all resize-none"
                                        placeholder="A brief teaser for the readers..."
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-2 font-bold">Insight Content</label>
                                    <textarea 
                                        rows={12}
                                        required
                                        value={selectedBlog?.content}
                                        onChange={(e) => setSelectedBlog({...selectedBlog, content: e.target.value})}
                                        className="w-full bg-salon-surface border border-salon-golden/10 px-6 py-4 text-sm focus:outline-none focus:border-salon-golden transition-all resize-none font-serif"
                                        placeholder="Write your wisdom here..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-10 border-t border-salon-golden/10">
                            <button 
                                type="submit"
                                disabled={createMutation.isPending || updateMutation.isPending}
                                className="px-10 py-4 bg-salon-golden text-black text-xs font-bold tracking-[0.3em] uppercase hover:bg-salon-golden-muted transition-all rounded shadow-lg flex items-center gap-3 disabled:opacity-50"
                            >
                                {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                Publish to World
                            </button>
                            <button 
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-10 py-4 bg-salon-surface border border-salon-golden/10 text-salon-muted text-xs font-bold tracking-[0.3em] uppercase hover:text-salon-primary transition-all rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((blog) => (
                        <div key={blog.id} className="bg-salon-surface/40 border border-salon-golden/10 rounded-sm overflow-hidden group hover:border-salon-golden/30 transition-all flex flex-col">
                            <div className="aspect-video relative overflow-hidden">
                                <img src={blog.image_url || "https://images.unsplash.com/photo-1560066984-138dadb4c035"} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute top-4 right-4">
                                    <span className={`px-2 py-1 text-[8px] uppercase tracking-widest font-bold rounded-sm shadow-lg ${blog.status === 'published' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                                        {blog.status}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 space-y-4 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-salon-muted font-bold">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(blog.created_at).toLocaleDateString()}
                                </div>
                                <h4 className="text-xl font-serif text-salon-primary line-clamp-2 leading-snug">{blog.title}</h4>
                                <p className="text-xs text-salon-muted line-clamp-2 font-light flex-1">{blog.excerpt || 'Insight content...'}</p>
                                
                                <div className="flex gap-2 pt-4 border-t border-salon-golden/5">
                                    <button onClick={() => { setSelectedBlog(blog); setIsEditing(true); }} className="flex-1 py-2 bg-salon-surface border border-salon-golden/10 text-[9px] uppercase tracking-widest font-bold text-salon-golden hover:bg-salon-golden/10 transition-all flex items-center justify-center gap-2">
                                        <Edit className="w-3 h-3" /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(blog.id)} className="w-10 h-10 flex items-center justify-center bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-sm border border-red-500/10">
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                    <a href={`/blogs/${blog.slug}`} target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center bg-salon-golden/5 text-salon-golden hover:bg-salon-golden hover:text-black transition-all rounded-sm border border-salon-golden/10">
                                        <Eye className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                    {blogs.length === 0 && (
                        <div className="col-span-full py-32 text-center border-2 border-dashed border-salon-golden/10 rounded-sm">
                            <Plus className="w-12 h-12 text-salon-golden/20 mx-auto mb-4" />
                            <p className="text-salon-muted uppercase tracking-widest text-xs">No insights shared yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StaffBlogs;
