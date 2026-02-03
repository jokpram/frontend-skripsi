import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Plus, Package, MapPin, Leaf, Droplets, Calendar, Hash, DollarSign, TrendingUp, ShoppingBag, QrCode, Banknote } from 'lucide-react';
import type { Tambak, BatchUdang, Wallet } from '../../types/models';

const PetambakDashboard = () => {
    const [tambaks, setTambaks] = useState<Tambak[]>([]);
    const [batches, setBatches] = useState<BatchUdang[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [activeTab, setActiveTab] = useState<'tambak' | 'orders'>('tambak');

    const [showTambakModal, setShowTambakModal] = useState(false);
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);

    const [selectedTambakId, setSelectedTambakId] = useState<number | null>(null);
    const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);
    const [qrData, setQrData] = useState<{ token: string; image: string } | null>(null);

    const [newTambak, setNewTambak] = useState({
        nama_tambak: '',
        lokasi: '',
        luas_m2: '',
        kapasitas_maks_kg: '',
        latitude: -8.1234,
        longitude: 114.1234
    });

    const [newBatch, setNewBatch] = useState({
        tanggal_tebar: '',
        usia_bibit_hari: '',
        asal_bibit: '',
        kualitas_air_ph: '',
        kualitas_air_salinitas: '',
        estimasi_panen_kg: ''
    });

    const [newProduct, setNewProduct] = useState({
        jenis_udang: '',
        grade: 'A',
        harga_per_kg: '',
        stok_kg: ''
    });

    const [withdrawData, setWithdrawData] = useState({
        amount: '',
        bank_account: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [tambakRes, batchRes, walletRes, ordersRes] = await Promise.all([
                api.get('/tambak'),
                api.get('/tambak/batch'),
                api.get('/wallet/my').catch(() => ({ data: null })),
                api.get('/orders/petambak').catch(() => ({ data: [] }))
            ]);
            setTambaks(tambakRes.data);
            setBatches(batchRes.data);
            setWallet(walletRes.data);
            setOrders(ordersRes.data);
        } catch (err: any) {
            console.error(err);
        }
    };

    const handleCreateTambak = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/tambak', newTambak);
            setTambaks([...tambaks, res.data]);
            setShowTambakModal(false);
            setNewTambak({ nama_tambak: '', lokasi: '', luas_m2: '', kapasitas_maks_kg: '', latitude: -8.1234, longitude: 114.1234 });
            toast.success('Tambak berhasil dibuat!');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Gagal membuat tambak');
        }
    };

    const handleCreateBatch = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = { ...newBatch, tambak_id: selectedTambakId };
            const res = await api.post('/tambak/batch', payload);
            setBatches([...batches, res.data]);
            setShowBatchModal(false);
            setNewBatch({ tanggal_tebar: '', usia_bibit_hari: '', asal_bibit: '', kualitas_air_ph: '', kualitas_air_salinitas: '', estimasi_panen_kg: '' });
            toast.success('Batch udang berhasil ditambahkan!');
            fetchData();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Gagal membuat batch');
        }
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = { ...newProduct, batch_id: selectedBatchId };
            await api.post('/products', payload);
            setShowProductModal(false);
            setNewProduct({ jenis_udang: '', grade: 'A', harga_per_kg: '', stok_kg: '' });
            toast.success('Produk berhasil dipublikasikan ke marketplace!');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Gagal membuat produk');
        }
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/wallet/withdraw', withdrawData);
            setShowWithdrawModal(false);
            setWithdrawData({ amount: '', bank_account: '' });
            toast.success('Permintaan penarikan berhasil diajukan!');
            fetchData();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Gagal mengajukan penarikan');
        }
    };

    const showPickupQR = async (orderId: number) => {
        try {
            const res = await api.get(`/orders/${orderId}/qr`);
            setQrData({ token: res.data.token, image: res.data.image });
            setShowQRModal(true);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Gagal memuat QR');
        }
    };

    const openBatchModal = (tambakId: number) => {
        setSelectedTambakId(tambakId);
        setShowBatchModal(true);
    };

    const openProductModal = (batchId: number) => {
        setSelectedBatchId(batchId);
        setShowProductModal(true);
    };

    const formatCurrency = (amount: number) => `Rp ${Number(amount).toLocaleString('id-ID')}`;

    const getStatusStyle = (status: string) => {
        const styles: Record<string, { bg: string; color: string }> = {
            'PENDING': { bg: '#fef3c7', color: '#92400e' },
            'PAID': { bg: '#dbeafe', color: '#1e40af' },
            'SHIPPED': { bg: '#e0e7ff', color: '#3730a3' },
            'DELIVERED': { bg: '#d1fae5', color: '#065f46' },
            'COMPLETED': { bg: '#ecfdf5', color: '#059669' },
        };
        return styles[status] || { bg: '#f3f4f6', color: '#6b7280' };
    };

    return (
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '3rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#064e3b' }}>Dashboard Petambak</h1>
                    <p style={{ color: '#6b7280' }}>Kelola tambak, batch, dan penjualan udang Anda</p>
                </div>
                <Button onClick={() => setShowTambakModal(true)}>
                    <Plus size={20} /> Tambah Tambak
                </Button>
            </header>

            {/* Wallet Card */}
            {wallet && (
                <section style={{ background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)', padding: '1.5rem 2rem', borderRadius: '1rem', color: 'white', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <DollarSign size={32} />
                        <div>
                            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Saldo Wallet</p>
                            <p style={{ fontSize: '1.75rem', fontWeight: 800 }}>{formatCurrency(wallet.balance)}</p>
                        </div>
                    </div>
                    <Button variant="outline" style={{ borderColor: 'white', color: 'white' }} onClick={() => setShowWithdrawModal(true)}>
                        <Banknote size={18} /> Tarik Saldo
                    </Button>
                </section>
            )}

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', backgroundColor: '#f3f4f6', padding: '0.25rem', borderRadius: '0.75rem', width: 'fit-content' }}>
                <button onClick={() => setActiveTab('tambak')} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', backgroundColor: activeTab === 'tambak' ? 'white' : 'transparent', color: activeTab === 'tambak' ? '#059669' : '#6b7280', fontWeight: activeTab === 'tambak' ? 600 : 400, boxShadow: activeTab === 'tambak' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
                    <Package size={16} style={{ display: 'inline', marginRight: '0.5rem' }} /> Tambak & Batch
                </button>
                <button onClick={() => setActiveTab('orders')} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', backgroundColor: activeTab === 'orders' ? 'white' : 'transparent', color: activeTab === 'orders' ? '#059669' : '#6b7280', fontWeight: activeTab === 'orders' ? 600 : 400, boxShadow: activeTab === 'orders' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
                    <ShoppingBag size={16} style={{ display: 'inline', marginRight: '0.5rem' }} /> Pesanan ({orders.length})
                </button>
            </div>

            {activeTab === 'tambak' ? (
                <>
                    {/* Tambak List */}
                    <section style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#1f2937' }}>Daftar Tambak Saya</h2>
                        {tambaks.length === 0 ? (
                            <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>Belum ada tambak.</p>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                                {tambaks.map((tambak) => (
                                    <div key={tambak.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #f3f4f6' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{tambak.nama_tambak}</h3>
                                            <span style={{ color: '#059669', backgroundColor: '#ecfdf5', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', fontSize: '0.7rem', fontWeight: 600 }}>Aktif</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                            <MapPin size={14} /> {tambak.lokasi}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '1rem' }}>
                                            <p>Luas: {tambak.luas_m2} m² | Kapasitas: {tambak.kapasitas_maks_kg} kg</p>
                                            <div style={{ marginTop: '0.5rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem', height: '6px', overflow: 'hidden' }}>
                                                <div style={{ backgroundColor: '#059669', height: '100%', width: `${Math.min((tambak.kapasitas_terpakai_kg / tambak.kapasitas_maks_kg) * 100, 100)}%` }} />
                                            </div>
                                            <p style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>{tambak.kapasitas_terpakai_kg}/{tambak.kapasitas_maks_kg} kg terpakai</p>
                                        </div>
                                        <Button variant="outline" style={{ width: '100%', fontSize: '0.85rem' }} onClick={() => openBatchModal(tambak.id)}>
                                            <Plus size={16} /> Tambah Batch Udang
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Batch List */}
                    <section>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#1f2937' }}>Batch Udang Aktif</h2>
                        {batches.length === 0 ? (
                            <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>Belum ada batch udang.</p>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                                {batches.map((batch) => (
                                    <div key={batch.id} style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                            <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Hash size={14} /> Batch #{batch.id}
                                            </span>
                                            <span style={{ fontSize: '0.7rem', backgroundColor: batch.integrity === 'VALID' ? '#ecfdf5' : '#fef2f2', color: batch.integrity === 'VALID' ? '#059669' : '#dc2626', padding: '0.2rem 0.5rem', borderRadius: '0.5rem', fontWeight: 600 }}>
                                                {batch.integrity || 'VALID'}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                            <p><Calendar size={12} style={{ display: 'inline', marginRight: '0.25rem' }} /> {batch.tanggal_tebar}</p>
                                            <p><Leaf size={12} style={{ display: 'inline', marginRight: '0.25rem' }} /> {batch.usia_bibit_hari} hari</p>
                                            <p><Droplets size={12} style={{ display: 'inline', marginRight: '0.25rem' }} /> pH: {batch.kualitas_air_ph}</p>
                                            <p><TrendingUp size={12} style={{ display: 'inline', marginRight: '0.25rem' }} /> {batch.estimasi_panen_kg} kg</p>
                                        </div>
                                        <Button variant="outline" style={{ width: '100%', fontSize: '0.8rem', marginTop: '1rem' }} onClick={() => openProductModal(batch.id)}>
                                            <Package size={14} /> Jual ke Marketplace
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </>
            ) : (
                /* Orders Tab */
                <section>
                    {orders.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', backgroundColor: 'white', borderRadius: '1rem' }}>
                            <ShoppingBag size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p>Belum ada pesanan untuk produk Anda</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {orders.map((order: any) => (
                                <div key={order.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e5e7eb' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        <div>
                                            <h3 style={{ fontWeight: 700 }}>Order #{order.id}</h3>
                                            <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>Pembeli: {order.Konsumen?.name}</p>
                                        </div>
                                        <span style={{ backgroundColor: getStatusStyle(order.status).bg, color: getStatusStyle(order.status).color, padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                                        {order.items?.map((item: any, idx: number) => (
                                            <p key={idx} style={{ color: '#4b5563' }}>
                                                • {item.UdangProduk?.jenis_udang} - {item.qty_kg} kg @ {formatCurrency(item.harga_per_kg)}
                                            </p>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                                        <span style={{ fontWeight: 600 }}>Total: {formatCurrency(Number(order.total_harga))}</span>
                                        {order.status === 'PAID' && order.Delivery && (
                                            <Button onClick={() => showPickupQR(order.id)} style={{ fontSize: '0.85rem' }}>
                                                <QrCode size={16} /> Tampilkan QR Pickup
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* Create Tambak Modal */}
            {showTambakModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Tambah Tambak Baru</h2>
                        <form onSubmit={handleCreateTambak}>
                            <Input label="Nama Tambak" placeholder="Tambak Sejahtera" value={newTambak.nama_tambak} onChange={(e) => setNewTambak({ ...newTambak, nama_tambak: e.target.value })} required />
                            <Input label="Lokasi" placeholder="Banyuwangi, Blok A" value={newTambak.lokasi} onChange={(e) => setNewTambak({ ...newTambak, lokasi: e.target.value })} required />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <Input label="Luas (m²)" type="number" placeholder="1000" value={newTambak.luas_m2} onChange={(e) => setNewTambak({ ...newTambak, luas_m2: e.target.value })} required />
                                <Input label="Kapasitas (kg)" type="number" placeholder="5000" value={newTambak.kapasitas_maks_kg} onChange={(e) => setNewTambak({ ...newTambak, kapasitas_maks_kg: e.target.value })} required />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <Button type="button" variant="outline" onClick={() => setShowTambakModal(false)} style={{ flex: 1 }}>Batal</Button>
                                <Button type="submit" style={{ flex: 1 }}>Simpan</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Batch Modal */}
            {showBatchModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Tambah Batch Udang</h2>
                        <form onSubmit={handleCreateBatch}>
                            <Input label="Tanggal Tebar" type="date" value={newBatch.tanggal_tebar} onChange={(e) => setNewBatch({ ...newBatch, tanggal_tebar: e.target.value })} required />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <Input label="Usia Bibit (hari)" type="number" placeholder="15" value={newBatch.usia_bibit_hari} onChange={(e) => setNewBatch({ ...newBatch, usia_bibit_hari: e.target.value })} required />
                                <Input label="Asal Bibit" placeholder="Hatchery XYZ" value={newBatch.asal_bibit} onChange={(e) => setNewBatch({ ...newBatch, asal_bibit: e.target.value })} required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <Input label="pH Air" type="number" step="0.1" placeholder="7.5" value={newBatch.kualitas_air_ph} onChange={(e) => setNewBatch({ ...newBatch, kualitas_air_ph: e.target.value })} required />
                                <Input label="Salinitas (ppt)" type="number" step="0.1" placeholder="25" value={newBatch.kualitas_air_salinitas} onChange={(e) => setNewBatch({ ...newBatch, kualitas_air_salinitas: e.target.value })} required />
                            </div>
                            <Input label="Estimasi Panen (kg)" type="number" placeholder="1000" value={newBatch.estimasi_panen_kg} onChange={(e) => setNewBatch({ ...newBatch, estimasi_panen_kg: e.target.value })} required />
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <Button type="button" variant="outline" onClick={() => setShowBatchModal(false)} style={{ flex: 1 }}>Batal</Button>
                                <Button type="submit" style={{ flex: 1 }}>Simpan</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Product Modal */}
            {showProductModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', width: '90%', maxWidth: '500px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Jual Produk ke Marketplace</h2>
                        <form onSubmit={handleCreateProduct}>
                            <Input label="Jenis Udang" placeholder="Udang Vaname" value={newProduct.jenis_udang} onChange={(e) => setNewProduct({ ...newProduct, jenis_udang: e.target.value })} required />
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Grade</label>
                                <select value={newProduct.grade} onChange={(e) => setNewProduct({ ...newProduct, grade: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', fontSize: '0.95rem' }}>
                                    <option value="A">Grade A (Premium)</option>
                                    <option value="B">Grade B (Standard)</option>
                                    <option value="C">Grade C (Economy)</option>
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <Input label="Harga per kg (Rp)" type="number" placeholder="85000" value={newProduct.harga_per_kg} onChange={(e) => setNewProduct({ ...newProduct, harga_per_kg: e.target.value })} required />
                                <Input label="Stok (kg)" type="number" placeholder="100" value={newProduct.stok_kg} onChange={(e) => setNewProduct({ ...newProduct, stok_kg: e.target.value })} required />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <Button type="button" variant="outline" onClick={() => setShowProductModal(false)} style={{ flex: 1 }}>Batal</Button>
                                <Button type="submit" style={{ flex: 1 }}>Publikasikan</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Withdraw Modal */}
            {showWithdrawModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', width: '90%', maxWidth: '400px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Tarik Saldo</h2>
                        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1rem' }}>Saldo tersedia: {wallet ? formatCurrency(wallet.balance) : 'Rp 0'}</p>
                        <form onSubmit={handleWithdraw}>
                            <Input label="Jumlah Penarikan (Rp)" type="number" placeholder="100000" value={withdrawData.amount} onChange={(e) => setWithdrawData({ ...withdrawData, amount: e.target.value })} required />
                            <Input label="Nomor Rekening" placeholder="BCA - 1234567890" value={withdrawData.bank_account} onChange={(e) => setWithdrawData({ ...withdrawData, bank_account: e.target.value })} required />
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <Button type="button" variant="outline" onClick={() => setShowWithdrawModal(false)} style={{ flex: 1 }}>Batal</Button>
                                <Button type="submit" style={{ flex: 1 }}>Ajukan</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* QR Modal */}
            {showQRModal && qrData && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', width: '90%', maxWidth: '400px', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>QR Code Pickup</h2>
                        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Tunjukkan QR ini kepada kurir saat pickup</p>
                        <img src={qrData.image} alt="QR Code" style={{ width: '200px', height: '200px', margin: '0 auto 1rem' }} />
                        <p style={{ fontSize: '0.8rem', color: '#6b7280', wordBreak: 'break-all' }}>Token: {qrData.token}</p>
                        <Button onClick={() => setShowQRModal(false)} style={{ marginTop: '1.5rem', width: '100%' }}>Tutup</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PetambakDashboard;
