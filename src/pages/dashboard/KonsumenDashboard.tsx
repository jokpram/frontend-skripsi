import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getProducts } from '../../services/productService';
import { getMyOrders, createOrder, getPaymentToken, scanReceive } from '../../services/orderService';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ShoppingCart, Package, Search, Truck, CreditCard, Check, QrCode } from 'lucide-react';
import type { UdangProduk, Order } from '../../types/models';

const KonsumenDashboard = () => {
    const [products, setProducts] = useState<UdangProduk[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState<{ produk_id: number; qty: number; product: UdangProduk }[]>([]);
    const [view, setView] = useState<'shop' | 'eco' | 'checkout' | 'orders'>('shop');
    const [qrToken, setQrToken] = useState('');
    const [showQRModal, setShowQRModal] = useState(false);

    // Checkout State
    const [checkoutForm, setCheckoutForm] = useState({
        address: '',
        deliveryMethod: 'LOGISTIC_PARTNER',
        note: '',
        insurance: false,
    });

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.address) setCheckoutForm(prev => ({ ...prev, address: user.address }));
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [productsRes, ordersRes] = await Promise.all([
                getProducts(),
                getMyOrders()
            ]);
            setProducts(productsRes);
            setOrders(ordersRes);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const addToCart = (product: UdangProduk) => {
        const existing = cart.find(c => c.produk_id === product.id);
        if (existing) {
            if (existing.qty < product.stok_kg) {
                setCart(cart.map(c => c.produk_id === product.id ? { ...c, qty: c.qty + 1 } : c));
                toast.success(`${product.jenis_udang} ditambahkan ke keranjang`);
            } else {
                toast.error('Stok tidak cukup');
            }
        } else {
            setCart([...cart, { produk_id: product.id, qty: 1, product }]);
            toast.success(`${product.jenis_udang} ditambahkan ke keranjang`);
        }
    };

    const updateCartQty = (produkId: number, qty: number) => {
        if (qty <= 0) {
            setCart(cart.filter(c => c.produk_id !== produkId));
        } else {
            setCart(cart.map(c => c.produk_id === produkId ? { ...c, qty } : c));
        }
    };

    const handleCreateOrder = async () => {
        if (cart.length === 0) {
            toast.error('Keranjang kosong');
            return;
        }
        if (!checkoutForm.address) {
            toast.error('Alamat pengiriman wajib diisi');
            return;
        }

        try {
            const items = cart.map(c => ({ produk_id: c.produk_id, qty_kg: c.qty }));
            const res = await createOrder({
                items,
                delivery_method: checkoutForm.deliveryMethod,
                delivery_address: checkoutForm.address,
                delivery_note: checkoutForm.note,
                insurance: checkoutForm.insurance
            });

            toast.success(`Order #${res.order.id} berhasil dibuat!`);
            setCart([]);
            setView('orders'); // Go to orders to view pending order

            // Get payment token immediately
            const paymentRes = await getPaymentToken(res.order.id);
            if (paymentRes.redirect_url) {
                window.open(paymentRes.redirect_url, '_blank');
            }

            fetchData();
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || 'Gagal membuat order';
            toast.error(message);
        }
    };

    const handleConfirmReceive = async () => {
        if (!qrToken.trim()) {
            toast.error('Masukkan token QR');
            return;
        }
        try {
            await scanReceive(qrToken);
            toast.success('Pesanan dikonfirmasi diterima!');
            setShowQRModal(false);
            setQrToken('');
            fetchData();
        } catch (err: any) {
            toast.error(err || 'Gagal konfirmasi');
        }
    };

    const filteredProductsShop = products.filter(p => p.kategori !== 'ECO' && (
        p.jenis_udang.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.grade.toLowerCase().includes(searchQuery.toLowerCase())
    ));

    const filteredProductsEco = products.filter(p => p.kategori === 'ECO' && (
        p.jenis_udang.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.grade.toLowerCase().includes(searchQuery.toLowerCase())
    ));

    const totalProductPrice = cart.reduce((sum, c) => sum + (Number(c.product.harga_per_kg) * c.qty), 0);
    const logisticsCost = checkoutForm.deliveryMethod === 'SELF_PICKUP' ? 0 : 20000; // Mock calculation mirroring backend default
    const insuranceCost = checkoutForm.insurance ? totalProductPrice * 0.01 : 0;
    const grandTotal = totalProductPrice + logisticsCost + insuranceCost;

    const formatCurrency = (amount: number) => `Rp ${Number(amount).toLocaleString('id-ID')}`;

    const getStatusStyle = (status: string) => {
        const styles: Record<string, string> = {
            'PENDING': 'bg-amber-100 text-amber-800',
            'PAID': 'bg-blue-100 text-blue-800',
            'SHIPPED': 'bg-indigo-100 text-indigo-800',
            'DELIVERED': 'bg-emerald-100 text-emerald-800',
            'COMPLETED': 'bg-emerald-50 text-emerald-600',
            'CANCELLED': 'bg-red-100 text-red-800',
        };
        return styles[status] || 'bg-slate-100 text-slate-600';
    };

    return (
        <div className="container mx-auto px-4 pt-24 pb-12 min-h-screen bg-slate-50">
            <header className="mb-8">
                <h1 className="text-4xl font-black text-emerald-900 mb-2">
                    {view === 'orders' ? 'Pesanan Saya' : (view === 'checkout' ? 'Checkout' : 'Marketplace Udang Segar')}
                </h1>
                <p className="text-slate-500 text-lg">
                    {view === 'orders' ? 'Lacak status pesanan Anda' : (view === 'checkout' ? 'Selesaikan pesanan Anda' : 'Beli udang berkualitas langsung dari petambak terverifikasi')}
                </p>
            </header>

            {/* View Navigation */}
            {view !== 'checkout' && (
                <div className="flex bg-slate-200/50 p-1.5 rounded-2xl mb-8 w-fit shadow-inner">
                    <button
                        onClick={() => setView('shop')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-bold text-sm ${view === 'shop' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-500'}`}
                    >
                        <ShoppingCart size={18} className="mr-2" />
                        Belanja Utama
                    </button>
                    <button
                        onClick={() => setView('eco')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-bold text-sm ${view === 'eco' ? 'bg-white text-lime-600 shadow-md' : 'text-slate-500'}`}
                    >
                        <ShoppingCart size={18} className="mr-2" />
                        Eco Market (Sirkular)
                    </button>
                    <button
                        onClick={() => setView('orders')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-bold text-sm ${view === 'orders' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-500'}`}
                    >
                        <Package size={18} className="mr-2" />
                        Pesanan ({orders.length})
                    </button>
                </div>
            )}

            {view === 'checkout' ? (
                /* Checkout Form */
                <div className="max-w-4xl bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <button onClick={() => setView('shop')} className="mb-6 flex items-center text-slate-400 hover:text-emerald-600 font-bold text-sm">
                        ← Kembali ke Keranjang
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><Truck className="text-emerald-600" /> Pengiriman</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Metode Pengiriman</label>
                                    <select
                                        className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                                        value={checkoutForm.deliveryMethod}
                                        onChange={(e) => setCheckoutForm({ ...checkoutForm, deliveryMethod: e.target.value })}
                                    >
                                        <option value="LOGISTIC_PARTNER">Mitra Logistik (Kurir)</option>
                                        <option value="SELF_PICKUP">Ambil Sendiri di Tambak</option>
                                    </select>
                                </div>

                                <Input
                                    label="Alamat Pengiriman"
                                    value={checkoutForm.address}
                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                                    placeholder="Jl. Raya..."
                                    required
                                />

                                <Input
                                    label="Catatan Tambahan (Opsional)"
                                    value={checkoutForm.note}
                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, note: e.target.value })}
                                    placeholder="Rumah pagar hitam..."
                                />

                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <input
                                        type="checkbox"
                                        id="insurance"
                                        className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                                        checked={checkoutForm.insurance}
                                        onChange={(e) => setCheckoutForm({ ...checkoutForm, insurance: e.target.checked })}
                                    />
                                    <label htmlFor="insurance" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                                        Asuransi Pengiriman (1% dari total harga)
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><CreditCard className="text-emerald-600" /> Ringkasan Biaya</h3>

                            <div className="bg-slate-50 p-6 rounded-2xl space-y-3 mb-6">
                                {cart.map(item => (
                                    <div key={item.produk_id} className="flex justify-between text-sm">
                                        <span className="text-slate-600">{item.product.jenis_udang} x {item.qty} kg</span>
                                        <span className="font-bold text-slate-900">{formatCurrency(Number(item.product.harga_per_kg) * item.qty)}</span>
                                    </div>
                                ))}
                                <div className="border-t border-slate-200 pt-3 mt-3 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Subtotal Produk</span>
                                        <span className="font-bold text-slate-900">{formatCurrency(totalProductPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Biaya Logistik</span>
                                        <span className="font-bold text-slate-900">{formatCurrency(logisticsCost)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Asuransi</span>
                                        <span className="font-bold text-slate-900">{formatCurrency(insuranceCost)}</span>
                                    </div>
                                </div>
                                <div className="border-t-2 border-dashed border-slate-200 pt-4 mt-4 flex justify-between items-center">
                                    <span className="font-black text-lg text-slate-900">Total</span>
                                    <span className="font-black text-2xl text-emerald-600">{formatCurrency(grandTotal)}</span>
                                </div>
                            </div>

                            <Button onClick={handleCreateOrder} className="w-full py-4 text-lg shadow-xl shadow-emerald-500/20">
                                Buat Pesanan & Bayar
                            </Button>
                        </div>
                    </div>
                </div>

            ) : (view === 'shop' || view === 'eco') ? (
                <>
                    {/* Search */}
                    <div className="flex gap-4 mb-8 flex-wrap">
                        <div className="flex-1 min-w-[200px] relative">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder={view === 'eco' ? "Cari limbah atau udang afkir..." : "Cari jenis udang atau grade..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
                        {/* Product Grid */}
                        <div>
                            {isLoading ? (
                                <p className="text-slate-500">Memuat produk...</p>
                            ) : (view === 'shop' ? filteredProductsShop : filteredProductsEco).length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Package size={32} className="text-slate-400" />
                                    </div>
                                    <p className="text-slate-500">Tidak ada produk ditemukan</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {(view === 'shop' ? filteredProductsShop : filteredProductsEco).map((product: UdangProduk) => (
                                        <div key={product.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                                            <div className="h-32 bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform duration-500">
                                                <Package size={40} />
                                            </div>
                                            <div className="p-6">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-slate-900">{product.jenis_udang}</h3>
                                                    <span className="px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-600">
                                                        Grade {product.grade}
                                                    </span>
                                                </div>
                                                <p className="text-lg font-black text-emerald-600 mb-2">
                                                    {formatCurrency(Number(product.harga_per_kg))} <span className="text-xs font-normal text-slate-400">/ kg</span>
                                                </p>
                                                <p className="text-sm text-slate-500 mb-6">Stok: {product.stok_kg} kg</p>
                                                <Button
                                                    onClick={() => addToCart(product)}
                                                    className="w-full text-sm py-2.5"
                                                    disabled={product.stok_kg <= 0}
                                                >
                                                    <ShoppingCart size={16} className="mr-2" /> {product.stok_kg > 0 ? 'Tambah' : 'Habis'}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Cart Sidebar */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-fit sticky top-24">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-900">
                                <ShoppingCart size={20} /> Keranjang
                            </h3>
                            {cart.length === 0 ? (
                                <div className="text-center py-8 text-slate-400 text-sm">
                                    <p>Keranjang kosong</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4 mb-6">
                                        {cart.map(item => (
                                            <div key={item.produk_id} className="pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                                <div className="flex justify-between mb-2">
                                                    <p className="font-semibold text-sm text-slate-900">{item.product.jenis_udang}</p>
                                                    <p className="font-bold text-sm text-emerald-600">
                                                        {formatCurrency(Number(item.product.harga_per_kg) * item.qty)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => updateCartQty(item.produk_id, item.qty - 1)} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-colors">-</button>
                                                    <span className="font-medium text-slate-900 text-sm">{item.qty} kg</span>
                                                    <button onClick={() => updateCartQty(item.produk_id, item.qty + 1)} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-colors">+</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-4 border-t-2 border-slate-100 mb-4">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-slate-900">Total</span>
                                            <span className="font-black text-xl text-emerald-600">{formatCurrency(totalProductPrice)}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 text-right">+ Ongkos kirim dihitung saat checkout</p>
                                    </div>
                                    <Button onClick={() => setView('checkout')} className="w-full shadow-lg shadow-emerald-500/20">
                                        <CreditCard size={18} className="mr-2" /> Checkout
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                /* Orders Tab */
                <div className="max-w-4xl">
                    {orders.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package size={32} className="text-slate-400" />
                            </div>
                            <p className="text-slate-500">Belum ada pesanan</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {orders.map(order => (
                                <div key={order.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-900">Order #{order.id}</h3>
                                            <p className="text-xs text-slate-500">{new Date(order.created_at || '').toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="bg-slate-50 rounded-2xl p-4 mb-4 space-y-2">
                                        {order.OrderItems?.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm">
                                                <span className="text-slate-700">{item.UdangProduk?.jenis_udang} <span className="text-slate-400">x {item.qty_kg} kg</span></span>
                                                <span className="font-medium text-slate-900">{formatCurrency(item.subtotal)}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between text-sm pt-2 border-t border-slate-200 text-slate-500">
                                            <span className="flex items-center gap-1"><Truck size={14} /> Ongkir ({order.total_jarak_km} km)</span>
                                            <span>{formatCurrency(Number(order.total_biaya_logistik))}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-2">
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Total Pembayaran</p>
                                            <p className="font-black text-xl text-emerald-600">{formatCurrency(Number(order.total_harga))}</p>
                                        </div>
                                        {order.status === 'SHIPPED' && order.Delivery && (
                                            <Button onClick={() => setShowQRModal(true)} className="px-6">
                                                <QrCode size={18} className="mr-2" /> Konfirmasi Terima
                                            </Button>
                                        )}
                                        {order.status === 'PENDING' && (
                                            <Button
                                                onClick={async () => {
                                                    try {
                                                        const paymentRes = await getPaymentToken(order.id);
                                                        if (paymentRes.redirect_url) {
                                                            window.open(paymentRes.redirect_url, '_blank');
                                                        }
                                                    } catch {
                                                        toast.error('Gagal membuka pembayaran');
                                                    }
                                                }}
                                                variant="outline"
                                                className="px-6 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                            >
                                                <CreditCard size={18} className="mr-2" /> Bayar Sekarang
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* QR Confirm Modal */}
            {showQRModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                            <QrCode size={28} className="text-emerald-600" /> Konfirmasi Penerimaan
                        </h2>
                        <p className="text-slate-500 text-sm mb-6">
                            Masukkan token QR dari kurir untuk mengkonfirmasi penerimaan pesanan.
                        </p>
                        <Input
                            label="Token QR"
                            placeholder="Contoh: abc123-def456"
                            value={qrToken}
                            onChange={(e) => setQrToken(e.target.value)}
                        />
                        <div className="flex gap-4 mt-6">
                            <Button variant="outline" onClick={() => setShowQRModal(false)} className="flex-1">Batal</Button>
                            <Button onClick={handleConfirmReceive} className="flex-1">
                                <Check size={18} className="mr-2" /> Konfirmasi
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KonsumenDashboard;
