import { apiClient } from './apiClient';

export interface Product {
    id: string;
    title: string;
    brand: string;
    price: string | number;
    image_url: string;
    category_id: string;
    description: string;
    details: string;
    usage_instructions: string;
    benefits: string[];
    is_active: boolean;
    is_featured: boolean;
    stock_quantity: number;
    category_name?: string;
    created_at?: string;
}

export interface ProductCategory {
    id: string;
    name: string;
    slug: string;
}

export interface PaginatedResponse {
    data: any;
    pagination: {
        total: number;
        page: number;
        pages: number;
        limit: number;
    };
}

export const productService = {
    getProducts: async (params?: { category_id?: string; search?: string; sort?: string; page?: number; limit?: number; featured?: boolean; include_inactive?: boolean }) => {
        return apiClient.get<PaginatedResponse>('/products', { params });
    },
    
    getProduct: async (id: string) => {
        return apiClient.get<{ data: Product }>(`/products/${id}`);
    },

    getCategories: async () => {
        return apiClient.get<{ data: ProductCategory[] }>('/products/categories');
    },

    getBrands: async () => {
        return apiClient.get<{ data: { brands: string[] } }>('/products/brands');
    },

    // Admin endpoints
    createProduct: async (data: Partial<Product>) => {
        return apiClient.post<{ data: Product }>('/products', data);
    },

    updateProduct: async (id: string, data: Partial<Product>) => {
        return apiClient.put<{ data: Product }>(`/products/${id}`, data);
    },

    deleteProduct: async (id: string) => {
        return apiClient.delete(`/products/${id}`);
    }
};
