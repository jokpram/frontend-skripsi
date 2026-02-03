import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Plus, Package, MapPin } from 'lucide-react';

const PetambakDashboard = () => {
    // State for Tambak Data
    const [tambaks, setTambaks] = useState<any[]>([]);
    const [showTambakModal, setShowTambakModal] = useState(false);
    const [newTambak, setNewTambak] = useState({ name: '', location: '', size: '' });

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/tambak');
                setTambaks(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const handleCreateTambak = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/tambak', newTambak);
            setTambaks([...tambaks, res.data]);
            setShowTambakModal(false);
            setNewTambak({ name: '', location: '', size: '' });
        } catch (err) {
            alert('Gagal membuat tambak');
        }
    };

    return (
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '3rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#064e3b' }}>Dashboard Petambak</h1>
                    <p style={{ color: '#6b7280' }}>Kelola kolam dan panen udang Anda</p>
                </div>
                <Button onClick={() => setShowTambakModal(true)}>
                    <Plus size={20} /> Tambah Tambak
                </Button>
            </header>

            {/* Tambak List */}
            <section>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#1f2937' }}>Daftar Tambak Saya</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {tambaks.map((tambak) => (
                        <div key={tambak.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{tambak.name}</h3>
                                <span style={{ color: '#059669', backgroundColor: '#ecfdf5', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', fontSize: '0.75rem' }}>Aktif</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                <MapPin size={16} /> {tambak.location}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                <Package size={16} /> Luas: {tambak.size} m²
                            </div>

                            <Button variant="outline" style={{ width: '100%', fontSize: '0.9rem' }}>Kelola Batch Udang</Button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Modal for New Tambak */}
            {showTambakModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', width: '90%', maxWidth: '500px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Tambah Tambak Baru</h2>
                        <form onSubmit={handleCreateTambak}>
                            <Input
                                label="Nama Tambak"
                                placeholder="Contoh: Tambak Sejahtera 1"
                                value={newTambak.name}
                                onChange={(e) => setNewTambak({ ...newTambak, name: e.target.value })}
                                required
                            />
                            <Input
                                label="Lokasi"
                                placeholder="Contoh: Banyuwangi, Blok A"
                                value={newTambak.location}
                                onChange={(e) => setNewTambak({ ...newTambak, location: e.target.value })}
                                required
                            />
                            <Input
                                label="Luas (m²)"
                                type="number"
                                placeholder="1000"
                                value={newTambak.size}
                                onChange={(e) => setNewTambak({ ...newTambak, size: e.target.value })}
                                required
                            />
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <Button type="button" variant="outline" onClick={() => setShowTambakModal(false)} style={{ flex: 1 }}>Batal</Button>
                                <Button type="submit" style={{ flex: 1 }}>Simpan</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PetambakDashboard;
