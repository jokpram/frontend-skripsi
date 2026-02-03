import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './LoginPage';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import * as authService from '../../services/authService';
import * as authContext from '../../context/AuthContext';

// Mock the services and context
vi.mock('../../services/authService', () => ({
    login: vi.fn(),
}));

vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({
        login: vi.fn(),
    }),
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
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderLoginPage = () => {
        return render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );
    };

    it('renders the login form correctly', () => {
        renderLoginPage();
        expect(screen.getByText('Selamat Datang')).toBeInTheDocument();
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /masuk ke dashboard/i })).toBeInTheDocument();
    });

    it('allows changing roles', () => {
        renderLoginPage();
        const petambakTab = screen.getByText('Petambak');
        fireEvent.click(petambakTab);

        // Check if petambak tab is selected (style check)
        expect(petambakTab.style.backgroundColor).toBe('white');
        expect(petambakTab.style.color).toBe('rgb(5, 150, 105)'); // #059669
    });

    it('updates form fields on input', () => {
        renderLoginPage();
        const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;
        const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;

        fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(emailInput.value).toBe('user@example.com');
        expect(passwordInput.value).toBe('password123');
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
