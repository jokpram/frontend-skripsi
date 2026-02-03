import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './LoginPage';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';
import * as authService from '../../services/authService';

// Mock the services
vi.mock('../../services/authService', () => ({
    login: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe('LoginPage', () => {
    let store: any;

    beforeEach(() => {
        vi.clearAllMocks();
        store = configureStore({
            reducer: {
                auth: authReducer,
            },
        });
    });

    const renderLoginPage = () => {
        return render(
            <Provider store={store}>
                <BrowserRouter>
                    <LoginPage />
                </BrowserRouter>
            </Provider>
        );
    };

    it('renders the login form correctly', () => {
        renderLoginPage();
        expect(screen.getByText('Selamat Datang')).toBeInTheDocument();
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /masuk ke dashboard/i })).toBeInTheDocument();
    });

    it('submits the form successfully', async () => {
        const mockUser = { name: 'John Doe', token: 'mock-token', role: 'konsumen' };
        (authService.login as any).mockResolvedValue(mockUser);

        renderLoginPage();

        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'user@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /masuk ke dashboard/i }));

        await waitFor(() => {
            expect(authService.login).toHaveBeenCalledWith('konsumen', {
                email: 'user@example.com',
                password: 'password123'
            });
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('displays error message on login failure', async () => {
        (authService.login as any).mockRejectedValue({
            response: { data: { message: 'Invalid credentials' } }
        });

        renderLoginPage();

        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'user@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong-password' } });
        fireEvent.click(screen.getByRole('button', { name: /masuk ke dashboard/i }));

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });
    });
});
