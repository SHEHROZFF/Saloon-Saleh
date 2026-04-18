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
            user_type?: string;
        };
        token: string;
        refreshToken: string;
    };
}

export const authService = {
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response: any = await apiClient.post('/auth/login', credentials);
        if (response.data?.user) {
            // Map snake_case to camelCase for frontend consistency
            response.data.user.userType = response.data.user.user_type || response.data.user.userType;
        }
        return response;
    },

    register: async (userData: RegisterRequest): Promise<AuthResponse> => {
        const response: any = await apiClient.post('/auth/register', userData);
        if (response.data?.user) {
            response.data.user.userType = response.data.user.user_type || response.data.user.userType;
        }
        return response;
    },

    refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
        return apiClient.post('/auth/refresh-token', { refreshToken });
    },

    getProfile: async (): Promise<any> => {
        const response: any = await apiClient.get('/users/me');
        if (response.data?.user) {
            // Map snake_case to camelCase for frontend consistency
            response.data.user.userType = response.data.user.user_type || response.data.user.userType;
        }
        return response;
    },

    forgotPassword: async (email: string): Promise<any> => {
        return apiClient.post('/auth/forgot-password', { email });
    },

    resetPassword: async (token: string, newPassword: string): Promise<any> => {
        return apiClient.post('/auth/reset-password', { token, newPassword });
    },
};
