import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Edit2, Trash2, Calendar, MapPin, X, UploadCloud } from 'lucide-react';
import { events } from '../../data/mockData';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';

export const ManageEvents = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Filter events
    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative min-h-[calc(100vh-8rem)]">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
                    <p className="text-gray-500 mt-1">Create, edit, and moderate campus events.</p>
                </div>
                <Button onClick={() => setIsDrawerOpen(true)}>
                    <Plus className="w-5 h-5" /> Create Event
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        placeholder="Search events by title or category..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-900/20"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="secondary" className="px-4">
                    <Filter className="w-4 h-4" /> Filter Status
                </Button>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                            <th className="px-6 py-4">Event Details</th>
                            <th className="px-6 py-4">Date & Time</th>
                            <th className="px-6 py-4">Capacity</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredEvents.map((event) => (
                            <tr key={event.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <img src={event.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
                                        <div>
                                            <p className="font-bold text-gray-900">{event.title}</p>
                                            <p className="text-sm text-gray-500">{event.category}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        {new Date(event.date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span>Main Hall</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-full max-w-[100px] h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-forest-900 rounded-full"
                                                style={{ width: `${(event.attendees.length / event.capacity) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-medium text-gray-600">{event.attendees.length}/{event.capacity}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant={event.status === 'Published' ? 'success' : event.status === 'Draft' ? 'neutral' : 'warning'}>
                                        {event.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-gray-200 rounded-full text-gray-600"><Edit2 className="w-4 h-4" /></button>
                                        <button className="p-2 hover:bg-red-50 rounded-full text-red-600"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Slide-over Drawer */}
            <AnimatePresence>
                {isDrawerOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDrawerOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-50 overflow-y-auto"
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
                                    <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                        <X className="w-6 h-6 text-gray-500" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Event Title</label>
                                        <Input placeholder="Ex: Tech Symposium 2024" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Date</label>
                                            <Input type="date" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Time</label>
                                            <Input type="time" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Category</label>
                                        <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-900/20">
                                            <option>Technical</option>
                                            <option>Cultural</option>
                                            <option>Sports</option>
                                            <option>Workshop</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Description</label>
                                        <textarea
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-900/20"
                                            placeholder="Describe the event..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Event Poster</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                                            <div className="p-4 bg-gray-100 rounded-full mb-4 group-hover:bg-gray-200 transition-colors">
                                                <UploadCloud className="w-6 h-6 text-gray-500" />
                                            </div>
                                            <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
                                            <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-end gap-3">
                                        <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
                                        <Button>Create Event</Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
