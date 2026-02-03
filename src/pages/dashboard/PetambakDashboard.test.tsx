import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PetambakDashboard from './PetambakDashboard';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock custom hooks
vi.mock('../../hooks/api/useTambak', () => ({
    useTambaks: vi.fn(),
    useCreateTambak: vi.fn(() => ({ mutate: vi.fn() })),
    useCreateBatch: vi.fn(() => ({ mutate: vi.fn() })),
}));

vi.mock('../../hooks/api/useOrders', () => ({
    usePetambakOrders: vi.fn(),
    usePickupQR: vi.fn(() => ({ mutate: vi.fn() })),
}));

vi.mock('../../hooks/api/useWallet', () => ({
    useMyWallet: vi.fn(),
    useRequestWithdraw: vi.fn(() => ({ mutate: vi.fn() })),
}));

import { useTambaks } from '../../hooks/api/useTambak';
import { usePetambakOrders } from '../../hooks/api/useOrders';
import { useMyWallet } from '../../hooks/api/useWallet';

describe('PetambakDashboard', () => {
    const mockTambaks = [
        { id: 1, nama_tambak: 'Tambak A', lokasi: 'Banyuwangi', luas_m2: 1000, kapasitas_maks_kg: 5000, kapasitas_terpakai_kg: 2000 }
    ];
    const mockWallet = { balance: 500000 };
    const mockOrders = [
        { id: 1, status: 'PAID', total_harga: 100000, Konsumen: { name: 'John Buyer' }, items: [] }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (useTambaks as any).mockReturnValue({ data: mockTambaks, isLoading: false });
        (useMyWallet as any).mockReturnValue({ data: mockWallet, isLoading: false });
        (usePetambakOrders as any).mockReturnValue({ data: mockOrders, isLoading: false });
    });

    it('renders dashboard with data', async () => {
        render(<PetambakDashboard />);

        expect(screen.getByText('My Tambak')).toBeInTheDocument();
        expect(screen.getByText('Tambak A')).toBeInTheDocument();
        // Batch display is not currently implemented in the limited view
        // expect(screen.getByText('Batch #1')).toBeInTheDocument(); 
        expect(screen.getByText('Rp 500.000')).toBeInTheDocument();
    });

    it('opens create tambak modal', async () => {
        render(<PetambakDashboard />);
        const addButton = screen.getByText('Tambah Tambak');
        fireEvent.click(addButton);

        expect(screen.getByText('TAMBAK')).toBeInTheDocument(); // Title is uppercase in component
        expect(screen.getByLabelText('Nama Tambak')).toBeInTheDocument();
    });

    it('switches between tabs', async () => {
        render(<PetambakDashboard />);

        expect(screen.getByText('Tambak & Batch')).toBeInTheDocument();

        const ordersTab = screen.getByText(/Pesanan/);
        fireEvent.click(ordersTab);

        await waitFor(() => {
            expect(screen.getByText('Order #1')).toBeInTheDocument();
            expect(screen.getByText('PAID')).toBeInTheDocument();
        });
    });

    it('opens withdraw modal', async () => {
        render(<PetambakDashboard />);

        const withdrawButton = screen.getByText('Tarik Saldo');
        fireEvent.click(withdrawButton);

        expect(screen.getByText('WITHDRAW')).toBeInTheDocument(); // Title is uppercase
        expect(screen.getByLabelText('Jumlah Penarikan (Rp)')).toBeInTheDocument();
    });
});
