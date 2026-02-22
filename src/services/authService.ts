import api from './api';
import type { User } from '../types/models';

interface LoginCredentials {
    email: string;
    password: string;
}



interface AuthResponse {
    user: User;
    token: string;
}

export const login = async (role: string, credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
        const response = await api.post(`/auth/login/${role}`, credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || 'Login failed';
    }
};

export const register = async (role: string, data: any): Promise<AuthResponse> => {
    try {
        const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
        const response = await api.post(`/auth/register/${role}`, data, config);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || 'Registration failed';
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getProfile = async () => {
    try {
        const response = await api.get('/auth/profile');
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to fetch profile';
    }
};

export const updateProfile = async (data: FormData) => {
    try {
        const response = await api.put('/auth/profile', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || 'Failed to update profile';
    }
};
