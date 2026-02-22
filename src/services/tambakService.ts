import api from './api';
import type { Tambak, BatchUdang } from '../types/models';

export const createTambak = async (data: Partial<Tambak>) => {
    try {
        const response = await api.post('/tambak', data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to create tambak';
    }
};

export const getTambaks = async () => {
    try {
        const response = await api.get('/tambak');
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to fetch tambaks';
    }
};

export const createBatch = async (data: Partial<BatchUdang>) => {
    try {
        const response = await api.post('/tambak/batch', data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to create batch';
    }
};

export const getBatches = async () => {
    try {
        const response = await api.get('/tambak/batch');
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to fetch batches';
    }
};

export const updateHarvest = async (batchId: number, data: { tanggal_panen: string; estimasi_panen_kg?: number; total_umur_panen_hari?: number }) => {
    try {
        const response = await api.put(`/tambak/batch/${batchId}/harvest`, data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to update harvest';
    }
};
