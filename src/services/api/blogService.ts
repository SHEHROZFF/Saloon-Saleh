import { apiClient } from './apiClient';

export interface BlogPost {
    id: string;
    staff_id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    image_url?: string;
    status: 'draft' | 'published';
    created_at: string;
    staff_name?: string;
    staff_role?: string;
    staff_avatar?: string;
    staff_bio?: string;
    staff_specialties?: string[];
    staff_experience?: string;
}

export const blogService = {
    getAllBlogs: async () => {
        return apiClient.get<{ data: { blogs: BlogPost[] } }>('/blogs');
    },

    getBlogBySlug: async (slug: string) => {
        return apiClient.get<{ data: { blog: BlogPost } }>(`/blogs/slug/${slug}`);
    },

    getStaffBlogs: async (staffId: string) => {
        return apiClient.get<{ data: { blogs: BlogPost[] } }>(`/blogs/staff/${staffId}`);
    },

    createBlog: async (data: Partial<BlogPost>) => {
        return apiClient.post<{ data: { blog: BlogPost } }>('/blogs', data);
    },

    updateBlog: async (id: string, data: Partial<BlogPost>) => {
        return apiClient.patch<{ data: { blog: BlogPost } }>(`/blogs/${id}`, data);
    },

    deleteBlog: async (id: string) => {
        return apiClient.delete(`/blogs/${id}`);
    }
};
