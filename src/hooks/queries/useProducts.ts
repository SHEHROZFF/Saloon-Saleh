import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService, Product } from '../../services/api/productService';

export const useGetProducts = (params?: { category_id?: string; search?: string; sort?: string; page?: number; limit?: number; featured?: boolean; include_inactive?: boolean }) => {
    return useQuery({
        queryKey: ['products', params],
        queryFn: () => productService.getProducts(params),
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
    });
};

export const useGetProduct = (id: string) => {
    return useQuery({
        queryKey: ['products', id],
        queryFn: () => productService.getProduct(id),
        enabled: !!id,
    });
};

export const useGetProductCategories = () => {
    return useQuery({
        queryKey: ['productCategories'],
        queryFn: () => productService.getCategories(),
        staleTime: 1000 * 60 * 60, // 1 hour
        refetchOnWindowFocus: false,
    });
};

export const useGetBrands = () => {
    return useQuery({
        queryKey: ['productBrands'],
        queryFn: () => productService.getBrands(),
        staleTime: 1000 * 60 * 60, // 1 hour
        refetchOnWindowFocus: false,
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<Product>) => productService.createProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => productService.updateProduct(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => productService.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};
