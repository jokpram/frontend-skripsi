import { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Scan, Truck, MapPin } from 'lucide-react';
import api from '../../services/api';

const LogistikDashboard = () => {
    const [orderIdScan, setOrderIdScan] = useState('');

    const handleScanPickup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/orders/scan/pickup', { orderId: orderIdScan });
            alert('Scan Pickup Berhasil! Pengiriman dimulai.');
            setOrderIdScan('');
        } catch (err) {
            alert('Gagal scan pickup. Pastikan ID Order benar.');
        }
    };

    return (
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '3rem' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#064e3b' }}>Dashboard Logistik</h1>
                <p style={{ color: '#6b7280' }}>Kelola pengiriman dan scan barang</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Scan Section */}
                <section style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', color: '#059669' }}>
                        <Scan size={32} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Scan Pickup</h2>
                    </div>
                    <p style={{ marginBottom: '1.5rem', color: '#6b7280' }}>Masukkan ID Order atau Scan QR Code saat mengambil barang dari petambak.</p>

                    <form onSubmit={handleScanPickup}>
                        <Input
                            label="ID Order"
                            placeholder="Contoh: 12345"
                            value={orderIdScan}
                            onChange={(e) => setOrderIdScan(e.target.value)}
                        />
                        <Button type="submit" style={{ width: '100%' }}>Simpan Status Pickup</Button>
                    </form>
                </section>

                {/* Active Deliveries Placeholder */}
                <section style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', color: '#059669' }}>
                        <Truck size={32} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Pengiriman Aktif</h2>
                    </div>
                    {/* Mock Data */}
                    <div style={{ padding: '1rem', border: '1px solid #f3f4f6', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: 600 }}>Order #1024</span>
                            <span style={{ fontSize: '0.75rem', backgroundColor: '#dbeafe', color: '#1e40af', padding: '0.25rem 0.5rem', borderRadius: '1rem' }}>In Transit</span>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <MapPin size={14} /> Menuju Jakarta Pusat
                        </div>
                    </div>
                    <div style={{ padding: '1rem', border: '1px solid #f3f4f6', borderRadius: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: 600 }}>Order #1025</span>
                            <span style={{ fontSize: '0.75rem', backgroundColor: '#fef3c7', color: '#92400e', padding: '0.25rem 0.5rem', borderRadius: '1rem' }}>Waiting Pickup</span>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <MapPin size={14} /> Lokasi: Tambak Makmur
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LogistikDashboard;
