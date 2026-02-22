import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const useRequestProductUpdate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ productId, data }: { productId: number, data: any }) => {
            const res = await api.post(`/products/${productId}/request-update`, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Permintaan pembaruan dikirim ke admin');
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Gagal mengirim permintaan');
        }
    });
};

export const useRequestLogistikPriceUpdate = () => {
    return useMutation({
        mutationFn: async (data: { shipping_cost_per_km: number }) => {
            const res = await api.post(`/logistik/request-price-update`, data);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Permintaan pembaruan harga dikirim ke admin');
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Gagal mengirim permintaan');
        }
    });
};

export const useAdminChangeRequests = () => {
    return useQuery({
        queryKey: ['admin', 'change-requests'],
        queryFn: async () => {
            const res = await api.get('/admin/change-requests');
            return res.data;
        }
    });
};

export const useProcessChangeRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ requestId, action }: { requestId: number, action: 'approve' | 'reject' }) => {
            const res = await api.post(`/admin/change-requests/${requestId}/${action}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'change-requests'] });
            toast.success('Permintaan berhasil diproses');
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Gagal memproses permintaan');
        }
    });
};
