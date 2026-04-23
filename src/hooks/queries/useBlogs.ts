import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogService, BlogPost } from '../../services/api/blogService';
import { toast } from '../../components/ui/Toast';

export const useGetBlogs = (params?: { search?: string; all?: boolean }) => {
    return useQuery({
        queryKey: ['blogs', params],
        queryFn: () => blogService.getAllBlogs(params),
    });
};

export const useGetBlogBySlug = (slug: string) => {
    return useQuery({
        queryKey: ['blogs', 'slug', slug],
        queryFn: () => blogService.getBlogBySlug(slug),
        enabled: !!slug,
    });
};

export const useGetStaffBlogs = (staffId: string) => {
    return useQuery({
        queryKey: ['blogs', 'staff', staffId],
        queryFn: () => blogService.getStaffBlogs(staffId),
        enabled: !!staffId,
    });
};

export const useCreateBlog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<BlogPost>) => blogService.createBlog(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
        },
    });
};

export const useUpdateBlog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<BlogPost> }) => 
            blogService.updateBlog(id, data),
        onSuccess: (_) => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
            queryClient.invalidateQueries({ queryKey: ['blogs', 'staff'] });
        },
    });
};

export const useDeleteBlog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => blogService.deleteBlog(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
            toast.success('Blog post deleted successfully.');
        },
    });
};
