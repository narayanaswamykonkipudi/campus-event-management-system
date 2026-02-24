import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Calendar, Users, Ticket, BarChart3, LogOut,
    Compass, Rocket, ScrollText, PlusSquare, ClipboardList,
    FileText, Settings2, Award, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';

const adminLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: Calendar, label: 'Event Oversight', path: '/admin/events' },
    { icon: BarChart3, label: 'System Analytics', path: '/admin/analytics' },
    { icon: Settings2, label: 'Score Policy', path: '/admin/score-policy' },
];

const studentLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard' },
    { icon: Compass, label: 'Browse Events', path: '/student/events' },
    { icon: ClipboardList, label: 'My Registrations', path: '/student/registrations' },
    { icon: Ticket, label: 'My Tickets', path: '/student/tickets' },
    { icon: Award, label: 'My Certificates', path: '/student/certificates' },
];

const facultyLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/faculty/dashboard' },
    { icon: PlusSquare, label: 'Create Event', path: '/faculty/events/create' },
    { icon: Calendar, label: 'Manage Events', path: '/faculty/events' },
    { icon: FileText, label: 'My Reports', path: '/faculty/reports' },
];

const getProfilePath = (role) => {
    if (role === 'admin') return '/admin/profile';
    if (role === 'faculty') return '/faculty/profile';
    return '/student/profile';
};

const roleBadge = {
    admin: 'bg-red-100 text-red-700',
    faculty: 'bg-orange-100 text-orange-700',
    student: 'bg-emerald-100 text-emerald-700',
};

const NavItem = ({ link, onClose }) => {
    const Icon = link.icon;
    return (
        <NavLink
            key={link.path}
            to={link.path}
            onClick={onClose}
            className={({ isActive }) => clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all group',
                isActive
                    ? 'bg-forest-900 text-white shadow-lg shadow-forest-900/20'
                    : 'text-gray-500 hover:bg-gray-50'
            )}
        >
            {({ isActive }) => (
                <>
                    <Icon className={clsx('w-5 h-5 flex-shrink-0', isActive ? 'text-neon-green' : 'text-gray-400 group-hover:text-forest-900')} />
                    <span className="font-medium text-sm">{link.label}</span>
                </>
            )}
        </NavLink>
    );
};

// ── Desktop Sidebar ────────────────────────────────────────────────────────────
export const Sidebar = ({ mobileOpen, onMobileClose }) => {
    const { user, logout } = useAuth();
    const links = user?.role === 'admin' ? adminLinks
        : user?.role === 'faculty' ? facultyLinks
            : studentLinks;
    const profilePath = getProfilePath(user?.role);
    const badge = roleBadge[user?.role] || roleBadge.student;

    const inner = (onClose) => (
        <>
            {/* Logo */}
            <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <div className="bg-forest-900 p-1.5 rounded-lg">
                            <Rocket className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900">CampusEvents</span>
                    </div>
                    {onClose && (
                        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 md:hidden">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
                <nav className="space-y-1">
                    {links.map((link) => <NavItem key={link.path} link={link} onClose={onClose} />)}
                </nav>
            </div>

            {/* Profile + Logout */}
            <div className="mt-auto p-6 border-t border-gray-100">
                <NavLink
                    to={profilePath}
                    onClick={onClose}
                    className="flex items-center gap-3 mb-4 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                    <img
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=064e3b&color=fff`}
                        alt="Profile"
                        className="w-9 h-9 rounded-full border border-gray-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                        <span className={clsx('text-xs font-medium px-1.5 py-0.5 rounded-md capitalize', badge)}>
                            {user?.role}
                        </span>
                    </div>
                </NavLink>
                <button
                    onClick={() => { logout(); onClose?.(); }}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors w-full px-2 py-2 rounded-lg hover:bg-red-50"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Desktop */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 z-30 hidden md:flex flex-col">
                {inner(undefined)}
            </aside>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onMobileClose}
                            className="fixed inset-0 bg-black/40 z-40 md:hidden"
                        />
                        {/* Drawer */}
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 flex flex-col shadow-2xl md:hidden"
                        >
                            {inner(onMobileClose)}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
