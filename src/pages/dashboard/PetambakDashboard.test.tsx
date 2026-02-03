import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PetambakDashboard from './PetambakDashboard';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../../services/api';

// Mock the API service
vi.mock('../../services/api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe('PetambakDashboard', () => {
    const mockTambaks = [
        { id: 1, nama_tambak: 'Tambak A', lokasi: 'Banyuwangi', luas_m2: 1000, kapasitas_maks_kg: 5000, kapasitas_terpakai_kg: 2000 }
    ];
    const mockBatches = [
        { id: 1, tambak_id: 1, tanggal_tebar: '2024-01-01', usia_bibit_hari: 15, kualitas_air_ph: 7.5, estimasi_panen_kg: 1000, integrity: 'VALID' }
    ];
    const mockWallet = { balance: 500000 };
    const mockOrders = [
        { id: 1, status: 'PAID', total_harga: 100000, Konsumen: { name: 'John Buyer' }, Delivery: { id: 1 }, items: [] }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (api.get as any).mockImplementation((url: string) => {
            if (url === '/tambak') return Promise.resolve({ data: mockTambaks });
            if (url === '/tambak/batch') return Promise.resolve({ data: mockBatches });
            if (url === '/wallet/my') return Promise.resolve({ data: mockWallet });
            if (url === '/orders/petambak') return Promise.resolve({ data: mockOrders });
            return Promise.resolve({ data: [] });
        });
    });

    it('renders dashboard with data', async () => {
        render(<PetambakDashboard />);

        await waitFor(() => {
            expect(screen.getByText('Dashboard Petambak')).toBeInTheDocument();
            expect(screen.getByText('Tambak A')).toBeInTheDocument();
            expect(screen.getByText('Batch #1')).toBeInTheDocument();
            expect(screen.getByText('Rp 500.000')).toBeInTheDocument();
        });
    });

    it('opens create tambak modal', async () => {
        render(<PetambakDashboard />);
        const addButton = screen.getByText('Tambah Tambak');
        fireEvent.click(addButton);

        expect(screen.getByText('Tambah Tambak Baru')).toBeInTheDocument();
        expect(screen.getByLabelText('Nama Tambak')).toBeInTheDocument();
    });

    it('switches between tabs', async () => {
        render(<PetambakDashboard />);

        await waitFor(() => {
            expect(screen.getByText('Tambak & Batch')).toBeInTheDocument();
        });

        const ordersTab = screen.getByText(/Pesanan/);
        fireEvent.click(ordersTab);

        await waitFor(() => {
            expect(screen.getByText('Order #1')).toBeInTheDocument();
            expect(screen.getByText('PAID')).toBeInTheDocument();
        });
    });

    it('opens withdraw modal', async () => {
        render(<PetambakDashboard />);

        await waitFor(() => {
            const withdrawButton = screen.getByText('Tarik Saldo');
            fireEvent.click(withdrawButton);
        });

        expect(screen.getByRole('heading', { name: 'Tarik Saldo' })).toBeInTheDocument();
        expect(screen.getByLabelText('Jumlah Penarikan (Rp)')).toBeInTheDocument();
    });
});
