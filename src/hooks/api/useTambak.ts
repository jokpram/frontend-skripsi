import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import type { Tambak, BatchUdang } from '../../types/models';
import toast from 'react-hot-toast';

export const useTambaks = () => {
    return useQuery<Tambak[]>({
        queryKey: ['tambaks'],
        queryFn: async () => {
            const res = await api.get('/tambak');
            return res.data;
        }
    });
};

export const useBatches = () => {
    return useQuery<BatchUdang[]>({
        queryKey: ['batches'],
        queryFn: async () => {
            const res = await api.get('/tambak/batch');
            return res.data;
        }
    });
};

export const useCreateTambak = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newTambak: any) => {
            const res = await api.post('/tambak', newTambak);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tambaks'] });
            toast.success('Tambak berhasil dibuat!');
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Gagal membuat tambak');
        }
    });
};

export const useCreateBatch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newBatch: any) => {
            const res = await api.post('/tambak/batch', newBatch);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['batches'] });
            queryClient.invalidateQueries({ queryKey: ['tambaks'] });
            toast.success('Batch udang berhasil ditambahkan!');
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Gagal membuat batch');
        }
    });
};
