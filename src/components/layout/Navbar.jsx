import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Testimonials', href: '#testimonials' },
];

export const Navbar = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleAnchor = (e, href) => {
        if (href.startsWith('#')) {
            e.preventDefault();
            const el = document.querySelector(href);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setIsMenuOpen(false);
        }
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`w-full max-w-4xl transition-all duration-300 ${scrolled
                        ? 'bg-white/90 backdrop-blur-xl shadow-2xl shadow-black/10 border border-gray-200/60'
                        : 'bg-white/70 backdrop-blur-md border border-white/50 shadow-lg shadow-black/5'
                    } rounded-2xl`}
            >
                <div className="flex items-center justify-between px-5 h-14">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                        <div className="bg-forest-900 p-1.5 rounded-xl shadow-md shadow-forest-900/30">
                            <Rocket className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-base font-bold tracking-tight text-gray-900">CampusEvents</span>
                    </Link>

                    {/* Desktop center links */}
                    <div className="hidden md:flex items-center gap-1 bg-gray-100/80 rounded-xl px-1.5 py-1.5">
                        {navLinks.map(link => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={(e) => handleAnchor(e, link.href)}
                                className="px-4 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm transition-all"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Desktop right actions */}
                    <div className="hidden md:flex items-center gap-2">
                        {user ? (
                            <>
                                <Link
                                    to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'faculty' ? '/faculty/dashboard' : '/student/dashboard'}
                                    className="text-sm font-semibold text-gray-700 hover:text-forest-900 transition-colors px-3 py-1.5"
                                >
                                    Dashboard →
                                </Link>
                                <button
                                    onClick={logout}
                                    className="bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <button className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors">
                                        Sign In
                                    </button>
                                </Link>
                                <Link to="/register">
                                    <motion.button
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.96 }}
                                        className="bg-forest-900 text-white text-sm font-semibold px-5 py-2 rounded-xl shadow-lg shadow-forest-900/30 hover:bg-forest-800 transition-colors"
                                    >
                                        Get Started
                                    </motion.button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <AnimatePresence mode="wait">
                            {isMenuOpen
                                ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }}><X className="w-5 h-5" /></motion.div>
                                : <motion.div key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }}><Menu className="w-5 h-5" /></motion.div>
                            }
                        </AnimatePresence>
                    </button>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden border-t border-gray-100 md:hidden"
                        >
                            <div className="px-4 py-4 space-y-1">
                                {navLinks.map(link => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        onClick={(e) => handleAnchor(e, link.href)}
                                        className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                                <div className="pt-3 mt-3 border-t border-gray-100 space-y-2">
                                    {user ? (
                                        <>
                                            <Link
                                                to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'faculty' ? '/faculty/dashboard' : '/student/dashboard'}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="block w-full text-center bg-forest-900 text-white py-2.5 rounded-xl text-sm font-semibold"
                                            >
                                                My Dashboard
                                            </Link>
                                            <button
                                                onClick={() => { logout(); setIsMenuOpen(false); }}
                                                className="block w-full text-center border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-50 hover:text-red-600 transition-colors"
                                            >
                                                Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login" onClick={() => setIsMenuOpen(false)}
                                                className="block w-full text-center border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold">
                                                Sign In
                                            </Link>
                                            <Link to="/register" onClick={() => setIsMenuOpen(false)}
                                                className="block w-full text-center bg-forest-900 text-white py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-forest-900/20">
                                                Get Started
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </div>
    );
};
