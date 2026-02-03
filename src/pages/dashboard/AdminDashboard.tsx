import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Button } from '../../components/common/Button';
import { Check, X, User } from 'lucide-react';

interface PendingUser {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
    // Additional fields depending on role
    address?: string;
    vehicle_type?: string;
    license_plate?: string;
}

const AdminDashboard = () => {
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPendingUsers = async () => {
        try {
            const response = await api.get('/admin/pending-users');
            setPendingUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch pending users', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const handleVerify = async (userId: number, role: string, action: 'approve' | 'reject') => {
        try {
            await api.post('/admin/verify-user', { userId, role, action });
            // Remove from list locally
            setPendingUsers(prev => prev.filter(u => u.id !== userId));
            alert(`User ${action}d successfully`);
        } catch (error) {
            console.error(`Failed to ${action} user`, error);
            alert('Action failed');
        }
    };

    return (
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '3rem' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#064e3b' }}>Admin Dashboard</h1>
                <p style={{ color: '#6b7280' }}>Manage users and platform overview</p>
            </header>

            <section>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={24} /> Pendaftaran User Tertunda
                </h2>

                {isLoading ? (
                    <p>Loading...</p>
                ) : pendingUsers.length === 0 ? (
                    <p style={{ color: '#6b7280', fontStyle: 'italic' }}>Tidak ada pendaftaran pengguna yang tertunda.</p>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                        {pendingUsers.map(user => (
                            <div key={`${user.role}-${user.id}`} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{user.name}</h3>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            backgroundColor: '#e5e7eb',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '1rem',
                                            fontWeight: 600,
                                            textTransform: 'capitalize'
                                        }}>
                                            {user.role}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                <div style={{ fontSize: '0.9rem', color: '#4b5563', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <p>Email: {user.email}</p>
                                    {user.role === 'petambak' && <p>Alamat: {user.address}</p>}
                                    {user.role === 'logistik' && (
                                        <>
                                            <p>Kendaraan: {user.vehicle_type}</p>
                                            <p>Plat: {user.license_plate}</p>
                                        </>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Button
                                        onClick={() => handleVerify(user.id, user.role, 'approve')}
                                        style={{ flex: 1, backgroundColor: '#10B981', fontSize: '0.9rem' }}
                                    >
                                        <Check size={16} /> Terima
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleVerify(user.id, user.role, 'reject')}
                                        style={{ flex: 1, borderColor: '#EF4444', color: '#EF4444', fontSize: '0.9rem' }}
                                    >
                                        <X size={16} /> Tolak
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default AdminDashboard;
