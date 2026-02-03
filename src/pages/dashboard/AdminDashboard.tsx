import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { Button } from '../../components/common/Button';
import { Check, X, User, DollarSign, Package, Truck, Users, TrendingUp } from 'lucide-react';
import type { Wallet, WithdrawRequest } from '../../types/models';

interface PendingUser {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
    address?: string;
    vehicle_type?: string;
    license_plate?: string;
}

const AdminDashboard = () => {
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
    const [withdrawRequests, setWithdrawRequests] = useState<WithdrawRequest[]>([]);
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'users' | 'withdrawals'>('users');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [usersRes, walletRes, withdrawRes] = await Promise.all([
                api.get('/admin/pending-users'),
                api.get('/wallet/my'),
                api.get('/wallet/withdraw')
            ]);
            setPendingUsers(usersRes.data);
            setWallet(walletRes.data);
            setWithdrawRequests(withdrawRes.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (userId: number, role: string, action: 'approve' | 'reject') => {
        try {
            await api.post('/admin/verify-user', { userId, role, action });
            setPendingUsers(prev => prev.filter(u => u.id !== userId));
            toast.success(`User ${action === 'approve' ? 'disetujui' : 'ditolak'} sukses!`);
        } catch (error) {
            console.error(`Failed to ${action} user`, error);
            toast.error('Gagal memproses verifikasi pengguna');
        }
    };

    const handleProcessWithdraw = async (id: number, action: 'APPROVE' | 'REJECT') => {
        try {
            await api.post(`/wallet/withdraw/${id}/process`, { action });
            setWithdrawRequests(prev => prev.filter(w => w.id !== id));
            toast.success(`Penarikan ${action === 'APPROVE' ? 'disetujui' : 'ditolak'}!`);
            fetchData();
        } catch (error) {
            toast.error('Gagal memproses penarikan');
        }
    };

    const formatCurrency = (amount: number) => `Rp ${Number(amount).toLocaleString('id-ID')}`;

    const stats = [
        { label: 'Escrow Balance', value: wallet ? formatCurrency(wallet.balance) : 'Rp 0', icon: DollarSign, color: '#059669' },
        { label: 'Pending Users', value: pendingUsers.length, icon: Users, color: '#f59e0b' },
        { label: 'Pending Withdrawals', value: withdrawRequests.filter(w => w.status === 'PENDING').length, icon: TrendingUp, color: '#6366f1' },
    ];

    return (
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '3rem' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#064e3b' }}>Admin Dashboard</h1>
                <p style={{ color: '#6b7280' }}>Kelola pengguna, verifikasi, dan penarikan dana</p>
            </header>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {stats.map((stat, i) => (
                    <div key={i} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', borderRadius: '0.75rem', backgroundColor: `${stat.color}20` }}>
                            <stat.icon size={24} style={{ color: stat.color }} />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>{stat.label}</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937' }}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', backgroundColor: '#f3f4f6', padding: '0.25rem', borderRadius: '0.75rem', width: 'fit-content' }}>
                <button
                    onClick={() => setActiveTab('users')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: activeTab === 'users' ? 'white' : 'transparent',
                        color: activeTab === 'users' ? '#059669' : '#6b7280',
                        fontWeight: activeTab === 'users' ? 600 : 400,
                        boxShadow: activeTab === 'users' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                >
                    <User size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                    Verifikasi User ({pendingUsers.length})
                </button>
                <button
                    onClick={() => setActiveTab('withdrawals')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: activeTab === 'withdrawals' ? 'white' : 'transparent',
                        color: activeTab === 'withdrawals' ? '#059669' : '#6b7280',
                        fontWeight: activeTab === 'withdrawals' ? 600 : 400,
                        boxShadow: activeTab === 'withdrawals' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                >
                    <DollarSign size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                    Penarikan Dana ({withdrawRequests.filter(w => w.status === 'PENDING').length})
                </button>
            </div>

            {/* Content */}
            {isLoading ? (
                <p>Loading...</p>
            ) : activeTab === 'users' ? (
                <section>
                    {pendingUsers.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', backgroundColor: 'white', borderRadius: '1rem' }}>
                            <User size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p>Tidak ada pendaftaran pengguna yang tertunda.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                            {pendingUsers.map(user => (
                                <div key={`${user.role}-${user.id}`} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div>
                                            <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{user.name}</h3>
                                            <span style={{ fontSize: '0.7rem', backgroundColor: '#e5e7eb', padding: '0.2rem 0.5rem', borderRadius: '1rem', fontWeight: 600, textTransform: 'capitalize' }}>
                                                {user.role}
                                            </span>
                                        </div>
                                        <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                            {new Date(user.createdAt).toLocaleDateString('id-ID')}
                                        </span>
                                    </div>

                                    <div style={{ fontSize: '0.85rem', color: '#4b5563', marginBottom: '1rem' }}>
                                        <p>📧 {user.email}</p>
                                        {user.role === 'petambak' && user.address && <p>📍 {user.address}</p>}
                                        {user.role === 'logistik' && (
                                            <>
                                                <p>🚛 {user.vehicle_type}</p>
                                                <p>🔢 {user.license_plate}</p>
                                            </>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <Button onClick={() => handleVerify(user.id, user.role, 'approve')} style={{ flex: 1, backgroundColor: '#10B981', fontSize: '0.85rem' }}>
                                            <Check size={14} /> Terima
                                        </Button>
                                        <Button variant="outline" onClick={() => handleVerify(user.id, user.role, 'reject')} style={{ flex: 1, borderColor: '#EF4444', color: '#EF4444', fontSize: '0.85rem' }}>
                                            <X size={14} /> Tolak
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            ) : (
                <section>
                    {withdrawRequests.filter(w => w.status === 'PENDING').length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', backgroundColor: 'white', borderRadius: '1rem' }}>
                            <DollarSign size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p>Tidak ada permintaan penarikan yang tertunda.</p>
                        </div>
                    ) : (
                        <div style={{ backgroundColor: 'white', borderRadius: '1rem', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f9fafb' }}>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: '#6b7280' }}>ID</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: '#6b7280' }}>Jumlah</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: '#6b7280' }}>Rekening</th>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: '#6b7280' }}>Tanggal</th>
                                        <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600, color: '#6b7280' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {withdrawRequests.filter(w => w.status === 'PENDING').map(wr => (
                                        <tr key={wr.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                            <td style={{ padding: '1rem', fontSize: '0.9rem' }}>#{wr.id}</td>
                                            <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 600, color: '#059669' }}>{formatCurrency(wr.amount)}</td>
                                            <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{wr.bank_account}</td>
                                            <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#6b7280' }}>{new Date(wr.requested_at || '').toLocaleDateString('id-ID')}</td>
                                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                    <Button onClick={() => handleProcessWithdraw(wr.id, 'APPROVE')} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', backgroundColor: '#10B981' }}>
                                                        <Check size={14} />
                                                    </Button>
                                                    <Button variant="outline" onClick={() => handleProcessWithdraw(wr.id, 'REJECT')} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderColor: '#EF4444', color: '#EF4444' }}>
                                                        <X size={14} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            )}
        </div>
    );
};

export default AdminDashboard;
