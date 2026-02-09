import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTambaks, getBatches, createTambak, createBatch } from '../../services/tambakService';
import type { Tambak, BatchUdang } from '../../types/models';
import toast from 'react-hot-toast';

export const useTambaks = () => {
    return useQuery<Tambak[]>({
        queryKey: ['tambaks'],
        queryFn: getTambaks
    });
};

export const useBatches = () => {
    return useQuery<BatchUdang[]>({
        queryKey: ['batches'],
        queryFn: getBatches
    });
};

export const useCreateTambak = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTambak,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tambaks'] });
            toast.success('Tambak berhasil dibuat!');
        },
        onError: (err: any) => {
            toast.error(err || 'Gagal membuat tambak');
        }
    });
};

export const useCreateBatch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBatch,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['batches'] });
            queryClient.invalidateQueries({ queryKey: ['tambaks'] });
            toast.success('Batch udang berhasil ditambahkan!');
        },
        onError: (err: any) => {
            toast.error(err || 'Gagal membuat batch');
        }
    });
};
