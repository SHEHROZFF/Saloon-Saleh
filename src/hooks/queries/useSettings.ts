import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../../services/api/settingsService';
import { toast } from '../../components/ui/Toast';

export const useGetBootstrapSettings = () => {
    return useQuery({
        queryKey: ['settings', 'bootstrap'],
        queryFn: () => settingsService.getBootstrapSettings(),
        staleTime: 1000 * 60 * 60, // 1 hour
        refetchOnWindowFocus: false,
    });
};

export const useGetSettings = (key: string) => {
    return useQuery({
        queryKey: ['settings', key],
        queryFn: () => settingsService.getSettings(key),
        staleTime: 1000 * 60 * 60, // 1 hour
        refetchOnWindowFocus: false, // Prevents rate limiting when user switches tabs
    });
};

export const useUpsertSettings = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ key, value }: { key: string; value: any }) => 
            settingsService.upsertSettings(key, value),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['settings', variables.key] });
            toast.success('Settings updated successfully.');
        },
    });
};
