import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceService, Service } from '../../services/api/serviceService';
import { toast } from '../../components/ui/Toast';

export const useGetServices = (params?: { category_id?: string; gender?: string }) => {
    return useQuery({
        queryKey: ['services', params],
        queryFn: () => serviceService.getServices(params),
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetServiceCategories = () => {
    return useQuery({
        queryKey: ['serviceCategories'],
        queryFn: () => serviceService.getCategories(),
        staleTime: 1000 * 60 * 60,
    });
};

export const useCreateService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<Service>) => serviceService.createService(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
        },
    });
};

export const useUpdateService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Service> }) => serviceService.updateService(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
        },
    });
};

export const useDeleteService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => serviceService.deleteService(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
            toast.success('Service deleted successfully.');
        },
    });
};
