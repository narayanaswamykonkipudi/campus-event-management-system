import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users, Search, Filter, Eye, UserCheck, UserX, ShieldCheck, Download, ChevronLeft, ChevronRight
} from 'lucide-react';
import { users as allUsers } from '../../data/mockData';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

const roles = ['All', 'student', 'faculty', 'admin'];
const statuses = ['All', 'active', 'inactive'];
const PAGE_SIZE = 5;

const roleBadgeMap = { student: 'green', faculty: 'yellow', admin: 'red' };
const statusBadgeMap = { active: 'green', inactive: 'yellow' };

export const UserManagement = () => {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [page, setPage] = useState(1);
    const [viewUser, setViewUser] = useState(null);

    const filtered = allUsers.filter(u => {
        const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === 'All' || u.role === roleFilter;
        const matchStatus = statusFilter === 'All' || u.status === statusFilter;
        return matchSearch && matchRole && matchStatus;
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const summaryCards = [
        { label: 'Total Users', value: allUsers.length, color: 'bg-blue-50', icon: Users, iconColor: 'text-blue-500' },
        { label: 'Students', value: allUsers.filter(u => u.role === 'student').length, color: 'bg-emerald-50', icon: UserCheck, iconColor: 'text-emerald-500' },
        { label: 'Faculty', value: allUsers.filter(u => u.role === 'faculty').length, color: 'bg-orange-50', icon: ShieldCheck, iconColor: 'text-orange-500' },
        { label: 'Inactive', value: allUsers.filter(u => u.status === 'inactive').length, color: 'bg-red-50', icon: UserX, iconColor: 'text-red-500' },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-forest-900" />
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                </div>
                <button className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4" /> Export
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {summaryCards.map((c, i) => {
                    const Icon = c.icon;
                    return (
                        <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                            <Card className={`${c.color} !p-4`}>
                                <Icon className={`w-5 h-5 ${c.iconColor} mb-2`} />
                                <p className="text-xl font-bold text-gray-900">{c.value}</p>
                                <p className="text-sm text-gray-600">{c.label}</p>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-5">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search by name or email..."
                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/30 w-56"
                    />
                </div>
                <div className="flex gap-2 items-center">
                    <Filter className="w-4 h-4 text-gray-400" />
                    {roles.map(r => (
                        <button key={r} onClick={() => { setRoleFilter(r); setPage(1); }}
                            className={`px-3 py-2 text-sm font-medium rounded-xl transition-all capitalize ${roleFilter === r ? 'bg-forest-900 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                            {r}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    {statuses.map(s => (
                        <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                            className={`px-3 py-2 text-sm font-medium rounded-xl transition-all capitalize ${statusFilter === s ? 'bg-gray-900 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {['User', 'Role', 'Department', 'ID', 'Status', 'Joined', 'Actions'].map(h => (
                                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide py-3 px-4">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginated.map(u => (
                                <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2.5">
                                            <img src={u.avatar} alt="" className="w-8 h-8 rounded-full" />
                                            <div>
                                                <p className="font-medium text-gray-900">{u.name}</p>
                                                <p className="text-xs text-gray-400">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <Badge variant={roleBadgeMap[u.role]}>{u.role}</Badge>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">{u.department}</td>
                                    <td className="py-3 px-4 text-gray-600 font-mono text-xs">{u.studentId || u.facultyId || '—'}</td>
                                    <td className="py-3 px-4">
                                        <Badge variant={statusBadgeMap[u.status]}>{u.status}</Badge>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">{new Date(u.joinedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                    <td className="py-3 px-4">
                                        <button onClick={() => setViewUser(u)} className="flex items-center gap-1 text-xs text-forest-900 border border-forest-900/30 px-2.5 py-1 rounded-lg hover:bg-forest-900/5 transition-colors">
                                            <Eye className="w-3 h-3" /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                    <p className="text-sm text-gray-500">Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
                    <div className="flex gap-2">
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(p => p + 1)} className="p-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </Card>

            {/* View User Modal */}
            {viewUser && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-center gap-4 mb-6">
                            <img src={viewUser.avatar} alt="" className="w-16 h-16 rounded-full" />
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">{viewUser.name}</h3>
                                <Badge variant={roleBadgeMap[viewUser.role]}>{viewUser.role}</Badge>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {[
                                { label: 'Email', value: viewUser.email },
                                { label: 'Mobile', value: viewUser.mobile || '—' },
                                { label: 'Department', value: viewUser.department },
                                { label: 'Age', value: viewUser.age || '—' },
                                { label: 'Gender', value: viewUser.gender || '—' },
                                { label: 'Status', value: viewUser.status },
                                viewUser.role === 'student' && { label: 'Year', value: viewUser.year },
                                viewUser.role === 'student' && { label: 'Section', value: viewUser.section },
                                viewUser.role === 'student' && { label: 'Student ID', value: viewUser.studentId },
                                viewUser.role === 'faculty' && { label: 'Faculty ID', value: viewUser.facultyId },
                            ].filter(Boolean).map(item => (
                                <div key={item.label}>
                                    <p className="text-xs font-medium text-gray-400 uppercase">{item.label}</p>
                                    <p className="text-sm text-gray-800 font-semibold">{item.value}</p>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setViewUser(null)}
                            className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                            Close
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};
