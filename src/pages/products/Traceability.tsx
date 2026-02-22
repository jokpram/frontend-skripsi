import { useState } from 'react';
import toast from 'react-hot-toast';
import { getProductTrace } from '../../services/productService';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { motion } from 'framer-motion';
import { CheckCircle, Package, MapPin, Droplets, Shield, AlertTriangle, Thermometer, Activity, Wheat, FileText } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

interface TraceResult {
    integrity: 'VALID' | 'DATA TAMPERED';
    batch: any;
    tambak: any;
    journey: any[];
}

const TraceabilityPage = () => {
    const [batchId, setBatchId] = useState('');
    const [result, setResult] = useState<TraceResult | null>(null);

    const traceMutation = useMutation({
        mutationFn: (id: string) => getProductTrace(id),
        onSuccess: (data: any) => {
            const batch = data.batch;
            const tambak = data.tambak;

            const journey = [
                { stage: 'Bibit Ditebar', date: batch.tanggal_tebar, location: tambak?.lokasi || 'Unknown', icon: Package },
                { stage: 'Masa Pemeliharaan', date: `Usia: ${batch.usia_bibit_hari} hari (Bibit)`, location: tambak?.nama_tambak || 'Unknown', icon: Droplets }
            ];
            if (batch.tanggal_panen) {
                const harvestInfo = batch.total_umur_panen_hari ? `Umur Panen: ${batch.total_umur_panen_hari} hari` : 'Panen Berhasil';
                journey.push({ stage: 'Panen', date: batch.tanggal_panen, location: harvestInfo, icon: CheckCircle });
            }
            setResult({ integrity: data.integrity || 'VALID', batch, tambak, journey });
        },
        onError: () => {
            toast.error('Batch tidak ditemukan');
        }
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!batchId.trim()) return toast.error('Masukkan Batch ID atau Kode Batch');
        traceMutation.mutate(batchId);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="bg-gradient-to-br from-emerald-800 to-emerald-600 pt-32 pb-24 px-4 text-center rounded-b-[3rem] shadow-lg shadow-emerald-900/10">
                <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-black text-white mb-4">Lacak Perjalanan Produk</motion.h1>
                <p className="text-emerald-100 text-lg max-w-2xl mx-auto">Masukkan Kode Batch atau ID unik untuk memverifikasi keaslian, kualitas air, dan jejak rekam produk.</p>
            </div>

            <div className="container mx-auto px-4 max-w-4xl -mt-16">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100 mb-12">
                    <form onSubmit={handleSearch} className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-800">Verifikasi Produk</h2>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Input label="" placeholder="Kode Batch (e.g., CRN-BATCH--001) atau ID" value={batchId} onChange={(e) => setBatchId(e.target.value)} className="mb-0 h-14" />
                            <Button type="submit" className="h-14 px-10 rounded-xl" disabled={traceMutation.isPending}>
                                {traceMutation.isPending ? 'Melacak...' : 'Lacak'}
                            </Button>
                        </div>
                    </form>
                </motion.div>

                {result && (
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        {/* Integrity Badge */}
                        <div className={`p-6 rounded-3xl border-2 flex flex-col md:flex-row items-center gap-6 ${result.integrity === 'VALID' ? 'bg-emerald-50 border-emerald-500/10 text-emerald-900' : 'bg-red-50 border-red-500/10 text-red-900'}`}>
                            <div className={`p-4 rounded-2xl ${result.integrity === 'VALID' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                                {result.integrity === 'VALID' ? <Shield size={40} /> : <AlertTriangle size={40} />}
                            </div>
                            <div className="text-center md:text-left">
                                <p className="text-2xl font-black mb-1">{result.integrity === 'VALID' ? 'AUTHENTIC & VERIFIED' : 'WARNING: POSSIBLE MANIPULATION'}</p>
                                <p className="opacity-80 font-medium">Data integritas {result.integrity === 'VALID' ? 'terjamin' : 'gagal diverifikasi'} oleh teknologi Blockchain.</p>
                            </div>
                        </div>

                        {/* Main Info Card */}
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                            <div className="bg-emerald-900 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <p className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-1">Batch Identification</p>
                                    <h2 className="text-3xl font-black">{result.batch.kode_batch || `BATCH #${result.batch.id}`}</h2>
                                </div>
                                <span className="inline-flex items-center gap-2 bg-emerald-800/50 px-4 py-2 rounded-full text-sm font-bold border border-emerald-700">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Linked to Blockchain
                                </span>
                            </div>

                            <div className="p-8 md:p-10 space-y-10">
                                {/* Section 1: Origin & Seed */}
                                <div>
                                    <h3 className="text-lg font-bold text-emerald-800 border-b border-emerald-100 pb-2 mb-6 flex items-center gap-2"><MapPin size={20} /> Asal & Bibit</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div><p className="text-xs font-bold uppercase text-slate-400 mb-1">Lokasi Tambak</p><p className="font-bold text-slate-800 text-lg">{result.tambak.nama_tambak}</p><p className="text-slate-500 text-sm">{result.tambak.lokasi}</p></div>
                                        <div><p className="text-xs font-bold uppercase text-slate-400 mb-1">Tanggal Tebar</p><p className="font-bold text-slate-800 text-lg">{result.batch.tanggal_tebar}</p></div>
                                        <div><p className="text-xs font-bold uppercase text-slate-400 mb-1">Asal Bibit</p><p className="font-bold text-slate-800 text-lg">{result.batch.asal_bibit}</p></div>
                                        <div><p className="text-xs font-bold uppercase text-slate-400 mb-1">Jumlah Bibit</p><p className="font-bold text-slate-800 text-lg">{result.batch.jumlah_bibit?.toLocaleString() || '-'}</p></div>
                                        <div><p className="text-xs font-bold uppercase text-slate-400 mb-1">Sertifikat Bibit</p><p className="font-bold text-slate-800 text-lg">{result.batch.sertifikat_bibit || '-'}</p></div>
                                    </div>
                                </div>

                                {/* Section 2: Water Quality & Environment */}
                                <div>
                                    <h3 className="text-lg font-bold text-emerald-800 border-b border-emerald-100 pb-2 mb-6 flex items-center gap-2"><Activity size={20} /> Kualitas Air & Lingkungan</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100"><div className="flex items-center gap-2 mb-2 text-blue-600"><Droplets size={16} /><span className="text-xs font-bold uppercase">pH Air</span></div><p className="text-2xl font-black text-slate-800">{result.batch.kualitas_air_ph}</p></div>
                                        <div className="bg-cyan-50 p-4 rounded-2xl border border-cyan-100"><div className="flex items-center gap-2 mb-2 text-cyan-600"><Activity size={16} /><span className="text-xs font-bold uppercase">Salinitas</span></div><p className="text-2xl font-black text-slate-800">{result.batch.kualitas_air_salinitas} <span className="text-sm font-normal text-slate-500">ppt</span></p></div>
                                        <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100"><div className="flex items-center gap-2 mb-2 text-orange-600"><Thermometer size={16} /><span className="text-xs font-bold uppercase">Suhu</span></div><p className="text-2xl font-black text-slate-800">{result.batch.kualitas_air_suhu || '-'} <span className="text-sm font-normal text-slate-500">°C</span></p></div>
                                        <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100"><div className="flex items-center gap-2 mb-2 text-indigo-600"><Activity size={16} /><span className="text-xs font-bold uppercase">Oxygen (DO)</span></div><p className="text-2xl font-black text-slate-800">{result.batch.kualitas_air_do || '-'} <span className="text-sm font-normal text-slate-500">mg/L</span></p></div>
                                    </div>
                                </div>

                                {/* Section 3: Feed & Notes */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-lg font-bold text-emerald-800 border-b border-emerald-100 pb-2 mb-6 flex items-center gap-2"><Wheat size={20} /> Pakan & Perawatan</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between border-b border-slate-50 pb-2"><span className="text-slate-500">Jenis Pakan</span><span className="font-bold text-slate-900">{result.batch.jenis_pakan || '-'}</span></div>
                                            <div className="flex justify-between border-b border-slate-50 pb-2"><span className="text-slate-500">Frekuensi</span><span className="font-bold text-slate-900">{result.batch.frekuensi_pakan_per_hari ? `${result.batch.frekuensi_pakan_per_hari}x /hari` : '-'}</span></div>
                                            <div className="flex justify-between border-b border-slate-50 pb-2"><span className="text-slate-500">Est. Panen</span><span className="font-bold text-slate-900">{result.batch.estimasi_panen_kg?.toLocaleString()} kg</span></div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-emerald-800 border-b border-emerald-100 pb-2 mb-6 flex items-center gap-2"><FileText size={20} /> Catatan Tambahan</h3>
                                        <p className="bg-slate-50 p-4 rounded-2xl text-slate-600 italic border border-slate-100 min-h-[100px]">
                                            "{result.batch.catatan || 'Tidak ada catatan khusus.'}"
                                        </p>
                                    </div>
                                </div>

                                {/* Blockchain Hash */}
                                <div className="pt-6 border-t border-slate-100">
                                    <p className="text-slate-400 text-xs font-bold uppercase mb-2">Immutable Blockchain Hash (SHA-256)</p>
                                    <code className="block bg-slate-900 p-4 rounded-xl text-xs text-emerald-400 font-mono break-all shadow-inner">
                                        {result.batch.blockchain_hash}
                                    </code>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default TraceabilityPage;
