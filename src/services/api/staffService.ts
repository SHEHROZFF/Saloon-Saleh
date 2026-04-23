import { apiClient } from './apiClient';

export interface PaginatedResponse {
    data: any;
    meta: {
        total: number;
        page: number;
        limit: number;
    };
}

export interface Staff {
    id: string;
    name: string;
    role: string;
    avatar_url: string;
    phone: string;
    email: string;
    is_active: boolean;
    sort_order: number;
    bio?: string;
    specialties?: string[];
    experience_years?: string;
    instagram_url?: string;
    linkedin_url?: string;
    services?: { id: string; name: string }[];
}

export const staffService = {
    getStaff: async (params?: { search?: string; all?: boolean }) => {
        return apiClient.get<{ data: { staff: Staff[] } }>('/staff', { params });
    },

    getStaffById: async (id: string) => {
        return apiClient.get<{ data: { staff: Staff } }>(`/staff/${id}`);
    },

    // Admin endpoints
    createStaff: async (data: Partial<Staff> & { service_ids?: string[] }) => {
        return apiClient.post<{ data: Staff }>('/staff', data);
    },

    updateStaff: async (id: string, data: Partial<Staff> & { service_ids?: string[] }) => {
        return apiClient.put<{ data: Staff }>(`/staff/${id}`, data);
    },

    deleteStaff: async (id: string) => {
        return apiClient.delete(`/staff/${id}`);
    },

    // Staff Self Management
    getMyProfile: async () => {
        return apiClient.get<{ data: { staff: Staff } }>('/staff/me');
    },

    updateMyProfile: async (data: Partial<Staff>) => {
        return apiClient.patch<{ data: { staff: Staff } }>('/staff/me', data);
    }
};
