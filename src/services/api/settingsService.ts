import { apiClient } from './apiClient';

export const settingsService = {
    getBootstrapSettings: async () => {
        return apiClient.get<{ data: any }>(`/settings/public/bootstrap`);
    },

    getSettings: async (key: string) => {
        return apiClient.get<{ data: any }>(`/settings/${key}`);
    },

    upsertSettings: async (key: string, value: any) => {
        return apiClient.put<{ data: any }>(`/settings/${key}`, value);
    },
};
