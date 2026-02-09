import api from './api';
import type { UdangProduk, BatchUdang } from '../types/models';

export const createProduct = async (data: Partial<UdangProduk>) => {
    try {
        const response = await api.post('/products', data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to create product';
    }
};

export const getProducts = async (params?: any) => {
    try {
        const response = await api.get('/products', { params });
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to fetch products';
    }
};

export const getProductTrace = async (batchId: string | number) => {
    try {
        const response = await api.get(`/products/trace/${batchId}`);
        return response.data as BatchUdang;
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to fetch product trace';
    }
};
