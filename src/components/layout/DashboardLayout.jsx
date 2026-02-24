import { useState, useRef, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Bell, Search, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Role-specific mock notifications
const getNotifications = (role) => {
    if (role === 'admin') return [
        { id: 1, text: 'New faculty registered: Dr. Priya Anand', time: '5m ago', unread: true },
        { id: 2, text: '3 events pending review this week', time: '1h ago', unread: true },
        { id: 3, text: 'System Analytics report ready', time: '3h ago', unread: false },
        { id: 4, text: 'Score policy updated successfully', time: '1d ago', unread: false },
    ];
    if (role === 'faculty') return [
        { id: 1, text: 'John Doe registered for Hackathon 2025', time: '10m ago', unread: true },
        { id: 2, text: 'AI Workshop attendance uploaded', time: '1h ago', unread: true },
        { id: 3, text: 'Hackathon deadline in 5 days', time: '6h ago', unread: false },
    ];
    return [
        { id: 1, text: 'You\'re registered for Hackathon 2025!', time: '2h ago', unread: true },
        { id: 2, text: 'Music Fest Night starts in 3 days', time: '6h ago', unread: true },
        { id: 3, text: 'Certificate issued for AI Workshop', time: '2d ago', unread: false },
    ];
};

export const DashboardLayout = ({ allowedRole }) => {
    const { user, loading } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [bellOpen, setBellOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const bellRef = useRef(null);

    useEffect(() => {
        if (user) setNotifications(getNotifications(user.role));
    }, [user]);

    // Close bell on outside click
    useEffect(() => {
        const handler = (e) => {
            if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const unreadCount = notifications.filter(n => n.unread).length;
    const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-forest-900 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 text-sm">Loading...</p>
            </div>
        </div>
    );

    if (!user) return <Navigate to="/login" replace />;
    if (allowedRole && user.role !== allowedRole) return <Navigate to="/login" replace />;

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

            <div className="md:ml-64 min-h-screen flex flex-col">
                {/* ── Top Header ── */}
                <header className="h-16 bg-white/80 backdrop-blur-sm sticky top-0 z-20 border-b border-gray-100 px-4 md:px-8 flex items-center justify-between gap-4">
                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="md:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors flex-shrink-0"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Search */}
                    <div className="hidden sm:flex items-center gap-2 flex-1 max-w-sm bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <input
                            placeholder="Search..."
                            className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-400"
                        />
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                        {/* Notification Bell */}
                        <div className="relative" ref={bellRef}>
                            <button
                                onClick={() => setBellOpen(prev => !prev)}
                                className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-forest-900 transition-colors relative"
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            <AnimatePresence>
                                {bellOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                                    >
                                        {/* Header */}
                                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                                            <span className="font-bold text-gray-900 text-sm">Notifications</span>
                                            {unreadCount > 0 && (
                                                <button onClick={markAllRead} className="text-xs text-forest-900 font-semibold hover:underline">
                                                    Mark all read
                                                </button>
                                            )}
                                        </div>
                                        {/* Items */}
                                        <div className="max-h-72 overflow-y-auto">
                                            {notifications.map(n => (
                                                <div key={n.id} className={`flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${n.unread ? 'bg-emerald-50/50' : ''}`}>
                                                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm ${n.unread ? 'font-medium text-gray-900' : 'text-gray-600'}`}>{n.text}</p>
                                                        <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Footer */}
                                        <div className="px-4 py-2 border-t border-gray-50">
                                            <button className="text-xs text-gray-400 hover:text-forest-900 transition-colors w-full text-center py-1">
                                                View all notifications
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Avatar */}
                        <img
                            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=064e3b&color=fff`}
                            alt="User"
                            className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                        />
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
