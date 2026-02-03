import { useState, useEffect } from 'react';

import { Button } from '../../components/common/Button';
import { ShoppingCart, Package, Info } from 'lucide-react';

const KonsumenDashboard = () => {
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Mock products if API empty or endpoint logic needs adjustments
                // But normally: api.get('/products')
                // Using mock for visuals if products empty
                // const res = await api.get('/products');
                // setProducts(res.data);

                // Mock Data for aesthetics
                setProducts([
                    { id: 1, name: 'Udang Vaname Segar King Size', price: 85000, batch_code: 'B-202310-001', stock: 50 },
                    { id: 2, name: 'Udang Windu Premium', price: 120000, batch_code: 'B-202310-002', stock: 20 },
                    { id: 3, name: 'Udang Vaname Medium', price: 65000, batch_code: 'B-202310-003', stock: 100 },
                ]);

            } catch (err) {
                console.error(err);
            }
        };
        fetchProducts();
    }, []);

    const handleOrder = (id: number) => {
        console.log('Ordering product', id);
        alert('Fitur Checkout akan segera hadir!');
    };

    return (
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '3rem' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#064e3b' }}>Marketplace Udang Segar</h1>
                <p style={{ color: '#6b7280' }}>Beli udang berkualitas langsung dari petambak terverifikasi</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                {products.map(product => (
                    <div key={product.id} style={{ backgroundColor: 'white', borderRadius: '1rem', overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }}>
                        <div style={{ height: '200px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                            {/* Placeholder Image */}
                            <Package size={48} />
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1f2937' }}>{product.name}</h3>
                            </div>
                            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#059669', marginBottom: '1rem' }}>
                                Rp {product.price.toLocaleString('id-ID')} <span style={{ fontSize: '0.875rem', fontWeight: 400, color: '#6b7280' }}>/ kg</span>
                            </p>

                            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Info size={16} /> Batch: {product.batch_code}
                            </div>

                            <Button onClick={() => handleOrder(product.id)} style={{ width: '100%' }}>
                                <ShoppingCart size={18} /> Beli Sekarang
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KonsumenDashboard;
