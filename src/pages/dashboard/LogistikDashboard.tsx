import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Scan, Truck, MapPin, Check, Package, DollarSign, ArrowRight, User } from 'lucide-react';
import type { Delivery, Wallet } from '../../types/models';

const LogistikDashboard = () => {
    const [qrToken, setQrToken] = useState('');
    const [availableDeliveries, setAvailableDeliveries] = useState<any[]>([]);
    const [myDeliveries, setMyDeliveries] = useState<Delivery[]>([]);
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'available' | 'my'>('available');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [walletRes, availableRes, myRes] = await Promise.all([
                api.get('/wallet/my'),
                api.get('/orders/deliveries/available'),
                api.get('/orders/deliveries/my')
            ]);
            setWallet(walletRes.data);
            setAvailableDeliveries(availableRes.data);
            setMyDeliveries(myRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleScanPickup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!qrToken.trim()) {
            toast.error('Masukkan token QR');
            return;
        }
        try {
            await api.post('/orders/scan/pickup', { qr_token: qrToken });
            toast.success('Pickup berhasil! Pengiriman dimulai.');
            setQrToken('');
            fetchData();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Gagal scan pickup');
        }
    };

    const formatCurrency = (amount: number) => {
        return `Rp ${Number(amount).toLocaleString('id-ID')}`;
    };

    const getStatusStyle = (status: string) => {
        const styles: Record<string, { bg: string; color: string }> = {
            'PENDING': { bg: '#fef3c7', color: '#92400e' },
            'PICKED_UP': { bg: '#dbeafe', color: '#1e40af' },
            'DELIVERED': { bg: '#d1fae5', color: '#065f46' },
            'COMPLETED': { bg: '#ecfdf5', color: '#059669' },
        };
        return styles[status] || { bg: '#f3f4f6', color: '#6b7280' };
    };

    return (
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '3rem' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#064e3b' }}>Dashboard Logistik</h1>
                <p style={{ color: '#6b7280' }}>Kelola pengiriman dan scan barang</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                {/* Wallet Section */}
                <section style={{ background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)', padding: '2rem', borderRadius: '1rem', color: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <DollarSign size={28} />
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Saldo Wallet</h2>
                    </div>
                    <p style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                        {wallet ? formatCurrency(wallet.balance) : 'Rp 0'}
                    </p>
                    <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Pendapatan dari pengiriman</p>

                    {wallet?.transactions && wallet.transactions.length > 0 && (
                        <div style={{ marginTop: '1.5rem', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '1rem' }}>
                            <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Transaksi Terakhir:</p>
                            {wallet.transactions.slice(0, 3).map(tx => (
                                <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.25rem 0' }}>
                                    <span>{tx.source}</span>
                                    <span style={{ color: tx.type === 'CREDIT' ? '#a7f3d0' : '#fca5a5' }}>
                                        {tx.type === 'CREDIT' ? '+' : '-'}{formatCurrency(tx.amount)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Scan Pickup Section */}
                <section style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', color: '#059669' }}>
                        <Scan size={32} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Scan Pickup</h2>
                    </div>
                    <p style={{ marginBottom: '1.5rem', color: '#6b7280', fontSize: '0.9rem' }}>
                        Masukkan token QR dari petambak saat mengambil barang.
                    </p>

                    <form onSubmit={handleScanPickup}>
                        <Input
                            label="Token QR Pickup"
                            placeholder="Contoh: abc123-def456"
                            value={qrToken}
                            onChange={(e) => setQrToken(e.target.value)}
                        />
                        <Button type="submit" style={{ width: '100%' }}>
                            <Check size={18} /> Konfirmasi Pickup
                        </Button>
                    </form>
                </section>
            </div>

            {/* Deliveries Section */}
            <section style={{ marginTop: '2rem' }}>
                {/* Tab Navigation */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', backgroundColor: '#f3f4f6', padding: '0.25rem', borderRadius: '0.75rem', width: 'fit-content' }}>
                    <button
                        onClick={() => setActiveTab('available')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: activeTab === 'available' ? 'white' : 'transparent',
                            color: activeTab === 'available' ? '#059669' : '#6b7280',
                            fontWeight: activeTab === 'available' ? 600 : 400,
                            boxShadow: activeTab === 'available' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                        }}
                    >
                        <Package size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        Tersedia ({availableDeliveries.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('my')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: activeTab === 'my' ? 'white' : 'transparent',
                            color: activeTab === 'my' ? '#059669' : '#6b7280',
                            fontWeight: activeTab === 'my' ? 600 : 400,
                            boxShadow: activeTab === 'my' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                        }}
                    >
                        <Truck size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        Pengiriman Saya ({myDeliveries.length})
                    </button>
                </div>

                {isLoading ? (
                    <p style={{ color: '#6b7280' }}>Memuat...</p>
                ) : activeTab === 'available' ? (
                    availableDeliveries.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', backgroundColor: 'white', borderRadius: '1rem' }}>
                            <Package size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p>Tidak ada pengiriman tersedia</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {availableDeliveries.map(delivery => (
                                <div key={delivery.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div style={{ flex: 1, minWidth: '200px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Order #{delivery.order_id}</span>
                                            <span style={{ ...getStatusStyle(delivery.status), fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '1rem', fontWeight: 600 }}>
                                                {delivery.status}
                                            </span>
                                        </div>
                                        {delivery.Order?.OrderItems?.[0]?.UdangProduk?.BatchUdang?.Tambak && (
                                            <p style={{ fontSize: '0.85rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <MapPin size={14} /> Dari: {delivery.Order.OrderItems[0].UdangProduk.BatchUdang.Tambak.nama_tambak}
                                            </p>
                                        )}
                                        {delivery.Order?.Konsumen && (
                                            <p style={{ fontSize: '0.85rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <User size={14} /> Ke: {delivery.Order.Konsumen.name} - {delivery.Order.Konsumen.address}
                                            </p>
                                        )}
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>{delivery.jarak_km} km</p>
                                        <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#059669' }}>
                                            {formatCurrency(Number(delivery.biaya_logistik))}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    myDeliveries.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', backgroundColor: 'white', borderRadius: '1rem' }}>
                            <Truck size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p>Belum ada pengiriman</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {myDeliveries.map(delivery => (
                                <div key={delivery.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Order #{delivery.order_id}</span>
                                            <span style={{
                                                backgroundColor: getStatusStyle(delivery.status).bg,
                                                color: getStatusStyle(delivery.status).color,
                                                fontSize: '0.7rem',
                                                padding: '0.2rem 0.5rem',
                                                borderRadius: '1rem',
                                                fontWeight: 600
                                            }}>
                                                {delivery.status}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Jarak: {delivery.jarak_km} km</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#059669' }}>
                                            {formatCurrency(Number(delivery.biaya_logistik))}
                                        </p>
                                        {delivery.status === 'PICKED_UP' && (
                                            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                                Berikan QR ke konsumen untuk selesaikan
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </section>
        </div>
    );
};

export default LogistikDashboard;
