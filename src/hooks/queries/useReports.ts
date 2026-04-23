import { useQuery } from '@tanstack/react-query';
import { reportService } from '../../services/api/reportService';

export const useGetBusinessReport = (timeframe: string) => {
    return useQuery({
        queryKey: ['reports', 'business', timeframe],
        queryFn: () => reportService.getBusinessReport(timeframe),
    });
};

export const useGetStaffReport = (timeframe: string) => {
    return useQuery({
        queryKey: ['reports', 'staff', timeframe],
        queryFn: () => reportService.getStaffReport(timeframe),
    });
};

export const useGetStaffDetailReport = (id: string | null, timeframe: string) => {
    return useQuery({
        queryKey: ['reports', 'staff', id, timeframe],
        queryFn: () => reportService.getStaffDetailReport(id!, timeframe),
        enabled: !!id,
    });
};
