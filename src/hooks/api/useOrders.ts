import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const usePetambakOrders = () => {
    return useQuery({
        queryKey: ['orders', 'petambak'],
        queryFn: async () => {
            const res = await api.get('/orders/petambak');
            return res.data;
        }
    });
};

export const usePickupQR = () => {
    return useMutation({
        mutationFn: async (orderId: number) => {
            const res = await api.get(`/orders/${orderId}/qr`);
            return res.data;
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Gagal memuat QR');
        }
    });
};

export const useAdminPendingUsers = () => {
    return useQuery({
        queryKey: ['admin', 'pending-users'],
        queryFn: async () => {
            const res = await api.get('/admin/pending-users');
            return res.data;
        }
    });
};

export const useVerifyUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ userId, role, action }: { userId: number, role: string, action: 'approve' | 'reject' }) => {
            const res = await api.post('/admin/verify-user', { userId, role, action });
            return res.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'pending-users'] });
            toast.success(`User ${variables.action === 'approve' ? 'disetujui' : 'ditolak'} sukses!`);
        },
        onError: () => {
            toast.error('Gagal memproses verifikasi pengguna');
        }
    });
};
