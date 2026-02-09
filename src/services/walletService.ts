import api from './api';
import type { Wallet, WithdrawRequest } from '../types/models';

export const getMyWallet = async () => {
    try {
        const response = await api.get('/wallet/my');
        return response.data as Wallet;
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to fetch wallet';
    }
};

export const requestWithdraw = async (amount: number, bank_account: string) => {
    try {
        const response = await api.post('/wallet/withdraw', { amount, bank_account });
        return response.data as WithdrawRequest;
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to request withdraw';
    }
};

export const getWithdrawRequests = async () => {
    try {
        const response = await api.get('/wallet/withdraw');
        return response.data as WithdrawRequest[];
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to fetch withdraw requests';
    }
};

export const processWithdraw = async (requestId: number, status: 'APPROVED' | 'REJECTED') => {
    try {
        const response = await api.post(`/wallet/withdraw/${requestId}/process`, { status });
        return response.data as WithdrawRequest;
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to process withdraw request';
    }
};
