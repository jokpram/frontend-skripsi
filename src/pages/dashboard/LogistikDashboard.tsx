import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Scan, Truck, MapPin, Check, Package, DollarSign, User } from 'lucide-react';
import type { Delivery, Wallet } from '../../types/models';

const LogistikDashboard = () => {
    const [qrToken, setQrToken] = useState('');
    const [availableDeliveries, setAvailableDeliveries] = useState<Delivery[]>([]);
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

    const handleScanPickup = async (e: FormEvent) => {
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
        const styles: Record<string, string> = {
            'PENDING': 'bg-amber-100 text-amber-800',
            'PICKED_UP': 'bg-blue-100 text-blue-800',
            'DELIVERED': 'bg-emerald-100 text-emerald-800',
            'COMPLETED': 'bg-emerald-50 text-emerald-600',
        };
        return styles[status] || 'bg-slate-100 text-slate-600';
    };

    return (
        <div className="container mx-auto px-4 pt-24 pb-12 min-h-screen bg-slate-50">
            <header className="mb-8">
                <h1 className="text-4xl font-black text-emerald-900 mb-2">Dashboard Logistik</h1>
                <p className="text-slate-500 text-lg">Kelola pengiriman dan scan barang</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Wallet Section */}
                <section className="bg-gradient-to-br from-emerald-900 to-emerald-600 p-8 rounded-3xl text-white shadow-xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                            <DollarSign size={28} />
                        </div>
                        <h2 className="text-xl font-bold">Saldo Wallet</h2>
                    </div>
                    <p className="text-4xl font-black mb-2">
                        {wallet ? formatCurrency(wallet.balance) : 'Rp 0'}
                    </p>
                    <p className="text-emerald-100 text-sm opacity-80">Pendapatan dari pengiriman</p>

                    {wallet?.transactions && wallet.transactions.length > 0 && (
                        <div className="mt-6 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                            <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-70">Transaksi Terakhir:</p>
                            {wallet.transactions.slice(0, 3).map(tx => (
                                <div key={tx.id} className="flex justify-between text-sm py-1 border-b border-white/5 last:border-0">
                                    <span>{tx.source}</span>
                                    <span className={tx.type === 'CREDIT' ? 'text-emerald-200' : 'text-red-200'}>
                                        {tx.type === 'CREDIT' ? '+' : '-'}{formatCurrency(tx.amount)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Scan Pickup Section */}
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4 mb-6 text-emerald-600">
                        <div className="p-3 bg-emerald-50 rounded-2xl">
                            <Scan size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Scan Pickup</h2>
                    </div>
                    <p className="mb-6 text-slate-500 text-sm">
                        Masukkan token QR dari petambak saat mengambil barang.
                    </p>

                    <form onSubmit={handleScanPickup} className="space-y-4">
                        <Input
                            label="Token QR Pickup"
                            placeholder="Contoh: abc123-def456"
                            value={qrToken}
                            onChange={(e) => setQrToken(e.target.value)}
                        />
                        <Button type="submit" className="w-full">
                            <Check size={18} className="mr-2" /> Konfirmasi Pickup
                        </Button>
                    </form>
                </section>
            </div>

            {/* Deliveries Section */}
            <section className="mt-12">
                {/* Tab Navigation */}
                <div className="flex bg-slate-200/50 p-1.5 rounded-2xl mb-8 w-fit shadow-inner">
                    <button
                        onClick={() => setActiveTab('available')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === 'available' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-500'}`}
                    >
                        <Package size={18} /> Tersedia ({availableDeliveries.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('my')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === 'my' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-500'}`}
                    >
                        <Truck size={18} /> Pengiriman Saya ({myDeliveries.length})
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
                    </div>
                ) : activeTab === 'available' ? (
                    availableDeliveries.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package size={32} className="text-slate-400" />
                            </div>
                            <p className="text-slate-500 font-medium">Tidak ada pengiriman tersedia</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {availableDeliveries.map(delivery => (
                                <div key={delivery.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="flex-1 min-w-[200px]">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-bold text-lg text-slate-900">Order #{delivery.order_id}</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${getStatusStyle(delivery.status)}`}>
                                                {delivery.status}
                                            </span>
                                        </div>
                                        {delivery.Order?.OrderItems?.[0]?.UdangProduk?.BatchUdang?.Tambak && (
                                            <p className="text-sm text-slate-500 flex items-center gap-2 mb-1">
                                                <MapPin size={14} /> Dari: <span className="text-slate-700 font-medium">{delivery.Order.OrderItems[0].UdangProduk.BatchUdang.Tambak.nama_tambak}</span>
                                            </p>
                                        )}
                                        {delivery.Order?.Konsumen && (
                                            <p className="text-sm text-slate-500 flex items-center gap-2">
                                                <User size={14} /> Ke: <span className="text-slate-700 font-medium">{delivery.Order.Konsumen.name}</span> - {delivery.Order.Konsumen.address}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-slate-400 mb-1">{delivery.jarak_km} km</p>
                                        <p className="text-xl font-black text-emerald-600">
                                            {formatCurrency(Number(delivery.biaya_logistik))}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    myDeliveries.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Truck size={32} className="text-slate-400" />
                            </div>
                            <p className="text-slate-500 font-medium">Belum ada pengiriman</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {myDeliveries.map(delivery => (
                                <div key={delivery.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-bold text-lg text-slate-900">Order #{delivery.order_id}</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${getStatusStyle(delivery.status)}`}>
                                                {delivery.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500">Jarak: <span className="font-medium text-slate-700">{delivery.jarak_km} km</span></p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-black text-emerald-600">
                                            {formatCurrency(Number(delivery.biaya_logistik))}
                                        </p>
                                        {delivery.status === 'PICKED_UP' && (
                                            <p className="text-xs text-slate-500 mt-1 italic">
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
