import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from './RegisterPage';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import * as authService from '../../services/authService';

// Mock the services
vi.mock('../../services/authService', () => ({
    register: vi.fn(),
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

describe('RegisterPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderRegisterPage = () => {
        return render(
            <BrowserRouter>
                <RegisterPage />
            </BrowserRouter>
        );
    };

    it('renders the registration form correctly', () => {
        renderRegisterPage();
        expect(screen.getByText('Buat Akun Baru')).toBeInTheDocument();
        expect(screen.getByLabelText(/nama lengkap/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/nomor telepon/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/konfirmasi password/i)).toBeInTheDocument();
    });

    it('displays dynamic fields based on role selection', async () => {
        renderRegisterPage();

        // Default role is konsumen, so address should be visible
        expect(screen.getByLabelText(/alamat lengkap/i)).toBeInTheDocument();

        // Switch to logistik
        const logistikTab = screen.getByText('Logistik');
        fireEvent.click(logistikTab);

        expect(screen.queryByLabelText(/alamat lengkap/i)).not.toBeInTheDocument();
        expect(screen.getByLabelText(/jenis kendaraan/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/plat nomor/i)).toBeInTheDocument();
    });

    it('submits registration successfully', async () => {
        (authService.register as any).mockResolvedValue({});

        renderRegisterPage();

        fireEvent.change(screen.getByLabelText(/nama lengkap/i), { target: { value: 'Jane Doe', name: 'name' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com', name: 'email' } });
        fireEvent.change(screen.getByLabelText(/nomor telepon/i), { target: { value: '0812345678', name: 'phone' } });
        fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123', name: 'password' } });
        fireEvent.change(screen.getByLabelText(/konfirmasi password/i), { target: { value: 'password123', name: 'confirmPassword' } });
        fireEvent.change(screen.getByLabelText(/alamat lengkap/i), { target: { value: 'Street 123', name: 'address' } });

        fireEvent.click(screen.getByRole('button', { name: /daftar sekarang/i }));

        await waitFor(() => {
            expect(authService.register).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });

    it('shows error if password and confirm password do not match', async () => {
        renderRegisterPage();

        fireEvent.change(screen.getByLabelText(/nama lengkap/i), { target: { value: 'Jane Doe', name: 'name' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com', name: 'email' } });
        fireEvent.change(screen.getByLabelText(/nomor telepon/i), { target: { value: '0812345678', name: 'phone' } });
        fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123', name: 'password' } });
        fireEvent.change(screen.getByLabelText(/konfirmasi password/i), { target: { value: 'different', name: 'confirmPassword' } });
        fireEvent.change(screen.getByLabelText(/alamat lengkap/i), { target: { value: 'Street 123', name: 'address' } });

        fireEvent.click(screen.getByRole('button', { name: /daftar sekarang/i }));

        expect(screen.getByText('Password tidak sama')).toBeInTheDocument();
        expect(authService.register).not.toHaveBeenCalled();
    });
});
