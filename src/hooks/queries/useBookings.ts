import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../../services/api/bookingService';

export const useGetTimeSlots = () => {
    return useQuery({
        queryKey: ['timeSlots'],
        queryFn: () => bookingService.getTimeSlots(),
        staleTime: 1000 * 60 * 60, // 1 hour
    });
};

export const useCheckAvailability = (date: string, staff_id?: string) => {
    return useQuery({
        queryKey: ['bookingAvailability', date, staff_id],
        queryFn: () => bookingService.checkAvailability({ date, staff_id }),
        enabled: !!date && !!staff_id,
    });
};

export const useGetAllBookings = (params?: { status?: string; date?: string; staff_id?: string; search?: string; page?: number; limit?: number }) => {
    return useQuery({
        queryKey: ['bookings', 'all', params],
        queryFn: () => bookingService.getAllBookings(params),
    });
};

export const useGetMyBookings = () => {
    return useQuery({
        queryKey: ['bookings', 'my'],
        queryFn: () => bookingService.getMyBookings(),
    });
};

export const useCreateBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => bookingService.createBooking(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            queryClient.invalidateQueries({ queryKey: ['bookingAvailability'] });
        },
    });
};

// useBookings.ts update
export const useUpdateBookingStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => bookingService.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
    });
};

export const useDeleteBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => bookingService.deleteBooking(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
    });
};

export const useUpdateBookingDetails = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => bookingService.updateDetails(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            queryClient.invalidateQueries({ queryKey: ['bookingAvailability'] });
        },
    });
};

// ─── Staff-specific hooks ───

export const useGetStaffBookings = () => {
    return useQuery({
        queryKey: ['bookings', 'staff', 'my'],
        queryFn: () => bookingService.getStaffMyBookings(),
    });
};

export const useUpdateStaffBookingStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => bookingService.updateStaffBookingStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings', 'staff'] });
        },
    });
};
