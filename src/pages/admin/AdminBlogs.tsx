import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Calendar, User, Search, Filter } from 'lucide-react';
import { useGetBlogs, useDeleteBlog } from '../../hooks/queries/useBlogs';
import { useDebounce } from '../../hooks/useDebounce';
import AdminSlideOver from '../../components/admin/AdminSlideOver';
import BlogForm from '@components/admin/forms/BlogForm';
import { BlogPost } from '../../services/api/blogService';

const AdminBlogs = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 500);

    const { data, isLoading } = useGetBlogs({ 
        search: debouncedSearch,
        all: true // Admin sees drafts too
    });
    const { mutate: deleteBlog } = useDeleteBlog();
    const blogs = (data?.data as any)?.blogs || data?.data || [];

    const resetFilters = () => {
        setSearchTerm('');
    };

    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

    const handleAddClick = () => {
        setEditingBlog(null);
        setIsSlideOverOpen(true);
    };

    const handleEditClick = (b: BlogPost) => {
        setEditingBlog(b);
        setIsSlideOverOpen(true);
    };

    const handleCloseSlideOver = () => {
        setIsSlideOverOpen(false);
        setEditingBlog(null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            deleteBlog(id);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-serif text-salon-primary">Expert Insights (Blogs)</h2>
                    <p className="text-xs text-salon-muted tracking-widest uppercase mt-1">Manage all articles published by your master artisans.</p>
                </div>
                <button 
                    onClick={handleAddClick}
                    className="px-6 py-2.5 bg-salon-golden text-black text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-salon-golden-muted transition-colors rounded shadow-lg"
                >
                    <Plus className="w-4 h-4" /> Create Article
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-salon-surface/50 border border-salon-golden/10 p-4 rounded-lg">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-salon-muted" />
                    <input 
                        type="text" 
                        placeholder="Search articles by title or author..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-salon-base border border-salon-golden/20 rounded pl-10 pr-4 py-2.5 text-sm text-salon-primary placeholder-salon-muted focus:outline-none focus:border-salon-golden transition-colors"
                    />
                </div>
                <button 
                    onClick={resetFilters}
                    className="px-4 py-2.5 bg-salon-base border border-salon-golden/20 rounded text-salon-primary hover:border-salon-golden transition-colors flex items-center gap-2 hover:bg-salon-golden/5"
                >
                    <Filter className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-widest font-medium hidden sm:inline">Reset</span>
                </button>
            </div>
            
            <div className="bg-salon-surface/30 border border-salon-golden/10 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-salon-surface/50 border-b border-salon-golden/20">
                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-salon-muted font-bold">Article</th>
                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-salon-muted font-bold">Author</th>
                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-salon-muted font-bold">Date</th>
                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-salon-muted font-bold">Status</th>
                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-salon-muted font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-salon-golden/5">
                        {isLoading ? (
                            <tr><td colSpan={5} className="text-center py-20"><div className="flex justify-center"><div className="w-6 h-6 border-2 border-salon-golden border-t-transparent rounded-full animate-spin"></div></div></td></tr>
                        ) : blogs.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-20 text-salon-muted italic">No articles found. Master artisans haven't published yet.</td></tr>
                        ) : blogs.map((b: any) => (
                            <tr key={b.id} className="hover:bg-salon-surface/50 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded bg-salon-base border border-salon-golden/10 overflow-hidden flex-shrink-0">
                                            <img src={b.image_url || "https://images.unsplash.com/photo-1560066984-138dadb4c035"} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-salon-primary truncate max-w-xs">{b.title}</p>
                                            <p className="text-[10px] text-salon-muted truncate max-w-xs uppercase tracking-tighter italic">/{b.slug}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2">
                                        <User className="w-3 h-3 text-salon-golden" />
                                        <span className="text-sm text-salon-primary">{b.staff_name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2 text-salon-muted text-xs">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(b.created_at).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`px-2 py-0.5 text-[8px] uppercase tracking-widest font-bold rounded-sm ${b.status === 'published' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                                        {b.status}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a href={`/blogs/${b.slug}`} target="_blank" rel="noreferrer" className="text-salon-muted hover:text-salon-golden p-1" title="View Publicly">
                                            <Eye className="w-4 h-4" />
                                        </a>
                                        <button onClick={() => handleEditClick(b)} className="text-salon-muted hover:text-salon-golden p-1" title="Edit Article">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(b.id)} className="text-salon-muted hover:text-red-500 p-1" title="Delete Article">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AdminSlideOver 
                isOpen={isSlideOverOpen} 
                onClose={handleCloseSlideOver}
                title={editingBlog ? "Refine Article" : "Compose New Article"}
            >
                <BlogForm 
                    initialData={editingBlog} 
                    onClose={handleCloseSlideOver} 
                />
            </AdminSlideOver>
        </div>
    );
};

export default AdminBlogs;
