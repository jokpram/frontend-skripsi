import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Plus, Package, MapPin, DollarSign, ShoppingBag, QrCode, Banknote, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTambaks, useCreateTambak, useCreateBatch } from '../../hooks/api/useTambak';
import { usePetambakOrders, usePickupQR } from '../../hooks/api/useOrders';
import { useMyWallet, useRequestWithdraw } from '../../hooks/api/useWallet';
import { useMyProducts, useCreateProduct } from '../../hooks/api/useProducts';
import { useRequestProductUpdate } from '../../hooks/api/useChanges';
import type { Tambak, Order, UdangProduk } from '../../types/models';

const PetambakDashboard = () => {
    const tambaksQuery = useTambaks();
    const walletQuery = useMyWallet();
    const ordersQuery = usePetambakOrders();
    const productsQuery = useMyProducts();

    const tambaks = tambaksQuery.data ?? [];
    const wallet = walletQuery.data;
    const orders = ordersQuery.data ?? [];
    const products = productsQuery.data ?? [];

    const createTambakMutation = useCreateTambak();
    const createBatchMutation = useCreateBatch();
    const createProductMutation = useCreateProduct();
    const withdrawMutation = useRequestWithdraw();
    const qrMutation = usePickupQR();
    const requestUpdateMutation = useRequestProductUpdate();

    const [activeTab, setActiveTab] = useState<'tambak' | 'orders' | 'products'>('tambak');
    const [modal, setModal] = useState<string | null>(null);
    const [selectedTambakId, setSelectedTambakId] = useState<number | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<UdangProduk | null>(null);
    const [qrData, setQrData] = useState<{ token: string; image: string } | null>(null);

    const [newTambak, setNewTambak] = useState({ nama_tambak: '', lokasi: '', luas_m2: '', kapasitas_maks_kg: '' });
    const [newBatch, setNewBatch] = useState({
        kode_batch: '',
        tanggal_tebar: '',
        jumlah_bibit: 0,
        usia_bibit_hari: 0,
        asal_bibit: '',
        sertifikat_bibit: '',
        kualitas_air_ph: 0,
        kualitas_air_salinitas: 0,
        kualitas_air_suhu: 0,
        kualitas_air_do: 0,
        jenis_pakan: '',
        frekuensi_pakan_per_hari: 0,
        estimasi_panen_kg: 0,
        catatan: ''
    });
    const [withdrawData, setWithdrawData] = useState({ amount: '', bank_account: '' });
    const [updateData, setUpdateData] = useState({ jenis_udang: '', grade: '', harga_per_kg: 0 });
    const [newProduct, setNewProduct] = useState({ batch_id: '', jenis_udang: '', grade: '', harga_per_kg: 0, stok_kg: 0, kategori: 'UTAMA' });

    const handleCreateTambak = async (e: FormEvent) => {
        e.preventDefault();
        createTambakMutation.mutate({
            ...newTambak,
            luas_m2: parseInt(newTambak.luas_m2) || 0,
            kapasitas_maks_kg: parseInt(newTambak.kapasitas_maks_kg) || 0
        }, {
            onSuccess: () => {
                setModal(null);
                setNewTambak({ nama_tambak: '', lokasi: '', luas_m2: '', kapasitas_maks_kg: '' });
            }
        });
    };

    const handleCreateBatch = async (e: FormEvent) => {
        e.preventDefault();
        createBatchMutation.mutate({ ...newBatch, tambak_id: selectedTambakId || 0 }, {
            onSuccess: () => {
                setModal(null);
                setNewBatch({
                    kode_batch: '', tanggal_tebar: '', jumlah_bibit: 0, usia_bibit_hari: 0, asal_bibit: '', sertifikat_bibit: '',
                    kualitas_air_ph: 0, kualitas_air_salinitas: 0, kualitas_air_suhu: 0, kualitas_air_do: 0,
                    jenis_pakan: '', frekuensi_pakan_per_hari: 0, estimasi_panen_kg: 0, catatan: ''
                });
            }
        });
    };

    const handleCreateProduct = async (e: FormEvent) => {
        e.preventDefault();
        createProductMutation.mutate({
            batch_id: Number(newProduct.batch_id),
            jenis_udang: newProduct.jenis_udang,
            grade: newProduct.grade,
            harga_per_kg: newProduct.harga_per_kg,
            stok_kg: newProduct.stok_kg,
            kategori: newProduct.kategori as any
        }, {
            onSuccess: () => {
                setModal(null);
                setNewProduct({ batch_id: '', jenis_udang: '', grade: '', harga_per_kg: 0, stok_kg: 0, kategori: 'UTAMA' });
            }
        });
    };

    const handleWithdraw = async (e: FormEvent) => {
        e.preventDefault();
        withdrawMutation.mutate(withdrawData, {
            onSuccess: () => {
                setModal(null);
                setWithdrawData({ amount: '', bank_account: '' });
            }
        });
    };

    const showPickupQR = (orderId: number) => {
        qrMutation.mutate(orderId, {
            onSuccess: (data) => {
                setQrData({ token: data.token, image: data.image });
                setModal('qr');
            }
        });
    };

    const formatCurrency = (amount: number) => `Rp ${Number(amount).toLocaleString('id-ID')}`;

    const handleRequestUpdate = async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedProduct) return;
        requestUpdateMutation.mutate({
            productId: selectedProduct.id,
            data: updateData
        }, {
            onSuccess: () => {
                setModal(null);
                setUpdateData({ jenis_udang: '', grade: '', harga_per_kg: 0 });
            }
        });
    };

    if (tambaksQuery.isLoading || walletQuery.isLoading || ordersQuery.isLoading || productsQuery.isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 pt-24 pb-12 min-h-screen bg-slate-50">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 mb-2">My Tambak</h1>
                    <p className="text-slate-500 text-lg">Kelola ekosistem tambak dan batch udang Anda.</p>
                </div>
                <Button onClick={() => setModal('tambak')} className="shadow-lg shadow-emerald-500/20">
                    <Plus size={20} className="mr-2" /> Tambah Tambak
                </Button>
            </header>

            {/* Kartu Dompet */}
            {wallet && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-900 p-8 rounded-3xl text-white mb-10 shadow-xl"
                >
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md">
                                <DollarSign size={40} />
                            </div>
                            <div>
                                <p className="text-emerald-100 font-medium uppercase tracking-widest text-sm mb-1">Saldo Tersedia</p>
                                <p className="text-4xl font-black">{formatCurrency(wallet.balance)}</p>
                            </div>
                        </div>
                        <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-emerald-900" onClick={() => setModal('withdraw')}>
                            <Banknote size={20} className="mr-2" /> Tarik Saldo
                        </Button>
                    </div>
                </motion.section>
            )}

            {/* Tab */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 w-fit shadow-inner">
                <button onClick={() => setActiveTab('tambak')} className={`flex items-center gap-2 px-8 py-3 rounded-xl transition-all duration-200 font-bold ${activeTab === 'tambak' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-500'}`}>
                    <Package size={18} /> Tambak & Batch
                </button>
                <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-2 px-8 py-3 rounded-xl transition-all duration-200 font-bold ${activeTab === 'orders' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-500'}`}>
                    <ShoppingBag size={18} /> Pesanan ({orders.length})
                </button>
                <button onClick={() => setActiveTab('products')} className={`flex items-center gap-2 px-8 py-3 rounded-xl transition-all duration-200 font-bold ${activeTab === 'products' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-500'}`}>
                    <Package size={18} /> Produk ({products.length})
                </button>
            </div>

            {activeTab === 'tambak' ? (
                <div className="space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-3">
                            <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                            Daftar Tambak
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tambaks.map((tambak: Tambak, i: number) => (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} key={tambak.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all">
                                    <div className="flex justify-between mb-4">
                                        <h3 className="text-xl font-bold text-slate-900">{tambak.nama_tambak}</h3>
                                        <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">Active</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-6 pb-6 border-b border-slate-50">
                                        <MapPin size={16} /> {tambak.lokasi}
                                    </div>
                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">Kapasitas Terpakai</span>
                                            <span className="font-bold text-slate-700">{Math.round((tambak.kapasitas_terpakai_kg / tambak.kapasitas_maks_kg) * 100)}%</span>
                                        </div>
                                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(tambak.kapasitas_terpakai_kg / tambak.kapasitas_maks_kg) * 100}%` }} />
                                        </div>
                                    </div>
                                    <Button variant="outline" className="w-full rounded-2xl" onClick={() => { setSelectedTambakId(tambak.id); setModal('batch'); }}>
                                        <Plus size={18} className="mr-2" /> Add Batch
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </div>
            ) : activeTab === 'orders' ? (
                /* Bagian Pesanan */
                <section>
                    <div className="grid gap-6">
                        {orders.map((order: Order, i: number) => (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={order.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between gap-8">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-4">
                                        <h3 className="text-2xl font-black text-slate-900">Order #{order.id}</h3>
                                        <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">{order.status}</span>
                                    </div>
                                    <p className="text-slate-400 text-sm italic">Pembeli: {order.Konsumen?.name}</p>
                                </div>
                                <div className="flex flex-col justify-between items-end gap-6 border-l border-slate-50 pl-8">
                                    <Button onClick={() => showPickupQR(order.id)} disabled={qrMutation.isPending}>
                                        <QrCode size={18} className="mr-2" /> {qrMutation.isPending ? 'Loading...' : 'QR Pickup'}
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

            ) : (
                /* Produk Section */
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                            <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                            Daftar Produk
                        </h2>
                        <Button onClick={() => setModal('createProduct')} className="shadow-lg shadow-emerald-500/20">
                            <Plus size={18} className="mr-2" /> Jual Produk / Limbah
                        </Button>
                    </div>
                    <div className="grid gap-6">
                        {products.map((product: UdangProduk, i: number) => (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={product.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between gap-8">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-4">
                                        <h3 className="text-2xl font-black text-slate-900">{product.jenis_udang}</h3>
                                        {product.kategori === 'ECO' && <span className="bg-lime-100 text-lime-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Sirkular / Eco</span>}
                                        <span className="bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">{product.grade}</span>
                                    </div>
                                    <p className="text-slate-500 mb-2">Stok: <span className="font-bold">{product.stok_kg} kg</span></p>
                                    <p className="text-2xl font-bold text-emerald-600">{formatCurrency(product.harga_per_kg)}/kg</p>
                                </div>
                                <div className="flex flex-col justify-center border-l border-slate-50 pl-8">
                                    <Button onClick={() => {
                                        setSelectedProduct(product);
                                        setUpdateData({
                                            jenis_udang: product.jenis_udang,
                                            grade: product.grade,
                                            harga_per_kg: product.harga_per_kg
                                        });
                                        setModal('updateProduct');
                                    }} variant="outline">
                                        <Edit3 size={18} className="mr-2" /> Request Update
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                        {products.length === 0 && <p className="text-slate-500 italic">Belum ada produk.</p>}
                    </div>
                </section>
            )
            }

            {/* Modal */}
            <AnimatePresence>
                {modal && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModal(null)} />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white p-8 rounded-[2rem] w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
                            <h2 className="text-3xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4">{modal.toUpperCase()}</h2>

                            {modal === 'tambak' && (
                                <form onSubmit={handleCreateTambak} className="space-y-4">
                                    <Input label="Nama Tambak" placeholder="Tambak A" value={newTambak.nama_tambak} onChange={(e) => setNewTambak({ ...newTambak, nama_tambak: e.target.value })} required />
                                    <Input label="Lokasi" placeholder="Banyuwangi" value={newTambak.lokasi} onChange={(e) => setNewTambak({ ...newTambak, lokasi: e.target.value })} required />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input name="luas_m2" label="Luas (m²)" type="number" value={newTambak.luas_m2} onChange={(e) => setNewTambak({ ...newTambak, luas_m2: e.target.value })} required />
                                        <Input name="kapasitas_maks_kg" label="Kapasitas (kg)" type="number" value={newTambak.kapasitas_maks_kg} onChange={(e) => setNewTambak({ ...newTambak, kapasitas_maks_kg: e.target.value })} required />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={createTambakMutation.isPending}>
                                        {createTambakMutation.isPending ? 'Simpan...' : 'Simpan Tambak'}
                                    </Button>
                                </form>
                            )}

                            {modal === 'batch' && (
                                <form onSubmit={handleCreateBatch} className="space-y-4">
                                    <div className="border-b pb-2 mb-4 font-bold text-emerald-800">1. Data Umum & Bibit</div>
                                    <Input label="Kode Batch (Manual)" placeholder="BATCH-001" value={newBatch.kode_batch} onChange={(e) => setNewBatch({ ...newBatch, kode_batch: e.target.value })} />
                                    <Input label="Tanggal Tebar" type="date" value={newBatch.tanggal_tebar} onChange={(e) => setNewBatch({ ...newBatch, tanggal_tebar: e.target.value })} required />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input name="jumlah_bibit" label="Jumlah Bibit" type="number" value={newBatch.jumlah_bibit} onChange={(e) => setNewBatch({ ...newBatch, jumlah_bibit: parseInt(e.target.value) || 0 })} required />
                                        <Input name="usia_bibit_hari" label="Usia Bibit (hari)" type="number" value={newBatch.usia_bibit_hari} onChange={(e) => setNewBatch({ ...newBatch, usia_bibit_hari: parseInt(e.target.value) || 0 })} required />
                                    </div>
                                    <Input label="Asal Bibit" placeholder="Hatchery A" value={newBatch.asal_bibit} onChange={(e) => setNewBatch({ ...newBatch, asal_bibit: e.target.value })} required />
                                    <Input label="No. Sertifikat Bibit" placeholder="SERT-12345" value={newBatch.sertifikat_bibit} onChange={(e) => setNewBatch({ ...newBatch, sertifikat_bibit: e.target.value })} />

                                    <div className="border-b pb-2 mb-4 mt-6 font-bold text-emerald-800">2. Kualitas Air & Pakan</div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input name="kualitas_air_ph" label="pH Air" type="number" step="0.1" value={newBatch.kualitas_air_ph} onChange={(e) => setNewBatch({ ...newBatch, kualitas_air_ph: parseFloat(e.target.value) || 0 })} required />
                                        <Input name="kualitas_air_salinitas" label="Salinitas (ppt)" type="number" step="0.1" value={newBatch.kualitas_air_salinitas} onChange={(e) => setNewBatch({ ...newBatch, kualitas_air_salinitas: parseFloat(e.target.value) || 0 })} required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input name="kualitas_air_suhu" label="Suhu (°C)" type="number" step="0.1" value={newBatch.kualitas_air_suhu} onChange={(e) => setNewBatch({ ...newBatch, kualitas_air_suhu: parseFloat(e.target.value) || 0 })} required />
                                        <Input name="kualitas_air_do" label="DO (mg/L)" type="number" step="0.1" value={newBatch.kualitas_air_do} onChange={(e) => setNewBatch({ ...newBatch, kualitas_air_do: parseFloat(e.target.value) || 0 })} required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input name="jenis_pakan" label="Jenis Pakan" placeholder="Pelet A" value={newBatch.jenis_pakan} onChange={(e) => setNewBatch({ ...newBatch, jenis_pakan: e.target.value })} />
                                        <Input name="frekuensi_pakan_per_hari" label="Frekuensi Pakan/Hari" type="number" value={newBatch.frekuensi_pakan_per_hari} onChange={(e) => setNewBatch({ ...newBatch, frekuensi_pakan_per_hari: parseInt(e.target.value) || 0 })} />
                                    </div>

                                    <div className="border-b pb-2 mb-4 mt-6 font-bold text-emerald-800">3. Target & Lainnya</div>
                                    <Input name="estimasi_panen_kg" label="Estimasi Panen (kg)" type="number" value={newBatch.estimasi_panen_kg} onChange={(e) => setNewBatch({ ...newBatch, estimasi_panen_kg: parseInt(e.target.value) || 0 })} required />
                                    <div className="w-full mb-4">
                                        <label className="block mb-2 font-medium text-slate-700">Catatan Tambahan</label>
                                        <textarea
                                            className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none bg-slate-50 text-slate-900 border-slate-200 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                                            rows={3}
                                            value={newBatch.catatan}
                                            onChange={(e) => setNewBatch({ ...newBatch, catatan: e.target.value })}
                                        ></textarea>
                                    </div>

                                    <Button type="submit" className="w-full" disabled={createBatchMutation.isPending}>
                                        {createBatchMutation.isPending ? 'Simpan...' : 'Simpan Batch'}
                                    </Button>
                                </form>
                            )}

                            {modal === 'withdraw' && (
                                <form onSubmit={handleWithdraw} className="space-y-4">
                                    <Input label="Jumlah Penarikan (Rp)" type="number" value={withdrawData.amount} onChange={(e) => setWithdrawData({ ...withdrawData, amount: e.target.value })} required />
                                    <Input label="Nomor Rekening" placeholder="BCA - 12345678" value={withdrawData.bank_account} onChange={(e) => setWithdrawData({ ...withdrawData, bank_account: e.target.value })} required />
                                    <Button type="submit" className="w-full" disabled={withdrawMutation.isPending}>
                                        {withdrawMutation.isPending ? 'Ajukan...' : 'Ajukan Penarikan'}
                                    </Button>
                                </form>
                            )}

                            {modal === 'qr' && qrData && (
                                <div className="text-center space-y-6">
                                    <img src={qrData.image} alt="QR" className="w-64 h-64 mx-auto" />
                                    <p className="text-sm font-mono text-slate-400 break-all">{qrData.token}</p>
                                    <Button onClick={() => setModal(null)} className="w-full">Tanda Selesai</Button>
                                </div>
                            )}

                            {modal === 'updateProduct' && selectedProduct && (
                                <form onSubmit={handleRequestUpdate} className="space-y-4">
                                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-yellow-800 text-sm mb-4">
                                        Perubahan data produk memerlukan persetujuan Admin sebelum diterapkan.
                                    </div>
                                    <Input label="Jenis Udang" value={updateData.jenis_udang} onChange={(e) => setUpdateData({ ...updateData, jenis_udang: e.target.value })} required />
                                    <Input label="Grade" value={updateData.grade} onChange={(e) => setUpdateData({ ...updateData, grade: e.target.value })} required />
                                    <Input label="Harga per Kg" type="number" value={updateData.harga_per_kg} onChange={(e) => setUpdateData({ ...updateData, harga_per_kg: parseInt(e.target.value) || 0 })} required />

                                    <Button type="submit" className="w-full" disabled={requestUpdateMutation.isPending}>
                                        {requestUpdateMutation.isPending ? 'Mengirim...' : 'Kirim Permintaan'}
                                    </Button>
                                </form>
                            )}

                            {modal === 'createProduct' && (
                                <form onSubmit={handleCreateProduct} className="space-y-4">
                                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-emerald-800 text-sm mb-4">
                                        Pilih Batch Udang untuk membuat produk jadi atau limbah sirkular (seperti kulit udang, udang mati untuk pakan/pupuk).
                                    </div>
                                    <div className="w-full">
                                        <label className="block mb-2 font-medium text-slate-700">Pilih Batch Udang</label>
                                        <select className="flex h-12 w-full rounded-xl border-2 px-4 py-3 bg-white outline-none" value={newProduct.batch_id} onChange={(e) => setNewProduct({ ...newProduct, batch_id: e.target.value })} required>
                                            <option value="" disabled>Pilih Batch...</option>
                                            {/* Get batches from unique tb.id ? For simplicity we just map available products. Wait we need to get raw batches from tambaks */}
                                            {tambaks.flatMap(t => t.BatchUdangs ?? []).map((b: any) => (
                                                <option key={b.id} value={b.id}>{b.kode_batch || `Batch ID ${b.id}`} - {b.estimasi_panen_kg}kg</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-full">
                                        <label className="block mb-2 font-medium text-slate-700">Kategori</label>
                                        <select className="flex h-12 w-full rounded-xl border-2 px-4 py-3 bg-white outline-none" value={newProduct.kategori} onChange={(e) => setNewProduct({ ...newProduct, kategori: e.target.value })} required>
                                            <option value="UTAMA">Produk Utama (Udang Konsumsi)</option>
                                            <option value="ECO">Produk Ekonomi Sirkular (Limbah Kulit, Kepala, Afkir, Lumpur)</option>
                                        </select>
                                    </div>
                                    <Input label="Nama / Jenis Produk" placeholder="Udang Vannamei / Kulit Udang" value={newProduct.jenis_udang} onChange={(e) => setNewProduct({ ...newProduct, jenis_udang: e.target.value })} required />
                                    <Input label="Grade" placeholder="A, B, C / Limbah" value={newProduct.grade} onChange={(e) => setNewProduct({ ...newProduct, grade: e.target.value })} required />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Stok (Kg)" type="number" value={newProduct.stok_kg} onChange={(e) => setNewProduct({ ...newProduct, stok_kg: Number(e.target.value) })} required />
                                        <Input label="Harga per Kg (Rp)" type="number" value={newProduct.harga_per_kg} onChange={(e) => setNewProduct({ ...newProduct, harga_per_kg: Number(e.target.value) })} required />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={createProductMutation.isPending}>
                                        {createProductMutation.isPending ? 'Menyimpan...' : 'Jual Produk'}
                                    </Button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default PetambakDashboard;
