import { apiClient } from './apiClient';

export interface AdminStats {
  label: string;
  value: string;
  change: string;
  icon: string;
}

export const adminService = {
  getDashboardStats: async () => {
    return apiClient.get<{ data: { stats: AdminStats[] } }>('/admin/stats');
  },
};
