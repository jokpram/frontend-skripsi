import { motion } from 'framer-motion';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, BarChart3, ChevronRight, Activity, Globe, Users } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="bg-slate-50 min-h-screen">

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-emerald-900">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 to-emerald-800 opacity-95" />

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-emerald-300 text-sm font-bold tracking-wider mb-6">
                            REVOLUSI INDUSTRI UDANG INDONESIA
                        </span>
                        <h1 className="text-5xl lg:text-7xl font-black text-white mb-8 leading-tight tracking-tight">
                            Crustacean Origin Network Oversight System <br />
                            <span className="text-emerald-400">
                                Transparan & Terpercaya
                            </span>
                        </h1>
                        <p className="text-xl text-emerald-100/90 mb-12 max-w-2xl mx-auto leading-relaxed">
                            Platform terintegrasi yang menghubungkan petambak, logistik, dan konsumen dalam satu ekosistem rantai pasok yang efisien dan akuntabel.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register">
                                <Button className="text-lg px-8 py-4 w-full sm:w-auto h-auto rounded-xl shadow-xl shadow-emerald-900/20 hover:scale-105 transition-transform bg-white text-emerald-800 hover:bg-emerald-50 border-0">
                                    Mulai Gratis <ChevronRight size={20} className="ml-2" />
                                </Button>
                            </Link>
                            <Link to="/traceability">
                                <Button variant="outline" className="text-lg px-8 py-4 w-full sm:w-auto h-auto rounded-xl border-emerald-500/30 text-emerald-100 hover:bg-emerald-500/10 hover:border-emerald-400">
                                    Coba Lacak Produk
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Simple Decorative Circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
            </section>

            {/* Stats Section */}
            <section className="py-10 bg-white border-b border-slate-100 relative z-20 -mt-10 container mx-auto rounded-3xl shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    <div className="p-8 text-center">
                        <div className="flex items-center justify-center gap-3 mb-2 text-emerald-600">
                            <Activity size={24} />
                            <span className="font-bold text-slate-500 uppercase tracking-wider text-sm">Real-time Tracking</span>
                        </div>
                        <p className="text-4xl font-black text-slate-900">100%</p>
                        <p className="text-slate-400 text-sm mt-1">Data Transparan</p>
                    </div>
                    <div className="p-8 text-center">
                        <div className="flex items-center justify-center gap-3 mb-2 text-emerald-600">
                            <Users size={24} />
                            <span className="font-bold text-slate-500 uppercase tracking-wider text-sm">Petambak & Mitra</span>
                        </div>
                        <p className="text-4xl font-black text-slate-900">Indonesia</p>
                        <p className="text-slate-400 text-sm mt-1">Telah Bergabung</p>
                    </div>
                    <div className="p-8 text-center">
                        <div className="flex items-center justify-center gap-3 mb-2 text-emerald-600">
                            <Globe size={24} />
                            <span className="font-bold text-slate-500 uppercase tracking-wider text-sm">Jangkauan</span>
                        </div>
                        <p className="text-4xl font-black text-slate-900">38</p>
                        <p className="text-slate-400 text-sm mt-1">Provinsi Indonesia</p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-32">
                <div className="text-center mb-20">
                    <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4">Kenapa Memilih <span className="text-emerald-600">CRONOS</span>?</h2>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">Kami menggunakan teknologi Blockchain untuk memastikan setiap udang yang Anda beli memiliki kualitas terbaik.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <ShieldCheck size={40} className="text-white" />,
                            title: "Traceability Terjamin",
                            desc: "Pantau perjalanan produk udang dari kolam panen hingga sampai di tangan konsumen dengan data transparan.",
                            color: "bg-emerald-500"
                        },
                        {
                            icon: <Truck size={40} className="text-white" />,
                            title: "Logistik Terintegrasi",
                            desc: "Sistem manajemen logistik yang efisien memastikan kesegaran produk selama pengiriman dengan suhu terkontrol.",
                            color: "bg-blue-500"
                        },
                        {
                            icon: <BarChart3 size={40} className="text-white" />,
                            title: "Dashboard Interaktif",
                            desc: "Pantau performa bisnis, stok, dan pesanan melalui dashboard yang responsif dan mudah digunakan untuk semua.",
                            color: "bg-amber-500"
                        }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="group bg-white p-8 rounded-[2rem] border border-slate-100 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-300"
                        >
                            <div className={`${item.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg rotate-3 group-hover:rotate-6 transition-transform`}>
                                {item.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-900">{item.title}</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Call to Action */}
            <section className="container mx-auto px-4 pb-24">
                <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Siap Meningkatkan Bisnis Anda?</h2>
                        <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">Bergabunglah dengan ribuan petambak dan mitra logistik lainnya yang telah mempercayakan bisnis mereka pada CRONOS.</p>
                        <Link to="/register">
                            <Button className="text-lg px-10 py-4 h-auto rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white shadow-xl shadow-emerald-500/20">
                                Daftar Sekarang <ChevronRight size={20} className="ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default LandingPage;
