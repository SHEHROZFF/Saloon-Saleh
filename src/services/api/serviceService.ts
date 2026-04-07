import { apiClient } from './apiClient';

export interface Service {
    id: string;
    name: string;
    price: string | number;
    duration: string;
    category_id: string;
    description: string;
    gender_target: 'Men' | 'Women' | 'Kids' | 'All';
    is_active: boolean;
    category_name?: string;
}

export interface ServiceCategory {
    id: string;
    name: string;
}

export const serviceService = {
    getServices: async (params?: { category_id?: string; gender?: string }) => {
        return apiClient.get<{ data: Service[] }>('/services', { params });
    },

    getCategories: async () => {
        return apiClient.get<{ data: ServiceCategory[] }>('/services/categories');
    },

    // Admin endpoints
    createService: async (data: Partial<Service>) => {
        return apiClient.post<{ data: Service }>('/services', data);
    },

    updateService: async (id: string, data: Partial<Service>) => {
        return apiClient.put<{ data: Service }>(`/services/${id}`, data);
    },

    deleteService: async (id: string) => {
        return apiClient.delete(`/services/${id}`);
    }
};
