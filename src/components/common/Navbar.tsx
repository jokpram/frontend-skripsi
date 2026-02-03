import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from './Button';
import { Menu, X, Anchor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navStyles = {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--color-border)',
        zIndex: 1000,
        padding: '1rem 0',
    };

    return (
        <nav style={navStyles}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--color-primary-dark)' }}>
                    <Anchor size={28} />
                    CRONOS
                </Link>

                {/* Desktop Menu */}
                <div className="desktop-menu" style={{ display: 'none', gap: '2rem', alignItems: 'center' }}>
                    {/* Responsive CSS handled by media query below or conditional rendering */}
                    <style>{`
            @media (min-width: 768px) {
              .desktop-menu { display: flex !important; }
              .mobile-toggle { display: none !important; }
            }
          `}</style>

                    <Link to="/">Beranda</Link>
                    <Link to="/features">Fitur</Link>
                    <Link to="/traceability">Lacak Produk</Link>

                    {user ? (
                        <>
                            <Link to="/dashboard" style={{ fontWeight: 600 }}>Dashboard</Link>
                            <Button onClick={handleLogout} variant="outline" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>Keluar ({user.name})</Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Masuk</Link>
                            <Link to="/register">
                                <Button>Daftar</Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: 'hidden', backgroundColor: 'white', borderBottom: '1px solid var(--color-border)' }}
                    >
                        <div className="container" style={{ display: 'flex', flexDirection: 'column', padding: '1rem 0', gap: '1rem' }}>
                            <Link to="/" onClick={() => setIsOpen(false)}>Beranda</Link>
                            <Link to="/features" onClick={() => setIsOpen(false)}>Fitur</Link>
                            <Link to="/traceability" onClick={() => setIsOpen(false)}>Lacak Produk</Link>
                            {user ? (
                                <>
                                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
                                    <Button onClick={handleLogout} style={{ width: '100%' }}>Keluar</Button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setIsOpen(false)}>Masuk</Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)}>
                                        <Button style={{ width: '100%' }}>Daftar</Button>
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
