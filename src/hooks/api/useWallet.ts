import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import type { Wallet, WithdrawRequest } from '../../types/models';
import toast from 'react-hot-toast';

export const useMyWallet = () => {
    return useQuery<Wallet>({
        queryKey: ['wallet', 'my'],
        queryFn: async () => {
            const res = await api.get('/wallet/my');
            return res.data;
        }
    });
};

export const useWithdrawRequests = () => {
    return useQuery<WithdrawRequest[]>({
        queryKey: ['wallet', 'withdrawals'],
        queryFn: async () => {
            const res = await api.get('/wallet/withdraw');
            return res.data;
        }
    });
};

export const useRequestWithdraw = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { amount: string; bank_account: string }) => {
            const res = await api.post('/wallet/withdraw', data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wallet', 'my'] });
            queryClient.invalidateQueries({ queryKey: ['wallet', 'withdrawals'] });
            toast.success('Permintaan penarikan berhasil diajukan!');
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Gagal mengajukan penarikan');
        }
    });
};

export const useProcessWithdraw = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, action }: { id: number, action: 'APPROVE' | 'REJECT' }) => {
            const res = await api.post(`/wallet/withdraw/${id}/process`, { action });
            return res.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['wallet', 'withdrawals'] });
            queryClient.invalidateQueries({ queryKey: ['wallet', 'my'] });
            toast.success(`Penarikan ${variables.action === 'APPROVE' ? 'disetujui' : 'ditolak'}!`);
        },
        onError: () => {
            toast.error('Gagal memproses penarikan');
        }
    });
};
