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
    services?: string[]; // Array of service IDs this staff can perform
}

export const staffService = {
    getStaff: async () => {
        return apiClient.get<{ data: Staff[] }>('/staff');
    },

    getStaffById: async (id: string) => {
        return apiClient.get<{ data: Staff }>(`/staff/${id}`);
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
    }
};
