import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyWallet, getWithdrawRequests, requestWithdraw, processWithdraw } from '../../services/walletService';
import type { Wallet, WithdrawRequest } from '../../types/models';
import toast from 'react-hot-toast';

export const useMyWallet = () => {
    return useQuery<Wallet>({
        queryKey: ['wallet', 'my'],
        queryFn: getMyWallet
    });
};

export const useWithdrawRequests = () => {
    return useQuery<WithdrawRequest[]>({
        queryKey: ['wallet', 'withdrawals'],
        queryFn: getWithdrawRequests
    });
};

export const useRequestWithdraw = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { amount: string | number; bank_account: string }) =>
            requestWithdraw(Number(data.amount), data.bank_account),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wallet', 'my'] });
            queryClient.invalidateQueries({ queryKey: ['wallet', 'withdrawals'] });
            toast.success('Permintaan penarikan berhasil diajukan!');
        },
        onError: (err: any) => {
            toast.error(err || 'Gagal mengajukan penarikan');
        }
    });
};

export const useProcessWithdraw = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, action }: { id: number, action: 'APPROVED' | 'REJECTED' }) =>
            processWithdraw(id, action),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['wallet', 'withdrawals'] });
            queryClient.invalidateQueries({ queryKey: ['wallet', 'my'] });
            toast.success(`Penarikan ${variables.action === 'APPROVED' ? 'disetujui' : 'ditolak'}!`);
        },
        onError: () => {
            toast.error('Gagal memproses penarikan');
        }
    });
};
