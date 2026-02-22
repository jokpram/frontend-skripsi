import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import type { UdangProduk } from '../../types/models';

export const useMyProducts = () => {
    return useQuery<UdangProduk[]>({
        queryKey: ['my-products'],
        queryFn: async () => {
            const res = await api.get('/products/my');
            return res.data;
        }
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Partial<UdangProduk>) => {
            const res = await api.post('/products', data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-products'] });
        }
    });
};
