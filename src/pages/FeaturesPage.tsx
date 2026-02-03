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
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        },
        {
            icon: <Truck size={40} />,
            title: "Manajemen Logistik Cerdas",
            description: "Pantau pengiriman secara real-time. Sistem kami mengoptimalkan rute dan memastikan kondisi penyimpanan udang tetap terjaga selama distribusi.",
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            icon: <BarChart3 size={40} />,
            title: "Dashboard Analitik",
            description: "Wawasan mendalam untuk setiap peran. Petambak dapat memantau hasil panen, logistik memantau armada, dan admin mengawasi keseluruhan ekosistem.",
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        },
        {
            icon: <Users size={40} />,
            title: "Multi-Role System",
            description: "Platform terintegrasi yang menghubungkan Petambak, Logistik, Konsumen, dan Admin dalam satu ekosistem yang harmonis dan efisien.",
            color: "text-violet-500",
            bg: "bg-violet-500/10"
        },
        {
            icon: <Database size={40} />,
            title: "Pencatatan Digital",
            description: "Digitalisasi pencatatan tambak mulai dari benur, pakan, hingga panen. Ucapkan selamat tinggal pada catatan kertas yang mudah hilang.",
            color: "text-pink-500",
            bg: "bg-pink-500/10"
        },
        {
            icon: <Lock size={40} />,
            title: "Keamanan Terjamin",
            description: "Data Anda aman bersama kami. Sistem otentikasi berlapis dan enkripsi data memastikan informasi bisnis Anda tetap rahasia.",
            color: "text-indigo-500",
            bg: "bg-indigo-500/10"
        }
    ];

    return (
        <div className="pt-32 pb-16 min-h-screen bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-extrabold text-slate-900 mb-6"
                    >
                        Fitur Unggulan <span className="text-emerald-500">CRONOS</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-500 max-w-2xl mx-auto"
                    >
                        Solusi teknologi komprehensif untuk memodernisasi rantai pasok industri udang Indonesia.
                    </motion.p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
                            whileHover={{ y: -5 }}
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${feature.bg} ${feature.color}`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                            <p className="text-slate-500 leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default FeaturesPage;
