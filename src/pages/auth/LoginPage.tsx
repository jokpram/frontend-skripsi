import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, setLoading, setError as setAuthError } from '../../store/slices/authSlice';
import { login } from '../../services/authService';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Anchor } from 'lucide-react';
import type { RootState } from '../../store';

const roles = [
    { id: 'konsumen', label: 'Konsumen' },
    { id: 'petambak', label: 'Petambak' },
    { id: 'logistik', label: 'Logistik' },
    { id: 'admin', label: 'Admin' }
];

const LoginPage = () => {
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    const [role, setRole] = useState('konsumen');
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [localError, setLocalError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');
        dispatch(setLoading(true));

        try {
            const data = await login(role, formData);
            dispatch(setCredentials({ user: data.user, token: data.token }));
            toast.success(`Selamat datang kembali, ${data.user.name}!`);
            navigate('/dashboard');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Login failed';
            setLocalError(msg);
            dispatch(setAuthError(msg));
            toast.error(msg);
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Brand/Image */}
            <div className="hidden lg:flex flex-1 bg-emerald-900 flex-col justify-center p-16 relative overflow-hidden">
                <div className="relative z-10 text-white">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                            <Anchor size={32} />
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight">CRONOS</h1>
                    </div>
                    <h2 className="text-5xl font-bold leading-tight mb-8">
                        Jaminan Kualitas <br /> <span className="text-emerald-400">Dari Hulu ke Hilir.</span>
                    </h2>
                    <p className="text-xl text-white/80 max-w-lg leading-relaxed">
                        Masuk untuk mengelola tambak, logistik, atau memantau perjalanan produk udang Anda dengan transparansi penuh.
                    </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50"
                >
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Selamat Datang</h2>
                        <p className="text-slate-500">Silahkan masuk dengan akun Anda.</p>
                    </div>

                    {/* Role Tabs */}
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
                        {roles.map((r) => (
                            <button
                                key={r.id}
                                onClick={() => setRole(r.id)}
                                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-200 ${role === r.id
                                    ? 'bg-white text-emerald-600 shadow-sm'
                                    : 'bg-transparent text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="name@cronos.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />

                        {localError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100"
                            >
                                {localError}
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            className="w-full py-4 text-lg rounded-xl"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Memproses...' : 'Masuk ke Dashboard'}
                        </Button>
                    </form>

                    <p className="text-center mt-8 text-slate-500">
                        Belum memiliki akun?{' '}
                        <Link to="/register" className="text-emerald-600 font-bold hover:underline">
                            Daftar Sekarang
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;
