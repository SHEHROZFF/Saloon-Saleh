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
            error => {
                if (error.response?.status === 401) {
                    this.clearToken();
                    window.location.href = '/login';
                }
                return Promise.reject(error.response?.data || error.message);
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
