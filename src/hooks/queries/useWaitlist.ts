import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { waitlistService } from '@services/api/waitlistService';

export const useGetWaitlist = (params?: { page?: number; limit?: number; status?: string }) => {
    return useQuery({
        queryKey: ['waitlist', params],
        queryFn: () => waitlistService.getAllWaitlist(params),
    });
};

export const useSubmitWaitlist = () => {
    return useMutation({
        mutationFn: (data: { full_name: string; phone: string; email: string; desired_service: string }) => 
            waitlistService.submitWaitlist(data),
    });
};

export const useUpdateWaitlistStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => 
            waitlistService.updateWaitlistStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['waitlist'] });
        },
    });
};
