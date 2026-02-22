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
    const [formData, setFormData] = useState<any>({
        name: '', email: '', password: '', confirmPassword: '', phone: '',
        address: '',
        // Petambak
        nik: '', npwp: '', bank_name: '', bank_account_number: '', bank_account_name: '',
        // Logistik
        vehicle_type: '', license_plate: '', vehicle_capacity_kg: '', driver_name: '', driver_license_number: '', is_cold_storage: false
    });
    const [files, setFiles] = useState<any>({});
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
            const data = new FormData();
            // Basic
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('password', formData.password);
            data.append('phone', formData.phone);

            // Role specific
            if (role === 'konsumen' || role === 'petambak') {
                data.append('address', formData.address);
            }

            if (role === 'petambak') {
                data.append('nik', formData.nik);
                data.append('npwp', formData.npwp);
                data.append('bank_name', formData.bank_name);
                data.append('bank_account_number', formData.bank_account_number);
                data.append('bank_account_name', formData.bank_account_name);
                if (files.foto_ktp) data.append('foto_ktp', files.foto_ktp);
                if (files.foto_tambak) data.append('foto_tambak', files.foto_tambak);
            }

            if (role === 'logistik') {
                data.append('vehicle_type', formData.vehicle_type);
                data.append('license_plate', formData.license_plate);
                data.append('vehicle_capacity_kg', formData.vehicle_capacity_kg);
                data.append('driver_name', formData.driver_name);
                data.append('driver_license_number', formData.driver_license_number);
                data.append('is_cold_storage', formData.is_cold_storage ? 'true' : 'false');
                if (files.stnk_photo) data.append('stnk_photo', files.stnk_photo);
            }

            await register(role, data);
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
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFiles({ ...files, [e.target.name]: e.target.files[0] });
        }
    };

    return (
        <div className="min-h-screen py-24 flex items-center justify-center bg-emerald-50 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-200/50 p-8 md:p-12"
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
                            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${role === r.id ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                    <div className="md:col-span-2">
                        <Input name="name" label="Nama Lengkap / Perusahaan" placeholder="John Doe / PT. Maju Jaya" value={formData.name} onChange={handleChange} required />
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

                    {role === 'petambak' && (
                        <>
                            <div className="md:col-span-2 mt-4 mb-2">
                                <h3 className="text-lg font-bold text-emerald-800 border-b pb-2 mb-4">Detail Usaha & Bank</h3>
                            </div>
                            <Input name="nik" label="NIK (KTP)" placeholder="3201xxxxxx" value={formData.nik} onChange={handleChange} />
                            <Input name="npwp" label="NPWP" placeholder="12.345.xxx.x-xxx.xxx" value={formData.npwp} onChange={handleChange} />

                            <Input name="bank_name" label="Nama Bank" placeholder="BCA / Mandiri" value={formData.bank_name} onChange={handleChange} />
                            <Input name="bank_account_number" label="Nomor Rekening" placeholder="1234567890" value={formData.bank_account_number} onChange={handleChange} />
                            <div className="md:col-span-2">
                                <Input name="bank_account_name" label="Nama Pemilik Rekening" placeholder="Sesuai Buku Tabungan" value={formData.bank_account_name} onChange={handleChange} />
                            </div>

                            <div className="md:col-span-2 mt-4 mb-2">
                                <h3 className="text-lg font-bold text-emerald-800 border-b pb-2 mb-4">Dokumen Pendukung</h3>
                            </div>
                            <div className="md:col-span-1">
                                <label className="block mb-2 font-medium text-slate-700">Foto KTP</label>
                                <input type="file" name="foto_ktp" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" accept="image/*" />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block mb-2 font-medium text-slate-700">Foto Tambak</label>
                                <input type="file" name="foto_tambak" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" accept="image/*" />
                            </div>
                        </>
                    )}

                    {role === 'logistik' && (
                        <>
                            <div className="md:col-span-2 mt-4 mb-2">
                                <h3 className="text-lg font-bold text-emerald-800 border-b pb-2 mb-4">Detail Kendaraan</h3>
                            </div>
                            <Input name="vehicle_type" label="Jenis Kendaraan" placeholder="Truk Pendingin / Pickup" value={formData.vehicle_type} onChange={handleChange} required />
                            <Input name="license_plate" label="Plat Nomor" placeholder="B 1234 XY" value={formData.license_plate} onChange={handleChange} required />
                            <Input name="vehicle_capacity_kg" label="Kapasitas Angkut (kg)" type="number" placeholder="1000" value={formData.vehicle_capacity_kg} onChange={handleChange} />

                            <div className="md:col-span-2 flex items-center gap-2 mb-4">
                                <input type="checkbox" id="is_cold_storage" name="is_cold_storage" checked={formData.is_cold_storage} onChange={handleChange} className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500" />
                                <label htmlFor="is_cold_storage" className="font-medium text-slate-700">Kendaraan memiliki pendingin (Cold Storage)?</label>
                            </div>

                            <div className="md:col-span-2 mt-4 mb-2">
                                <h3 className="text-lg font-bold text-emerald-800 border-b pb-2 mb-4">Detail Pengemudi</h3>
                            </div>
                            <Input name="driver_name" label="Nama Pengemudi" placeholder="Budi Santoso" value={formData.driver_name} onChange={handleChange} />
                            <Input name="driver_license_number" label="Nomor SIM" placeholder="SIM B1 Umum" value={formData.driver_license_number} onChange={handleChange} />
                            <div className="md:col-span-2">
                                <label className="block mb-2 font-medium text-slate-700">Foto STNK</label>
                                <input type="file" name="stnk_photo" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" accept="image/*" />
                            </div>
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
