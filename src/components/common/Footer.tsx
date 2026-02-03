import { Anchor, Facebook, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center text-center gap-10 mb-12">
                    {/* Brand */}
                    <div className="max-w-lg">
                        <Link to="/" className="flex items-center justify-center gap-2 font-black text-2xl text-emerald-500 tracking-tight mb-6">
                            <Anchor size={28} />
                            CRONOS
                        </Link>
                        <p className="text-slate-400 leading-relaxed mb-6">
                            Menjamin kualitas dan transparansi produk udang Indonesia dari hulu hingga hilir dengan teknologi modern.
                        </p>
                        <div className="flex justify-center gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Menu Utama</h3>
                        <ul className="flex flex-wrap justify-center gap-6 md:gap-8">
                            <li><Link to="/" className="hover:text-emerald-500 transition-colors">Beranda</Link></li>
                            <li><Link to="/features" className="hover:text-emerald-500 transition-colors">Fitur Unggulan</Link></li>
                            <li><Link to="/traceability" className="hover:text-emerald-500 transition-colors">Lacak Produk</Link></li>
                            <li><Link to="/login" className="hover:text-emerald-500 transition-colors">Masuk / Daftar</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} CRONOS Indonesia. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};
