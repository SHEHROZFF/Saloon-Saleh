import { useQuery } from '@tanstack/react-query';
import { adminService } from '@services/api/adminService';

export const useGetAdminStats = () => {
    return useQuery({
        queryKey: ['admin', 'stats'],
        queryFn: () => adminService.getDashboardStats(),
    });
};
