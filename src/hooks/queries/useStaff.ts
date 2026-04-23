import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffService, Staff } from '../../services/api/staffService';

export const useGetStaff = (params?: { search?: string; all?: boolean }) => {
    return useQuery({
        queryKey: ['staff', params],
        queryFn: () => staffService.getStaff(params),
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetStaffMember = (id: string) => {
    return useQuery({
        queryKey: ['staff', id],
        queryFn: () => staffService.getStaffById(id),
        enabled: !!id,
    });
};

export const useCreateStaff = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<Staff> & { service_ids?: string[] }) => staffService.createStaff(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staff'] });
        },
    });
};

export const useUpdateStaff = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Staff> & { service_ids?: string[] } }) => staffService.updateStaff(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['staff'] });
            queryClient.invalidateQueries({ queryKey: ['staff', variables.id] });
        },
    });
};

export const useDeleteStaff = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => staffService.deleteStaff(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staff'] });
        },
    });
};
