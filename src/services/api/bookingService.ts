import { apiClient } from './apiClient';

export interface PaginatedResponse {
    data: any;
    total: number;
    page: number;
    limit: number;
    last_page: number;
}

export interface TimeSlot {
    id: string;
    slot_time: string;
    display_label: string;
}

export interface Booking {
    id: string;
    user_id?: string;
    gender: string;
    staff_id: string;
    booking_date: string;
    time_slot_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    notes?: string;
    total_price: number | string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
    created_at?: string;
    staff_name?: string;
    time_slot_label?: string;
    services?: any[];
}

export const bookingService = {
    getTimeSlots: async () => {
        return apiClient.get<{ data: TimeSlot[] }>('/bookings/time-slots');
    },

    checkAvailability: async (params: { date: string; staff_id?: string }) => {
        // Returns unavailable time_slot_ids
        return apiClient.get<{ data: string[] }>('/bookings/availability', { params });
    },

    createBooking: async (data: any) => {
        return apiClient.post<{ data: Booking }>('/bookings', data);
    },

    getMyBookings: async () => {
        return apiClient.get<{ data: { bookings: Booking[] } }>('/bookings/my');
    },

    // Admin / Staff endpoints
    getAllBookings: async (params?: { status?: string; date?: string; staff_id?: string; search?: string; page?: number; limit?: number }) => {
        return apiClient.get<{ data: { bookings: Booking[] }, pagination: any }>('/bookings', { params });
    },

    getBookingDetails: async (id: string) => {
        return apiClient.get<{ data: Booking }>(`/bookings/${id}`);
    },

    updateStatus: async (id: string, status: string) => {
        return apiClient.patch<{ data: Booking }>(`/bookings/${id}/status`, { status });
    },

    updateDetails: async (id: string, data: any) => {
        return apiClient.put<{ data: Booking }>(`/bookings/${id}`, data);
    },

    deleteBooking: async (id: string) => {
        return apiClient.delete(`/bookings/${id}`);
    },

    // ─── Staff-specific endpoints ───
    getStaffMyBookings: async () => {
        return apiClient.get<{ data: { bookings: Booking[] } }>('/bookings/staff/my');
    },

    updateStaffBookingStatus: async (id: string, status: string) => {
        return apiClient.patch<{ data: Booking }>(`/bookings/staff/${id}/status`, { status });
    },
};
