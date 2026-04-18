import { apiClient } from './apiClient';

export interface BusinessReport {
    summary: {
        totalRevenue: number;
        bookingRevenue: number;
        orderRevenue: number;
        conversionRate: string;
        waitlistTotal: number;
        waitlistConverted: number;
    };
    topCoupons: {
        code: string;
        usage_count: number;
        total_discount: number;
    }[];
    trajectory: {
        day: string;
        total: number;
    }[];
}

export interface StaffPerformance {
    name: string;
    role: string;
    total_bookings: number;
    revenue: number | string;
    cancellations: number;
}

export const reportService = {
    getBusinessReport: async (timeframe: string = '30d') => {
        return apiClient.get<{ data: BusinessReport }>(`/reports/business`, { params: { timeframe } });
    },

    getStaffReport: async (timeframe: string = '30d') => {
        return apiClient.get<{ data: { staff: StaffPerformance[] } }>(`/reports/staff`, { params: { timeframe } });
    }
};
