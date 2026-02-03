import React, { useState } from 'react';
import toast from 'react-hot-toast';
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
            const payload: Record<string, any> = {
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
            toast.success('Registrasi berhasil! Silahkan masuk setelah diverifikasi.');
            navigate('/login');
        } catch (err: any) {
            const apiError = err as { response?: { data?: { message?: string } } };
            setError(apiError.response?.data?.message || 'Registrasi gagal');
            toast.error('Gagal mendaftar');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen py-24 flex items-center justify-center bg-emerald-50 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-200/50 p-8 md:p-12"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 rounded-3xl bg-emerald-100 text-emerald-600 mb-6 shadow-sm">
                        <Anchor size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900">Buat Akun Baru</h2>
                    <p className="text-slate-500 font-medium">Bergabung dengan ekosistem CRONOS hari ini.</p>
                </div>

                {/* Role Tabs */}
                <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-10 overflow-hidden">
                    {roles.map((r) => (
                        <button
                            key={r.id}
                            type="button"
                            onClick={() => setRole(r.id)}
                            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${role === r.id ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                    <div className="md:col-span-2">
                        <Input name="name" label="Nama Lengkap" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
                    </div>

                    <Input name="email" label="Email Address" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
                    <Input name="phone" label="Nomor Telepon" placeholder="0812..." value={formData.phone} onChange={handleChange} required />

                    <Input name="password" label="Password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                    <Input name="confirmPassword" label="Konfirmasi Password" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />

                    {/* Dynamic Fields */}
                    {(role === 'petambak' || role === 'konsumen') && (
                        <div className="md:col-span-2">
                            <Input name="address" label="Alamat Lengkap" placeholder="Jl. Raya No. 123..." value={formData.address} onChange={handleChange} required />
                        </div>
                    )}

                    {role === 'logistik' && (
                        <>
                            <Input name="vehicle_type" label="Jenis Kendaraan" placeholder="Truk Pendingin" value={formData.vehicle_type} onChange={handleChange} required />
                            <Input name="license_plate" label="Plat Nomor" placeholder="B 1234 XY" value={formData.license_plate} onChange={handleChange} required />
                        </>
                    )}

                    <div className="md:col-span-2 mt-8">
                        {error && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-50 text-red-600 rounded-xl mb-6 text-sm font-medium border border-red-100 italic">
                                * {error}
                            </motion.div>
                        )}
                        <Button type="submit" className="w-full py-4 text-lg shadow-xl shadow-emerald-500/20" disabled={isLoading}>
                            {isLoading ? 'Mendaftar...' : 'Daftar Sekarang'}
                        </Button>
                    </div>
                </form>

                <p className="text-center mt-8 text-slate-500 font-medium">
                    Sudah punya akun?{' '}
                    <Link to="/login" className="text-emerald-600 font-black hover:underline">
                        Masuk Disini
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
