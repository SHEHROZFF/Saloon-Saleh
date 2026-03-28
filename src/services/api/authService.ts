import { apiClient } from './apiClient';

interface LoginRequest {
    email: string;
    password: string;
}

interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    phone?: string;
    userType?: string;
}

interface AuthResponse {
    status: string;
    data: {
        user: {
            id: string;
            name: string;
            email: string;
            userType: string;
        };
        token: string;
        refreshToken: string;
    };
}

export const authService = {
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        return apiClient.post('/auth/login', credentials);
    },

    register: async (userData: RegisterRequest): Promise<AuthResponse> => {
        return apiClient.post('/auth/register', userData);
    },

    refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
        return apiClient.post('/auth/refresh-token', { refreshToken });
    },

    getProfile: async () => {
        return apiClient.get('/users/me');
    },
};
