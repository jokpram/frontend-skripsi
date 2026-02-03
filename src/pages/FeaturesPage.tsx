import { motion } from 'framer-motion';
import { ShieldCheck, Truck, BarChart3, Database, Users, Lock } from 'lucide-react';

const FeaturesPage = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const features = [
        {
            icon: <ShieldCheck size={40} />,
            title: "Traceability End-to-End",
            description: "Lacak perjalanan udang dari kolam panen hingga ke tangan konsumen. Pastikan keaslian dan kualitas produk dengan data transparan yang tidak bisa dimanipulasi.",
            color: "#10B981"
        },
        {
            icon: <Truck size={40} />,
            title: "Manajemen Logistik Cerdas",
            description: "Pantau pengiriman secara real-time. Sistem kami mengoptimalkan rute dan memastikan kondisi penyimpanan udang tetap terjaga selama distribusi.",
            color: "#3B82F6"
        },
        {
            icon: <BarChart3 size={40} />,
            title: "Dashboard Analitik",
            description: "Wawasan mendalam untuk setiap peran. Petambak dapat memantau hasil panen, logistik memantau armada, dan admin mengawasi keseluruhan ekosistem.",
            color: "#F59E0B"
        },
        {
            icon: <Users size={40} />,
            title: "Multi-Role System",
            description: "Platform terintegrasi yang menghubungkan Petambak, Logistik, Konsumen, dan Admin dalam satu ekosistem yang harmonis dan efisien.",
            color: "#8B5CF6"
        },
        {
            icon: <Database size={40} />,
            title: "Pencatatan Digital",
            description: "Digitalisasi pencatatan tambak mulai dari benur, pakan, hingga panen. Ucapkan selamat tinggal pada catatan kertas yang mudah hilang.",
            color: "#EC4899"
        },
        {
            icon: <Lock size={40} />,
            title: "Keamanan Terjamin",
            description: "Data Anda aman bersama kami. Sistem otentikasi berlapis dan enkripsi data memastikan informasi bisnis Anda tetap rahasia.",
            color: "#6366F1"
        }
    ];

    return (
        <div style={{ padding: '8rem 1rem 4rem', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: '3rem', fontWeight: 800, color: '#111827', marginBottom: '1.5rem' }}
                    >
                        Fitur Unggulan <span style={{ color: '#10B981' }}>CRONOS</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{ fontSize: '1.25rem', color: '#6b7280', maxWidth: '700px', margin: '0 auto' }}
                    >
                        Solusi teknologi komprehensif untuk memodernisasi rantai pasok industri udang Indonesia.
                    </motion.p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}
                >
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            style={{
                                backgroundColor: 'white',
                                padding: '2.5rem',
                                borderRadius: '1.5rem',
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                transition: 'transform 0.2s',
                            }}
                            whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                        >
                            <div style={{
                                width: '4rem',
                                height: '4rem',
                                borderRadius: '1rem',
                                backgroundColor: `${feature.color}20`,
                                color: feature.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.5rem'
                            }}>
                                {feature.icon}
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', marginBottom: '1rem' }}>{feature.title}</h3>
                            <p style={{ color: '#6b7280', lineHeight: 1.6 }}>{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default FeaturesPage;
