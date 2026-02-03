import React, { useState } from 'react';
import { register } from '../../services/authService';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Anchor } from 'lucide-react';

const roles = [
    { id: 'konsumen', label: 'Konsumen' },
    { id: 'petambak', label: 'Petambak' },
    { id: 'logistik', label: 'Logistik' }
];

const RegisterPage = () => {
    const navigate = useNavigate();

    const [role, setRole] = useState('konsumen');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        // Role specific
        address: '',
        vehicle_type: '',
        license_plate: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Password tidak sama');
            return;
        }
        setError('');
        setIsLoading(true);

        try {
            // Filter data required for role
            const payload: any = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone
            };

            if (role === 'konsumen' || role === 'petambak') {
                payload.address = formData.address;
            }
            if (role === 'logistik') {
                payload.vehicle_type = formData.vehicle_type;
                payload.license_plate = formData.license_plate;
            }

            await register(role, payload);
            // Redirect to login with success message usually, or auto login. 
            // Verification system is in place: "Pending Verification"
            navigate('/login');
            alert('Registrasi berhasil! Silahkan masuk setelah akun diverifikasi admin.');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registrasi gagal');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0fdf4', padding: '1rem' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ width: '100%', maxWidth: '600px', backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: '50%', backgroundColor: '#d1fae5', color: '#059669', marginBottom: '1rem' }}>
                        <Anchor size={32} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937' }}>Buat Akun Baru</h2>
                    <p style={{ color: '#6b7280' }}>Bergabung dengan CRONOS</p>
                </div>

                {/* Role Tabs */}
                <div style={{ display: 'flex', backgroundColor: '#f3f4f6', padding: '0.25rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                    {roles.map((r) => (
                        <button
                            key={r.id}
                            type="button"
                            onClick={() => setRole(r.id)}
                            style={{
                                flex: 1,
                                padding: '0.5rem',
                                fontSize: '0.875rem',
                                borderRadius: '0.375rem',
                                backgroundColor: role === r.id ? 'white' : 'transparent',
                                color: role === r.id ? '#059669' : '#6b7280',
                                fontWeight: role === r.id ? 600 : 400,
                                boxShadow: role === r.id ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none',
                                transition: 'all 0.2s',
                            }}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                        <Input name="name" label="Nama Lengkap" placeholder="Nama Lengkap" value={formData.name} onChange={handleChange} required />
                    </div>

                    <Input name="email" label="Email" type="email" placeholder="nama@email.com" value={formData.email} onChange={handleChange} required />
                    <Input name="phone" label="Nomor Telepon" placeholder="08..." value={formData.phone} onChange={handleChange} required />

                    <Input name="password" label="Password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                    <Input name="confirmPassword" label="Konfirmasi Password" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />

                    {/* Dynamic Fields */}
                    {(role === 'petambak' || role === 'konsumen') && (
                        <div style={{ gridColumn: 'span 2' }}>
                            <Input name="address" label="Alamat Lengkap" placeholder="Alamat lengkap..." value={formData.address} onChange={handleChange} required />
                        </div>
                    )}

                    {role === 'logistik' && (
                        <>
                            <Input name="vehicle_type" label="Jenis Kendaraan" placeholder="Truk, Van, dll" value={formData.vehicle_type} onChange={handleChange} required />
                            <Input name="license_plate" label="Plat Nomor" placeholder="B 1234 CD" value={formData.license_plate} onChange={handleChange} required />
                        </>
                    )}

                    <div style={{ gridColumn: 'span 2' }}>
                        {error && <div style={{ padding: '0.75rem', backgroundColor: '#FEE2E2', color: '#B91C1C', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
                        <Button type="submit" style={{ width: '100%' }} disabled={isLoading}>
                            {isLoading ? 'Mendaftar...' : 'Daftar Sekarang'}
                        </Button>
                    </div>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    Sudah punya akun? <Link to="/login" style={{ color: '#059669', fontWeight: 600 }}>Masuk</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
