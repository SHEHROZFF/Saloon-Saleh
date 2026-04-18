import { apiClient } from './apiClient';

export interface WaitlistEntry {
    id: string;
    full_name: string;
    phone: string;
    email: string;
    desired_service: string;
    status: 'pending' | 'contacted' | 'booked';
    created_at: string;
}

export const waitlistService = {
    getAllWaitlist: async (params?: { page?: number; limit?: number; status?: string }) => {
        return apiClient.get<{ data: { waitlist: WaitlistEntry[] } }>('/waitlist', { params });
    },

    submitWaitlist: async (data: { full_name: string; phone: string; email: string; desired_service: string }) => {
        return apiClient.post<{ data: { waitlist: WaitlistEntry } }>('/waitlist', data);
    },

    updateWaitlistStatus: async (id: string, status: string) => {
        return apiClient.patch<{ data: { waitlist: WaitlistEntry } }>(`/waitlist/${id}/status`, { status });
    },
};
