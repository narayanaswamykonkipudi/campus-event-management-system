import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, Search, PlusSquare, Eye, Trash2, Edit } from 'lucide-react';
import { events as allEvents } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';

const statusOptions = ['All', 'Upcoming', 'Completed', 'Closed', 'Cancelled'];
const badgeMap = { Upcoming: 'green', Completed: 'purple', Closed: 'yellow', Cancelled: 'red' };

export const ManageEvents = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [deleteDialog, setDeleteDialog] = useState(null);

    const myEvents = allEvents.filter(e => e.createdBy === user?.id);

    const filtered = myEvents.filter(e => {
        const matchSearch = e.title.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'All' || e.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-forest-900" />
                    <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
                </div>
                <Link to="/faculty/events/create">
                    <motion.button
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-2 bg-forest-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-forest-800 transition-colors"
                    >
                        <PlusSquare className="w-4 h-4" /> New Event
                    </motion.button>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-5">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search events..."
                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/30 w-56"
                    />
                </div>
                <div className="flex gap-2">
                    {statusOptions.map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`px-3 py-2 text-sm font-medium rounded-xl transition-all ${statusFilter === s ? 'bg-forest-900 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {filtered.length === 0 ? (
                <Card className="text-center py-12">
                    <Calendar className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No events found.</p>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filtered.map((event, i) => (
                        <motion.div key={event.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                            <Card className="!p-4">
                                <div className="flex items-start gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <h3 className="font-bold text-gray-900 text-sm">{event.title}</h3>
                                            <Badge variant={badgeMap[event.status] || 'blue'}>{event.status}</Badge>
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{event.category}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(event.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Users className="w-3.5 h-3.5" />
                                                {event.currentParticipants}/{event.maxParticipants} participants
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <Link to={`/faculty/events/${event.id}`}
                                            className="flex items-center gap-1 text-xs text-forest-900 border border-forest-900/30 px-3 py-1.5 rounded-lg hover:bg-forest-900/5 transition-colors">
                                            <Eye className="w-3 h-3" /> View
                                        </Link>
                                        {event.status === 'Upcoming' && (
                                            <Link to={`/faculty/events/${event.id}/edit`}
                                                className="flex items-center gap-1 text-xs text-blue-700 border border-blue-300 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                                                <Edit className="w-3 h-3" /> Edit
                                            </Link>
                                        )}
                                        <button onClick={() => setDeleteDialog(event)}
                                            className="flex items-center gap-1 text-xs text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                                            <Trash2 className="w-3 h-3" /> Delete
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Delete Confirm Modal */}
            {deleteDialog && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
                        <h3 className="font-bold text-gray-900 text-lg mb-2">Delete Event</h3>
                        <p className="text-gray-600 text-sm mb-6">Are you sure you want to delete "{deleteDialog.title}"? This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteDialog(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
                            <button onClick={() => setDeleteDialog(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700">Delete</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};
