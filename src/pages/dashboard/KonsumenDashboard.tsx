import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
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
    const [activeTab, setActiveTab] = useState<'shop' | 'orders'>('shop');
    const [showQRModal, setShowQRModal] = useState(false);
    const [qrToken, setQrToken] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [productsRes, ordersRes] = await Promise.all([
                api.get('/products'),
                api.get('/orders/my')
            ]);
            setProducts(productsRes.data);
            setOrders(ordersRes.data);
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

    const handleCheckout = async () => {
        if (cart.length === 0) {
            toast.error('Keranjang kosong');
            return;
        }
        try {
            const items = cart.map(c => ({ produk_id: c.produk_id, qty: c.qty }));
            const res = await api.post('/orders', { items });
            toast.success(`Order #${res.data.order.id} berhasil dibuat!`);
            setCart([]);

            // Get payment token
            const paymentRes = await api.post('/orders/payment/token', { orderId: res.data.order.id });
            if (paymentRes.data.redirect_url) {
                window.open(paymentRes.data.redirect_url, '_blank');
            }

            fetchData();
            setActiveTab('orders');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Gagal membuat order');
        }
    };

    const handleConfirmReceive = async () => {
        if (!qrToken.trim()) {
            toast.error('Masukkan token QR');
            return;
        }
        try {
            await api.post('/orders/scan/receive', { qr_token: qrToken });
            toast.success('Pesanan dikonfirmasi diterima!');
            setShowQRModal(false);
            setQrToken('');
            fetchData();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Gagal konfirmasi');
        }
    };

    const filteredProducts = products.filter(p =>
        p.jenis_udang.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.grade.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalCartPrice = cart.reduce((sum, c) => sum + (Number(c.product.harga_per_kg) * c.qty), 0);

    const formatCurrency = (amount: number) => `Rp ${Number(amount).toLocaleString('id-ID')}`;

    const getStatusStyle = (status: string) => {
        const styles: Record<string, { bg: string; color: string }> = {
            'PENDING': { bg: '#fef3c7', color: '#92400e' },
            'PAID': { bg: '#dbeafe', color: '#1e40af' },
            'SHIPPED': { bg: '#e0e7ff', color: '#3730a3' },
            'DELIVERED': { bg: '#d1fae5', color: '#065f46' },
            'COMPLETED': { bg: '#ecfdf5', color: '#059669' },
            'CANCELLED': { bg: '#fee2e2', color: '#991b1b' },
        };
        return styles[status] || { bg: '#f3f4f6', color: '#6b7280' };
    };

    return (
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '3rem' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#064e3b' }}>
                    {activeTab === 'shop' ? 'Marketplace Udang Segar' : 'Pesanan Saya'}
                </h1>
                <p style={{ color: '#6b7280' }}>
                    {activeTab === 'shop' ? 'Beli udang berkualitas langsung dari petambak terverifikasi' : 'Lacak status pesanan Anda'}
                </p>
            </header>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', backgroundColor: '#f3f4f6', padding: '0.25rem', borderRadius: '0.75rem', width: 'fit-content' }}>
                <button
                    onClick={() => setActiveTab('shop')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: activeTab === 'shop' ? 'white' : 'transparent',
                        color: activeTab === 'shop' ? '#059669' : '#6b7280',
                        fontWeight: activeTab === 'shop' ? 600 : 400,
                        boxShadow: activeTab === 'shop' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                >
                    <ShoppingCart size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                    Belanja
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: activeTab === 'orders' ? 'white' : 'transparent',
                        color: activeTab === 'orders' ? '#059669' : '#6b7280',
                        fontWeight: activeTab === 'orders' ? 600 : 400,
                        boxShadow: activeTab === 'orders' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                >
                    <Package size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                    Pesanan ({orders.length})
                </button>
            </div>

            {activeTab === 'shop' ? (
                <>
                    {/* Search */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                            <input
                                type="text"
                                placeholder="Cari jenis udang atau grade..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                                    borderRadius: '0.75rem',
                                    border: '1px solid #e5e7eb',
                                    fontSize: '0.95rem'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
                        {/* Product Grid */}
                        <div>
                            {isLoading ? (
                                <p style={{ color: '#6b7280' }}>Memuat produk...</p>
                            ) : filteredProducts.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', backgroundColor: 'white', borderRadius: '1rem' }}>
                                    <Package size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                    <p>Tidak ada produk ditemukan</p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
                                    {filteredProducts.map(product => (
                                        <div key={product.id} style={{ backgroundColor: 'white', borderRadius: '1rem', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                                            <div style={{ height: '120px', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                                                <Package size={40} />
                                            </div>
                                            <div style={{ padding: '1.25rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                    <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{product.jenis_udang}</h3>
                                                    <span style={{ fontSize: '0.65rem', backgroundColor: '#dbeafe', color: '#1e40af', padding: '0.15rem 0.4rem', borderRadius: '1rem', fontWeight: 600 }}>
                                                        Grade {product.grade}
                                                    </span>
                                                </div>
                                                <p style={{ fontSize: '1rem', fontWeight: 700, color: '#059669', marginBottom: '0.5rem' }}>
                                                    {formatCurrency(Number(product.harga_per_kg))} <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#6b7280' }}>/ kg</span>
                                                </p>
                                                <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '1rem' }}>Stok: {product.stok_kg} kg</p>
                                                <Button
                                                    onClick={() => addToCart(product)}
                                                    style={{ width: '100%', fontSize: '0.85rem' }}
                                                    disabled={product.stok_kg <= 0}
                                                >
                                                    <ShoppingCart size={14} /> {product.stok_kg > 0 ? 'Tambah' : 'Habis'}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Cart Sidebar */}
                        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e5e7eb', height: 'fit-content', position: 'sticky', top: '6rem' }}>
                            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <ShoppingCart size={20} /> Keranjang
                            </h3>
                            {cart.length === 0 ? (
                                <p style={{ color: '#9ca3af', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>Keranjang kosong</p>
                            ) : (
                                <>
                                    {cart.map(item => (
                                        <div key={item.produk_id} style={{ padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.product.jenis_udang}</p>
                                                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#059669' }}>
                                                    {formatCurrency(Number(item.product.harga_per_kg) * item.qty)}
                                                </p>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <button onClick={() => updateCartQty(item.produk_id, item.qty - 1)} style={{ width: '28px', height: '28px', borderRadius: '0.25rem', border: '1px solid #e5e7eb', cursor: 'pointer', backgroundColor: 'white' }}>-</button>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.qty} kg</span>
                                                <button onClick={() => updateCartQty(item.produk_id, item.qty + 1)} style={{ width: '28px', height: '28px', borderRadius: '0.25rem', border: '1px solid #e5e7eb', cursor: 'pointer', backgroundColor: 'white' }}>+</button>
                                            </div>
                                        </div>
                                    ))}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #e5e7eb' }}>
                                        <span style={{ fontWeight: 700 }}>Total:</span>
                                        <span style={{ fontWeight: 700, color: '#059669', fontSize: '1.1rem' }}>{formatCurrency(totalCartPrice)}</span>
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>+ Ongkos kirim dihitung saat checkout</p>
                                    <Button onClick={handleCheckout} style={{ width: '100%', marginTop: '1rem' }}>
                                        <CreditCard size={16} /> Checkout
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                /* Orders Tab */
                <div>
                    {orders.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', backgroundColor: 'white', borderRadius: '1rem' }}>
                            <Package size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p>Belum ada pesanan</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {orders.map(order => (
                                <div key={order.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e5e7eb' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        <div>
                                            <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Order #{order.id}</h3>
                                            <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>{new Date(order.created_at || '').toLocaleDateString('id-ID')}</p>
                                        </div>
                                        <span style={{
                                            backgroundColor: getStatusStyle(order.status).bg,
                                            color: getStatusStyle(order.status).color,
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '1rem',
                                            fontSize: '0.75rem',
                                            fontWeight: 600
                                        }}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div style={{ fontSize: '0.85rem', color: '#4b5563', marginBottom: '1rem' }}>
                                        {order.OrderItems?.map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                                                <span>{item.UdangProduk?.jenis_udang} ({item.qty_kg} kg)</span>
                                                <span>{formatCurrency(item.subtotal)}</span>
                                            </div>
                                        ))}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', color: '#6b7280' }}>
                                            <span><Truck size={14} style={{ display: 'inline', marginRight: '0.25rem' }} /> Ongkir ({order.total_jarak_km} km)</span>
                                            <span>{formatCurrency(Number(order.total_biaya_logistik))}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                                        <span style={{ fontWeight: 700 }}>Total: {formatCurrency(Number(order.total_harga))}</span>
                                        {order.status === 'SHIPPED' && order.Delivery && (
                                            <Button onClick={() => setShowQRModal(true)} style={{ fontSize: '0.85rem' }}>
                                                <QrCode size={16} /> Konfirmasi Terima
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
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', width: '90%', maxWidth: '400px' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <QrCode size={24} /> Konfirmasi Penerimaan
                        </h2>
                        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            Masukkan token QR dari kurir untuk mengkonfirmasi penerimaan pesanan.
                        </p>
                        <Input
                            label="Token QR"
                            placeholder="Contoh: abc123-def456"
                            value={qrToken}
                            onChange={(e) => setQrToken(e.target.value)}
                        />
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <Button variant="outline" onClick={() => setShowQRModal(false)} style={{ flex: 1 }}>Batal</Button>
                            <Button onClick={handleConfirmReceive} style={{ flex: 1 }}>
                                <Check size={16} /> Konfirmasi
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KonsumenDashboard;
