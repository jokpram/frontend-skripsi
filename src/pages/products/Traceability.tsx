import { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { motion } from 'framer-motion';
import { CheckCircle, Truck, Package, MapPin } from 'lucide-react';

const TraceabilityPage = () => {
    const [batchId, setBatchId] = useState('');
    const [result, setResult] = useState<any>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulation of data
        if (batchId) {
            setResult({
                id: batchId,
                origin: 'Tambak Udang Makmur, Banyuwangi',
                harvestDate: '2023-10-15',
                status: 'Delivered',
                journey: [
                    { stage: 'Harvested', date: '2023-10-15 08:00', location: 'Banyuwangi', icon: Package },
                    { stage: 'Quality Check', date: '2023-10-15 10:00', location: 'Banyuwangi QC Center', icon: CheckCircle },
                    { stage: 'In Transit', date: '2023-10-16 14:00', location: 'Logistik Pantura', icon: Truck },
                    { stage: 'Delivered', date: '2023-10-17 09:30', location: 'Jakarta', icon: MapPin },
                ]
            });
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
                    Transparansi penuh dari tambak ke tangan anda. Masukkan Batch ID untuk memulai.
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
                                placeholder="Contoh: B-202310-001"
                                value={batchId}
                                onChange={(e) => setBatchId(e.target.value)}
                                style={{ marginBottom: 0, flex: 1 }}
                                className="search-input" // Requires global css or inline style override for height if needed
                            />
                            <Button type="submit" style={{ padding: '0 2rem' }}>Lacak</Button>
                        </div>
                    </form>
                </motion.div>

                {/* Results Section */}
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 50 }}
                    >
                        {/* Product Summary Card */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '1.5rem',
                            overflow: 'hidden',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            marginBottom: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{ backgroundColor: '#ecfdf5', padding: '1.5rem', borderBottom: '1px solid #d1fae5' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontSize: '0.875rem', color: '#059669', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Batch Code</p>
                                        <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#064e3b' }}>{result.id}</h2>
                                    </div>
                                    <div style={{ backgroundColor: '#10B981', color: 'white', padding: '0.5rem 1rem', borderRadius: '2rem', fontWeight: 600, fontSize: '0.875rem' }}>
                                        {result.status}
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
                                        <p style={{ fontWeight: 600, color: '#1f2937', fontSize: '1.1rem' }}>{result.origin}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                    <div style={{ padding: '0.75rem', backgroundColor: '#f3f4f6', borderRadius: '1rem', color: '#4b5563' }}>
                                        <Package size={24} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Tanggal Panen</p>
                                        <p style={{ fontWeight: 600, color: '#1f2937', fontSize: '1.1rem' }}>{new Date(result.harvestDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                </div>
                            </div>
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

                            {result.journey.map((step: any, idx: number) => (
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
                                        border: `2px solid ${idx === result.journey.length - 1 ? '#10B981' : '#10B981'}`,
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
