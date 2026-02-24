import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, Eye, Download, Filter } from 'lucide-react';
import { events as allEvents, users } from '../../data/mockData';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

const statusOptions = ['All', 'Upcoming', 'Completed', 'Closed', 'Cancelled'];
const categoryOptions = ['All', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Leadership'];
const badgeMap = { Upcoming: 'green', Completed: 'purple', Closed: 'yellow', Cancelled: 'red' };

export const EventOversight = () => {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('All');
    const [category, setCategory] = useState('All');
    const [selectedEvent, setSelectedEvent] = useState(null);

    const filtered = allEvents.filter(e => {
        const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.department.toLowerCase().includes(search.toLowerCase());
        const matchStatus = status === 'All' || e.status === status;
        const matchCat = category === 'All' || e.category === category;
        return matchSearch && matchStatus && matchCat;
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-forest-900" />
                    <h1 className="text-2xl font-bold text-gray-900">Event Oversight</h1>
                </div>
                <button className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50">
                    <Download className="w-4 h-4" /> Export
                </button>
            </div>

            {/* Summary Row */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total Events', value: allEvents.length },
                    { label: 'Upcoming', value: allEvents.filter(e => e.status === 'Upcoming').length },
                    { label: 'Completed', value: allEvents.filter(e => e.status === 'Completed').length },
                    { label: 'Total Participants', value: allEvents.reduce((s, e) => s + e.currentParticipants, 0) },
                ].map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                        <Card className="!p-4 bg-gray-50">
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-5">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events..."
                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/30 w-52" />
                </div>
                <div className="flex gap-2 items-center flex-wrap">
                    <Filter className="w-4 h-4 text-gray-400" />
                    {statusOptions.map(s => (
                        <button key={s} onClick={() => setStatus(s)}
                            className={`px-3 py-2 text-sm font-medium rounded-xl transition-all ${status === s ? 'bg-forest-900 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                            {s}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2 flex-wrap">
                    {categoryOptions.map(c => (
                        <button key={c} onClick={() => setCategory(c)}
                            className={`px-3 py-2 text-sm font-medium rounded-xl transition-all ${category === c ? 'bg-gray-800 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                            {c}
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
                                {['Event', 'Dept / Faculty', 'Type', 'Date', 'Participants', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide py-3 px-4">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map(event => {
                                const faculty = users.find(u => u.id === event.createdBy);
                                return (
                                    <tr key={event.id} className="hover:bg-gray-50/60">
                                        <td className="py-3 px-4">
                                            <p className="font-medium text-gray-900">{event.title}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-gray-700">{event.department}</p>
                                            <p className="text-xs text-gray-400">{faculty?.name || '—'}</p>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">{event.category}</td>
                                        <td className="py-3 px-4 text-gray-600 text-xs">{new Date(event.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                        <td className="py-3 px-4">
                                            <div className="text-sm font-semibold text-gray-900">{event.currentParticipants}/{event.maxParticipants}</div>
                                            <div className="w-full bg-gray-100 rounded-full h-1 mt-1 max-w-16">
                                                <div className="bg-forest-900 rounded-full h-1" style={{ width: `${Math.min((event.currentParticipants / event.maxParticipants) * 100, 100)}%` }} />
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <Badge variant={badgeMap[event.status]}>{event.status}</Badge>
                                        </td>
                                        <td className="py-3 px-4">
                                            <button onClick={() => setSelectedEvent(event)}
                                                className="flex items-center gap-1 text-xs text-forest-900 border border-forest-900/30 px-2.5 py-1 rounded-lg hover:bg-forest-900/5 transition-colors">
                                                <Eye className="w-3 h-3" /> View
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Event Detail Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl max-h-[80vh] overflow-y-auto">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-gray-900 text-xl">{selectedEvent.title}</h3>
                                <Badge variant={badgeMap[selectedEvent.status]}>{selectedEvent.status}</Badge>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">{selectedEvent.description}</p>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {[
                                { label: 'Event Date', value: new Date(selectedEvent.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                                { label: 'Type', value: selectedEvent.category },
                                { label: 'Department', value: selectedEvent.department },
                                { label: 'Participants', value: `${selectedEvent.currentParticipants}/${selectedEvent.maxParticipants}` },
                                { label: 'Prizes', value: selectedEvent.prizes },
                            ].map(item => (
                                <div key={item.label}>
                                    <p className="text-xs font-medium text-gray-400 uppercase">{item.label}</p>
                                    <p className="text-sm font-semibold text-gray-800">{item.value || '—'}</p>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setSelectedEvent(null)}
                            className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
                            Close
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};
