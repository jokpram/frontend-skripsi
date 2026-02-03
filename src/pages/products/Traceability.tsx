import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { motion } from 'framer-motion';
import { CheckCircle, Package, MapPin, Droplets, Calendar, Shield, AlertTriangle } from 'lucide-react';
import type { BatchUdang } from '../../types/models';

interface TraceResult {
    batch: BatchUdang;
    tambak: {
        nama_tambak: string;
        lokasi: string;
        petambak_name: string;
    };
    journey: {
        stage: string;
        date: string;
        location: string;
        icon: any;
    }[];
    integrity: 'VALID' | 'DATA TAMPERED';
}

const TraceabilityPage = () => {
    const [batchId, setBatchId] = useState('');
    const [result, setResult] = useState<TraceResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!batchId.trim()) {
            toast.error('Masukkan Batch ID');
            return;
        }

        setIsLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await api.get(`/products/trace/${batchId}`);
            const data = res.data;

            // Build journey from batch data
            const journey = [
                {
                    stage: 'Bibit Ditebar',
                    date: data.batch.tanggal_tebar,
                    location: data.tambak.lokasi,
                    icon: Package
                },
                {
                    stage: 'Pemeliharaan',
                    date: `pH: ${data.batch.kualitas_air_ph}, Salinitas: ${data.batch.kualitas_air_salinitas}`,
                    location: data.tambak.nama_tambak,
                    icon: Droplets
                }
            ];

            if (data.batch.tanggal_panen) {
                journey.push({
                    stage: 'Panen',
                    date: data.batch.tanggal_panen,
                    location: data.tambak.lokasi,
                    icon: CheckCircle
                });
            }

            setResult({
                batch: data.batch,
                tambak: data.tambak,
                journey,
                integrity: data.integrity
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Batch tidak ditemukan');
            toast.error('Batch tidak ditemukan');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', paddingBottom: '4rem' }}>

            {/* Header / Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #064e3b 0%, #10B981 100%)',
                padding: '8rem 1rem 4rem 1rem',
                color: 'white',
                textAlign: 'center',
                borderBottomLeftRadius: '2rem',
                borderBottomRightRadius: '2rem',
                marginBottom: '3rem'
            }}>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}
                >
                    Lacak Perjalanan Produk
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}
                >
                    Transparansi penuh dari tambak ke tangan Anda. Masukkan Batch ID untuk memulai.
                </motion.p>
            </div>

            <div className="container" style={{ maxWidth: '800px', margin: '0 auto', marginTop: '-6rem' }}>

                {/* Search Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '1.5rem',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        marginBottom: '3rem'
                    }}
                >
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '0.5rem' }}>Cari Batch ID</h2>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Input
                                label=""
                                placeholder="Contoh: 1, 2, 3..."
                                value={batchId}
                                onChange={(e) => setBatchId(e.target.value)}
                                style={{ marginBottom: 0, flex: 1 }}
                            />
                            <Button type="submit" style={{ padding: '0 2rem' }} disabled={isLoading}>
                                {isLoading ? 'Mencari...' : 'Lacak'}
                            </Button>
                        </div>
                        {error && (
                            <p style={{ color: '#dc2626', fontSize: '0.9rem', marginTop: '0.5rem' }}>{error}</p>
                        )}
                    </form>
                </motion.div>

                {/* Results Section */}
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 50 }}
                    >
                        {/* Integrity Badge */}
                        <div style={{
                            backgroundColor: result.integrity === 'VALID' ? '#ecfdf5' : '#fef2f2',
                            border: `2px solid ${result.integrity === 'VALID' ? '#10b981' : '#ef4444'}`,
                            borderRadius: '1rem',
                            padding: '1rem 1.5rem',
                            marginBottom: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            {result.integrity === 'VALID' ? (
                                <>
                                    <Shield size={32} style={{ color: '#10b981' }} />
                                    <div>
                                        <p style={{ fontWeight: 700, color: '#065f46' }}>Data Terverifikasi</p>
                                        <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Integritas data terjamin oleh blockchain hash</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <AlertTriangle size={32} style={{ color: '#ef4444' }} />
                                    <div>
                                        <p style={{ fontWeight: 700, color: '#991b1b' }}>Peringatan: Data Tidak Valid</p>
                                        <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Terdeteksi perubahan data yang tidak sah</p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Product Summary Card */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '1.5rem',
                            overflow: 'hidden',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            marginBottom: '2rem',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{ backgroundColor: '#ecfdf5', padding: '1.5rem', borderBottom: '1px solid #d1fae5' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontSize: '0.875rem', color: '#059669', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Batch ID</p>
                                        <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#064e3b' }}>#{result.batch.id}</h2>
                                    </div>
                                    <div style={{ backgroundColor: '#10B981', color: 'white', padding: '0.5rem 1rem', borderRadius: '2rem', fontWeight: 600, fontSize: '0.875rem' }}>
                                        {result.batch.tanggal_panen ? 'Sudah Panen' : 'Dalam Budidaya'}
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                    <div style={{ padding: '0.75rem', backgroundColor: '#f3f4f6', borderRadius: '1rem', color: '#4b5563' }}>
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Asal Tambak</p>
                                        <p style={{ fontWeight: 600, color: '#1f2937', fontSize: '1rem' }}>{result.tambak.nama_tambak}</p>
                                        <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>{result.tambak.lokasi}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                    <div style={{ padding: '0.75rem', backgroundColor: '#f3f4f6', borderRadius: '1rem', color: '#4b5563' }}>
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Tanggal Tebar</p>
                                        <p style={{ fontWeight: 600, color: '#1f2937', fontSize: '1rem' }}>{new Date(result.batch.tanggal_tebar).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                    <div style={{ padding: '0.75rem', backgroundColor: '#f3f4f6', borderRadius: '1rem', color: '#4b5563' }}>
                                        <Droplets size={24} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Kualitas Air</p>
                                        <p style={{ fontWeight: 600, color: '#1f2937', fontSize: '1rem' }}>pH: {result.batch.kualitas_air_ph} | Salinitas: {result.batch.kualitas_air_salinitas}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                    <div style={{ padding: '0.75rem', backgroundColor: '#f3f4f6', borderRadius: '1rem', color: '#4b5563' }}>
                                        <Package size={24} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Estimasi Panen</p>
                                        <p style={{ fontWeight: 600, color: '#1f2937', fontSize: '1rem' }}>{result.batch.estimasi_panen_kg} kg</p>
                                    </div>
                                </div>
                            </div>

                            {/* Blockchain Hash */}
                            {result.batch.blockchain_hash && (
                                <div style={{ padding: '1rem 2rem', backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
                                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Blockchain Hash (SHA-256)</p>
                                    <p style={{ fontSize: '0.7rem', color: '#9ca3af', fontFamily: 'monospace', wordBreak: 'break-all' }}>{result.batch.blockchain_hash}</p>
                                </div>
                            )}
                        </div>

                        {/* Timeline */}
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', marginBottom: '1.5rem', paddingLeft: '0.5rem' }}>Riwayat Perjalanan</h3>

                        <div style={{ position: 'relative', paddingLeft: '1rem' }}>
                            {/* Vertical Line */}
                            <div style={{
                                position: 'absolute',
                                left: '2.5rem',
                                top: '1rem',
                                bottom: '1rem',
                                width: '2px',
                                backgroundColor: '#e5e7eb',
                                zIndex: 0
                            }} />

                            {result.journey.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + (idx * 0.1) }}
                                    style={{
                                        marginBottom: '2rem',
                                        position: 'relative',
                                        zIndex: 1,
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '1.5rem'
                                    }}
                                >
                                    {/* Icon Bubble */}
                                    <div style={{
                                        width: '3rem',
                                        height: '3rem',
                                        borderRadius: '50%',
                                        backgroundColor: idx === result.journey.length - 1 ? '#10B981' : 'white',
                                        border: '2px solid #10B981',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: idx === result.journey.length - 1 ? 'white' : '#10B981',
                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                        flexShrink: 0
                                    }}>
                                        <step.icon size={18} />
                                    </div>

                                    {/* Content Card */}
                                    <div style={{
                                        backgroundColor: 'white',
                                        padding: '1.5rem',
                                        borderRadius: '1rem',
                                        border: '1px solid #f3f4f6',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                        flex: 1
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            <h4 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1f2937' }}>{step.stage}</h4>
                                            <span style={{ fontSize: '0.875rem', color: '#6b7280', backgroundColor: '#f9fafb', padding: '0.25rem 0.5rem', borderRadius: '0.5rem' }}>
                                                {step.date}
                                            </span>
                                        </div>
                                        <p style={{ color: '#4b5563', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <MapPin size={14} color="#9ca3af" /> {step.location}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default TraceabilityPage;
