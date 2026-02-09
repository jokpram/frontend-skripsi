import { useState } from 'react';
import toast from 'react-hot-toast';
import { getProductTrace } from '../../services/productService';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { motion } from 'framer-motion';
import { CheckCircle, Package, MapPin, Droplets, Shield, AlertTriangle } from 'lucide-react';
import { Calendar } from 'lucide-react';
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
            const batch = data;
            const tambak = data.Tambak;

            const journey = [
                { stage: 'Bibit Ditebar', date: batch.tanggal_tebar, location: tambak?.lokasi || 'Unknown', icon: Package },
                { stage: 'Pemeliharaan', date: `pH: ${batch.kualitas_air_ph}, Salinitas: ${batch.kualitas_air_salinitas}`, location: tambak?.nama_tambak || 'Unknown', icon: Droplets }
            ];
            if (batch.tanggal_panen) {
                journey.push({ stage: 'Panen', date: batch.tanggal_panen, location: tambak?.lokasi || 'Unknown', icon: CheckCircle });
            }
            setResult({ integrity: batch.integrity || 'VALID', batch, tambak, journey });
        },
        onError: () => {
            toast.error('Batch tidak ditemukan');
        }
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!batchId.trim()) return toast.error('Masukkan Batch ID');
        traceMutation.mutate(batchId);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="bg-gradient-to-br from-emerald-800 to-emerald-600 pt-32 pb-24 px-4 text-center rounded-b-[3rem] shadow-lg shadow-emerald-900/10">
                <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-black text-white mb-4">Lacak Perjalanan Produk</motion.h1>
                <p className="text-emerald-100 text-lg max-w-2xl mx-auto">Masukkan Batch ID produk untuk memverifikasi keaslian dan kualitasnya.</p>
            </div>

            <div className="container mx-auto px-4 max-w-3xl -mt-16">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100 mb-12">
                    <form onSubmit={handleSearch} className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-800">Verifikasi Batch ID</h2>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Input label="" placeholder="Masukkan Batch ID (Contoh: 1)" value={batchId} onChange={(e) => setBatchId(e.target.value)} className="mb-0 h-14" />
                            <Button type="submit" className="h-14 px-10 rounded-xl" disabled={traceMutation.isPending}>
                                {traceMutation.isPending ? 'Memproses...' : 'Lacak Sekarang'}
                            </Button>
                        </div>
                    </form>
                </motion.div>

                {result && (
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        <div className={`p-6 rounded-3xl border-2 flex items-center gap-6 ${result.integrity === 'VALID' ? 'bg-emerald-50 border-emerald-500/10 text-emerald-900' : 'bg-red-50 border-red-500/10 text-red-900'}`}>
                            <div className={`p-4 rounded-2xl ${result.integrity === 'VALID' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                                {result.integrity === 'VALID' ? <Shield size={32} /> : <AlertTriangle size={32} />}
                            </div>
                            <div>
                                <p className="text-xl font-black">{result.integrity === 'VALID' ? 'Data Terverifikasi' : 'Peringatan: Manipulasi Data'}</p>
                                <p className="opacity-70 text-sm">Blockchain-verified records ensure complete transparency.</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                            <div className="bg-emerald-900 p-8 text-white flex justify-between items-center">
                                <div><p className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-1">Blockchain Entry</p><h2 className="text-4xl font-black">BATCH #{result.batch.id}</h2></div>
                                <div className="text-right">
                                    <p className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-1">Chain Status</p>
                                    <span className="inline-flex items-center gap-2 bg-emerald-800/50 px-3 py-1 rounded-full text-sm font-medium">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Linked & Secure
                                    </span>
                                </div>
                            </div>
                            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="flex gap-4"><div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-emerald-500"><MapPin size={24} /></div><div><p className="text-slate-400 text-xs font-bold uppercase mb-1">Origin</p><p className="font-bold text-slate-800">{result.tambak.nama_tambak}</p></div></div>
                                <div className="flex gap-4"><div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-emerald-500"><Calendar size={24} /></div><div><p className="text-slate-400 text-xs font-bold uppercase mb-1">Stocked Date</p><p className="font-bold text-slate-800">{result.batch.tanggal_tebar}</p></div></div>
                                <div className="col-span-1 md:col-span-2 pt-4 border-t border-slate-100">
                                    <p className="text-slate-400 text-xs font-bold uppercase mb-2">Immutable Hash</p>
                                    <code className="block bg-slate-50 p-3 rounded-xl text-xs text-slate-500 font-mono break-all border border-slate-100">
                                        {result.batch.blockchain_hash}
                                    </code>
                                </div>
                            </div>
                        </div>

                        <div className="pt-10">
                            <h3 className="text-2xl font-black text-slate-800 mb-10 pl-2 border-l-8 border-emerald-500">The Shrimp Journey</h3>
                            <div className="relative pl-6 space-y-12">
                                <div className="absolute left-10 top-2 bottom-2 w-1 bg-slate-200" />
                                {result.journey.map((step: any, idx: number) => (
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} key={idx} className="relative z-10 flex gap-8">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${idx === result.journey.length - 1 ? 'bg-emerald-500 text-white' : 'bg-white text-emerald-500'}`}><step.icon size={20} /></div>
                                        <div className="flex-1 bg-white p-6 rounded-3xl border border-slate-100 group"><h4 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{step.stage}</h4><p className="text-slate-500 text-sm mt-1">{step.location}</p></div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default TraceabilityPage;
