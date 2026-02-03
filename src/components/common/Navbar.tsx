import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import type { RootState } from '../../store';
import { Button } from './Button';
import { Menu, X, Anchor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-slate-200 z-[1000] py-4">
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 font-black text-2xl text-emerald-600 tracking-tight">
                    <Anchor size={28} className="text-emerald-500" />
                    CRONOS
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-8 items-center text-slate-600 font-medium">
                    <Link to="/" className="hover:text-emerald-600 transition-colors">Beranda</Link>
                    <Link to="/features" className="hover:text-emerald-600 transition-colors">Fitur</Link>
                    <Link to="/traceability" className="hover:text-emerald-600 transition-colors">Lacak Produk</Link>

                    {isAuthenticated && user ? (
                        <>
                            <Link to="/dashboard" className="font-bold text-emerald-700">Dashboard</Link>
                            <Button onClick={handleLogout} variant="outline" className="text-sm px-4 py-2">
                                Keluar ({user.name.split(' ')[0]})
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-emerald-600 transition-colors">Masuk</Link>
                            <Link to="/register">
                                <Button className="px-6">Daftar</Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-slate-600" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden overflow-hidden bg-white border-b border-slate-200"
                    >
                        <div className="container mx-auto px-4 py-6 flex flex-col gap-4 text-slate-600 font-medium">
                            <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-emerald-600">Beranda</Link>
                            <Link to="/features" onClick={() => setIsOpen(false)} className="hover:text-emerald-600">Fitur</Link>
                            <Link to="/traceability" onClick={() => setIsOpen(false)} className="hover:text-emerald-600">Lacak Produk</Link>
                            {isAuthenticated && user ? (
                                <>
                                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="font-bold text-emerald-700">Dashboard</Link>
                                    <Button onClick={handleLogout} className="w-full">Keluar</Button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="hover:text-emerald-600">Masuk</Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)}>
                                        <Button className="w-full">Daftar</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
