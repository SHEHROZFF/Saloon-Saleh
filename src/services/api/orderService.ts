import { apiClient } from './apiClient';

export interface Order {
    id: string;
    order_number: string;
    user_id?: string;
    subtotal: number | string;
    shipping_cost: number | string;
    discount_amount: number | string;
    total: number | string;
    shipping_method: 'delivery' | 'pickup';
    payment_method: 'cod' | 'card' | 'transfer';
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    order_status: 'awaiting' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    created_at: string;
    customer_name?: string;
    first_name?: string;
    last_name?: string;
    customer_email?: string;
    items_count?: number;
    billing_address?: any;
    shipping_address?: any;
    items?: any[];
    order_notes?: string;
}

export const orderService = {
    createOrder: async (data: any) => {
        return apiClient.post<{ data: Order }>('/orders', data);
    },

    getMyOrders: async () => {
        return apiClient.get<{ data: Order[] }>('/orders/my');
    },

    // Admin endpoints
    getAllOrders: async (params?: { order_status?: string; payment_status?: string; page?: number; limit?: number }) => {
        return apiClient.get<any>('/orders', { params });
    },

    getOrderDetails: async (id: string) => {
        return apiClient.get<{ data: { order: Order } }>(`/orders/${id}`);
    },

    updateStatus: async (id: string, updates: { order_status?: string; payment_status?: string }) => {
        return apiClient.patch<{ data: Order }>(`/orders/${id}/status`, updates);
    },

    updateOrder: async (id: string, data: any) => {
        return apiClient.patch<{ data: Order }>(`/orders/${id}`, data);
    }
};

export const couponService = {
    validateCoupon: async (data: { code: string; order_total: number }) => {
        return apiClient.post<{ data: any }>('/coupons/validate', data);
    },

    // Admin
    getAllCoupons: async () => {
        return apiClient.get<{ data: any }>('/coupons');
    },

    createCoupon: async (data: any) => {
        return apiClient.post<{ data: any }>('/coupons', data);
    },

    deleteCoupon: async (id: string) => {
        return apiClient.delete(`/coupons/${id}`);
    },

    distributeCoupon: async (data: { coupon_id: string; emails: string[] }) => {
        return apiClient.post('/coupons/distribute', data);
    }
};
