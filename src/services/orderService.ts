import api from './api';
import type { Delivery } from '../types/models';

interface CreateOrderData {
    items: {
        produk_id: number;
        qty_kg: number;
    }[];
}

export const createOrder = async (data: CreateOrderData) => {
    try {
        const response = await api.post('/orders', data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to create order';
    }
};

export const getMyOrders = async () => {
    try {
        const response = await api.get('/orders/my');
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to fetch orders';
    }
};

export const getPetambakOrders = async () => {
    try {
        const response = await api.get('/orders/petambak');
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to fetch petambak orders';
    }
};

export const getPaymentToken = async (orderId: number) => {
    try {
        const response = await api.post('/orders/payment/token', { orderId });
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to get payment token';
    }
};

export const getAvailableDeliveries = async () => {
    try {
        const response = await api.get('/orders/deliveries/available');
        return response.data as Delivery[];
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to fetch available deliveries';
    }
};

export const getMyDeliveries = async () => {
    try {
        const response = await api.get('/orders/deliveries/my');
        return response.data as Delivery[];
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to fetch my deliveries';
    }
};

export const scanPickup = async (qrToken: string) => {
    try {
        const response = await api.post('/orders/scan/pickup', { token: qrToken });
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to process pickup scan';
    }
};

export const scanReceive = async (qrToken: string) => {
    try {
        const response = await api.post('/orders/scan/receive', { token: qrToken });
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to process receive scan';
    }
};

export const getOrderQR = async (orderId: number) => {
    try {
        const response = await api.get(`/orders/${orderId}/qr`);
        return response.data; // { pickup_qr, receive_qr }
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to fetch QR codes';
    }
};
