
import { motion } from 'framer-motion';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, BarChart3, ChevronRight } from 'lucide-react';

const LandingPage = () => {
    return (
        <div style={{ paddingTop: '5rem', minHeight: '100vh', background: 'linear-gradient(to bottom right, #f0fdf4, #ffffff)' }}>

            {/* Hero Section */}
            <section className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '1.5rem', lineHeight: 1.2 }}
                >
                    Jamin Keaslian Udang Anda dengan <span style={{ color: 'var(--color-primary)' }}>CRONOS</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginBottom: '3rem', maxWidth: '700px', margin: '0 auto 3rem auto' }}
                >
                    Sistem pengawasan rantai pasok udang berbasis teknologi terkini untuk menjamin kualitas, keamanan, dan transparansi dari tambak hingga meja makan.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}
                >
                    <Link to="/register">
                        <Button style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>Mulai Sekarang <ChevronRight size={20} /></Button>
                    </Link>
                    <Link to="/traceability">
                        <Button variant="outline" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>Lacak Produk</Button>
                    </Link>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="container" style={{ padding: '6rem 1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {[
                        {
                            icon: <ShieldCheck size={48} color="var(--color-primary)" />,
                            title: "Traceability Terjamin",
                            desc: "Pantau perjalanan produk udang dari kolam panen hingga sampai di tangan konsumen dengan data transparan."
                        },
                        {
                            icon: <Truck size={48} color="var(--color-primary)" />,
                            title: "Logistik Terintegrasi",
                            desc: "Sistem manajemen logistik yang efisien memastikan kesegaran produk selama pengiriman."
                        },
                        {
                            icon: <BarChart3 size={48} color="var(--color-primary)" />,
                            title: "Dashboard Interaktif",
                            desc: "Pantau performa bisnis, stok, dan pesanan melalui dashboard yang responsif dan mudah digunakan."
                        }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                            viewport={{ once: true }}
                            style={{
                                backgroundColor: 'white',
                                padding: '2rem',
                                borderRadius: '1rem',
                                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
                                border: '1px solid #f0fdf4'
                            }}
                        >
                            <div style={{ marginBottom: '1.5rem', backgroundColor: '#ecfdf5', width: 'fit-content', padding: '1rem', borderRadius: '1rem' }}>
                                {item.icon}
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#064e3b' }}>{item.title}</h3>
                            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Image Showcase (Using Generate Image Placeholder Concept) */}
            <section className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                {/* Placeholder for now, typically would use an image here */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        borderRadius: '2rem',
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)',
                        border: '5px solid #ffffff'
                    }}
                >
                    <img
                        src="/cronos_dashboard_preview.png"
                        alt="Visualisasi Dashboard CRONOS"
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                </motion.div>
            </section>

        </div>
    );
};

export default LandingPage;
