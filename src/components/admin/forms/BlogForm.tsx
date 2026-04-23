import React, { useState, useEffect } from 'react';
import { useCreateBlog, useUpdateBlog } from '../../../hooks/queries/useBlogs';
import { useGetStaff } from '../../../hooks/queries/useStaff';
import { BlogPost } from '../../../services/api/blogService';
import { Loader2, CheckCircle, Image as ImageIcon, User } from 'lucide-react';
import { toast } from '../../ui/Toast';

interface BlogFormProps {
    initialData?: BlogPost | null;
    onClose: () => void;
}

const BlogForm: React.FC<BlogFormProps> = ({ initialData, onClose }) => {
    const { mutate: createBlog, isPending: isCreating } = useCreateBlog();
    const { mutate: updateBlog, isPending: isUpdating } = useUpdateBlog();
    const { data: staffData } = useGetStaff();
    const staffMembers = (staffData?.data as any)?.staff || staffData?.data || [];

    const [formData, setFormData] = useState<{
        title: string;
        content: string;
        excerpt: string;
        image_url: string;
        status: 'draft' | 'published';
        staff_id: string;
    }>({
        title: '',
        content: '',
        excerpt: '',
        image_url: '',
        status: 'published',
        staff_id: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                content: initialData.content || '',
                excerpt: initialData.excerpt || '',
                image_url: initialData.image_url || '',
                status: (initialData.status as 'draft' | 'published') || 'published',
                staff_id: initialData.staff_id || ''
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (initialData) {
            updateBlog({ id: initialData.id, data: formData }, {
                onSuccess: () => { toast.success('Article updated.'); onClose(); }
            });
        } else {
            createBlog(formData, {
                onSuccess: () => { toast.success('Article published.'); onClose(); }
            });
        }
    };

    const isPending = isCreating || isUpdating;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
            <div className="space-y-4 text-salon-primary">
                {/* Author Selection (Admin Only) */}
                {!initialData && (
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1 font-bold">Assign Author (Staff)</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-salon-muted" />
                            <select
                                required
                                value={formData.staff_id}
                                onChange={(e) => setFormData(prev => ({ ...prev, staff_id: e.target.value }))}
                                className="w-full bg-salon-surface border border-salon-golden/20 rounded-md pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors appearance-none"
                            >
                                <option value="">Select an Artisan Author</option>
                                {staffMembers.map((s: any) => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1 font-bold">Article Title</label>
                    <input
                        required
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                        placeholder="e.g. The Art of Modern Sculpting"
                    />
                </div>

                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1 font-bold">Hero Image URL</label>
                    <div className="relative">
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-salon-muted" />
                        <input
                            type="url"
                            value={formData.image_url}
                            onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                            className="w-full bg-salon-surface border border-salon-golden/20 rounded-md pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                            placeholder="https://images.unsplash.com/..."
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1 font-bold">Short Excerpt</label>
                    <textarea
                        rows={3}
                        value={formData.excerpt}
                        onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                        className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-all resize-none"
                        placeholder="A brief summary for the blog list..."
                    />
                </div>

                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1 font-bold">Content (Full Article)</label>
                    <textarea
                        required
                        rows={12}
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-all resize-none font-serif"
                        placeholder="Write the expert article here..."
                    />
                </div>

                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-salon-muted mb-1 font-bold">Publication Status</label>
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                        className="w-full bg-salon-surface border border-salon-golden/20 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-salon-golden transition-colors"
                    >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-salon-golden/10 bg-salon-base sticky bottom-0 z-10">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 text-sm font-semibold tracking-wider uppercase text-salon-muted hover:text-salon-primary transition-colors bg-salon-surface border border-salon-golden/10 rounded-md"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 py-3 text-sm font-bold tracking-wider uppercase text-black bg-salon-golden hover:bg-salon-golden-muted transition-colors rounded-md disabled:opacity-50 flex justify-center items-center gap-2"
                >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    {initialData ? 'Update Article' : 'Publish Article'}
                </button>
            </div>
        </form>
    );
};

export default BlogForm;
