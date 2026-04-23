import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService, couponService } from '../../services/api/orderService';

export const useGetAllOrders = (params?: { order_status?: string; payment_status?: string; search?: string; page?: number; limit?: number }) => {
    return useQuery({
        queryKey: ['orders', 'all', params],
        queryFn: () => orderService.getAllOrders(params),
    });
};

export const useGetMyOrders = () => {
    return useQuery({
        queryKey: ['orders', 'my'],
        queryFn: () => orderService.getMyOrders(),
    });
};

export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => orderService.createOrder(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            // Should arguably invalidate product inventory cache too
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: { order_status?: string; payment_status?: string } }) => 
            orderService.updateStatus(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });
};

export const useUpdateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => 
            orderService.updateOrder(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });
};

// Coupons
export const useValidateCoupon = () => {
    return useMutation({
        mutationFn: (data: { code: string; order_total: number }) => couponService.validateCoupon(data),
    });
};

export const useGetAllCoupons = () => {
    return useQuery({
        queryKey: ['coupons'],
        queryFn: () => couponService.getAllCoupons(),
    });
};

export const useCreateCoupon = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => couponService.createCoupon(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coupons'] });
        },
    });
};

export const useDeleteCoupon = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => couponService.deleteCoupon(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coupons'] });
        },
    });
};

export const useDistributeCoupon = () => {
    return useMutation({
        mutationFn: (data: { coupon_id: string; emails: string[] }) => couponService.distributeCoupon(data),
    });
};
