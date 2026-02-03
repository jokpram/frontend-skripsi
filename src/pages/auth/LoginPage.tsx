import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../services/authService';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Anchor } from 'lucide-react';

const roles = [
    { id: 'konsumen', label: 'Konsumen' },
    { id: 'petambak', label: 'Petambak' },
    { id: 'logistik', label: 'Logistik' },
    { id: 'admin', label: 'Admin' }
];

const LoginPage = () => {
    const { login: authLogin } = useAuth();
    const navigate = useNavigate();

    const [role, setRole] = useState('konsumen');
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = await login(role, formData);
            authLogin(data.token, data); // API response now has role included per previous step
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (

        <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'white' }}>

            {/* Left Side - Brand/Image */}
            <div style={{
                flex: 1,
                backgroundColor: '#064e3b',
                display: 'none', // Hidden on mobile
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '4rem',
                position: 'relative',
                overflow: 'hidden'
            }} className="desktop-only-flex">
                <style>{`
            @media (min-width: 1024px) {
              .desktop-only-flex { display: flex !important; }
            }
         `}</style>

                <div style={{ position: 'relative', zIndex: 2, color: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '1rem', backdropFilter: 'blur(10px)' }}>
                            <Anchor size={32} />
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>CRONOS</h1>
                    </div>
                    <h2 style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '2rem' }}>
                        Jaminan Kualitas <br /> <span style={{ color: '#34d399' }}>Dari Hulu ke Hilir.</span>
                    </h2>
                    <p style={{ fontSize: '1.25rem', opacity: 0.8, maxWidth: '500px', lineHeight: 1.6 }}>
                        Masuk untuk mengelola tambak, logistik, atau memantau perjalanan produk udang Anda dengan transparansi penuh.
                    </p>
                </div>

                {/* Abstract Circles Background */}
                <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', backgroundColor: '#10B981', opacity: 0.1, filter: 'blur(80px)' }} />
                <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '400px', height: '400px', borderRadius: '50%', backgroundColor: '#34d399', opacity: 0.1, filter: 'blur(60px)' }} />
            </div>

            {/* Right Side - Form */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                backgroundColor: '#f9fafb'
            }}>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ width: '100%', maxWidth: '480px', backgroundColor: 'white', padding: '3rem', borderRadius: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.05)' }}
                >
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>Selamat Datang</h2>
                        <p style={{ color: '#6b7280', fontSize: '1rem' }}>Silahkan masuk dengan akun Anda.</p>
                    </div>

                    {/* Role Tabs */}
                    <div style={{ display: 'flex', backgroundColor: '#f3f4f6', padding: '0.35rem', borderRadius: '1rem', marginBottom: '2rem' }}>
                        {roles.map((r) => (
                            <button
                                key={r.id}
                                onClick={() => setRole(r.id)}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    fontSize: '0.9rem',
                                    borderRadius: '0.75rem',
                                    backgroundColor: role === r.id ? 'white' : 'transparent',
                                    color: role === r.id ? '#059669' : '#6b7280',
                                    fontWeight: role === r.id ? 700 : 500,
                                    boxShadow: role === r.id ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="name@cronos.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                style={{ fontSize: '1rem' }}
                            />
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        {error && <div style={{ padding: '1rem', backgroundColor: '#FEF2F2', color: '#B91C1C', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid #FECACA' }}>{error}</div>}

                        <Button type="submit" style={{ width: '100%', padding: '1rem', fontSize: '1rem', borderRadius: '0.75rem' }} disabled={isLoading}>
                            {isLoading ? 'Memproses...' : 'Masuk ke Dashboard'}
                        </Button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.95rem', color: '#6b7280' }}>
                        Belum memiliki akun? <Link to="/register" style={{ color: '#059669', fontWeight: 700, textDecoration: 'none' }}>Daftar Sekarang</Link>
                    </p>
                </motion.div>
            </div>

        </div>
    );
};

export default LoginPage;
