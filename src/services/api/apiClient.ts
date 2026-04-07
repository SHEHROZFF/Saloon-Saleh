import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_URL = 'http://localhost:3000/api/v1';

class ApiClient {
    private client: AxiosInstance;
    private token: string | null = null;

    constructor() {
        this.client = axios.create({
            baseURL: API_URL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
        this.initializeTokenFromStorage();
    }

    private getPersistedAuth() {
        try {
            const persistDataString = localStorage.getItem('persist:root');
            if (!persistDataString) return null;

            const persistData = JSON.parse(persistDataString);
            if (!persistData.auth) return null;

            // Redux persist stores sub-slices as stringified JSON
            const authData = typeof persistData.auth === 'string' 
                ? JSON.parse(persistData.auth) 
                : persistData.auth;
            
            return authData;
        } catch (e) {
            console.error('ApiClient: Failed to parse persistence storage', e);
            return null;
        }
    }

    private initializeTokenFromStorage() {
        const authData = this.getPersistedAuth();
        if (authData?.token) {
            this.token = authData.token;
            console.log('ApiClient: Eagerly initialized token from storage');
        }
    }

    private setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use(
            config => {
                if (this.token) {
                    config.headers.Authorization = `Bearer ${this.token}`;
                }
                return config;
            },
            error => Promise.reject(error)
        );

        // Response interceptor
        this.client.interceptors.response.use(
            response => response.data,
            async error => {
                const originalRequest = error.config;

                // Handle 401 Unauthorized: Attempt to refresh token
                if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/login') && !originalRequest.url?.includes('/auth/refresh-token')) {
                    originalRequest._retry = true;

                    try {
                        const authData = this.getPersistedAuth();
                        const refreshToken = authData?.refreshToken;

                        if (refreshToken) {
                            console.log('ApiClient: Attempting to refresh token...');
                            // Make direct API call to refresh without using this instance to avoid infinite loops
                            const refreshResponse = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
                            
                            const newToken = refreshResponse.data.data.token;
                            const newRefreshToken = refreshResponse.data.data.refreshToken || refreshToken;
                            
                            // Update apiClient's token so subsequent calls work
                            this.setToken(newToken);
                            
                            // Update localStorage so Redux picks it up after reload
                            const persistDataString = localStorage.getItem('persist:root');
                            if (persistDataString) {
                                const persistData = JSON.parse(persistDataString);
                                const currentAuth = JSON.parse(persistData.auth);
                                
                                currentAuth.token = newToken;
                                currentAuth.refreshToken = newRefreshToken;
                                
                                persistData.auth = JSON.stringify(currentAuth);
                                localStorage.setItem('persist:root', JSON.stringify(persistData));
                            }
                            
                            // Fire a custom event so the App can update Redux state in memory immediately
                            window.dispatchEvent(new CustomEvent('token_refreshed', { detail: { token: newToken, refreshToken: newRefreshToken } }));

                            console.log('ApiClient: Refresh successful, retrying request');
                            // Retry the original request with the new token
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            return this.client(originalRequest);
                        }
                    } catch (refreshError) {
                        console.error('ApiClient: Refresh token expired or failed', refreshError);
                        // Refresh failed, fall through to logout
                    }
                }

                // If not 401, or refresh failed, force logout
                if (error.response?.status === 401) {
                    this.clearToken();
                    
                    // Clear out redux persist auth state to ensure clean logout
                    const persistDataString = localStorage.getItem('persist:root');
                    if (persistDataString) {
                        const persistData = JSON.parse(persistDataString);
                        persistData.auth = JSON.stringify({ user: null, token: null, refreshToken: null, isAuthenticated: false, loading: false });
                        localStorage.setItem('persist:root', JSON.stringify(persistData));
                    }
                    
                    window.location.href = '/login';
                }
                
                return Promise.reject(error.response?.data || error.response?.data?.message || error.message);
            }
        );
    }

    setToken(token: string) {
        this.token = token;
    }

    clearToken() {
        this.token = null;
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.client.get(url, config);
    }

    async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        return this.client.post(url, data, config);
    }

    async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        return this.client.put(url, data, config);
    }

    async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        return this.client.patch(url, data, config);
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.client.delete(url, config);
    }
}

export const apiClient = new ApiClient();
