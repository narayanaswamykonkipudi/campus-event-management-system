import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { events, categories } from '../../data/mockData';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Search, Calendar, Users, ArrowRight } from 'lucide-react';

const statusColors = { Upcoming: 'green', Completed: 'purple', Closed: 'yellow', Cancelled: 'red' };

export const DiscoverEvents = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const filteredEvents = events.filter(event => {
        const matchCat = selectedCategory === 'All' || event.category === selectedCategory;
        const matchSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === 'All' || event.status === statusFilter;
        return matchCat && matchSearch && matchStatus;
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Browse Events</h1>
                <p className="text-gray-500 mt-1">Discover and register for campus events.</p>
            </div>

            {/* Search */}
            <div className="relative max-w-lg">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    placeholder="Search events..."
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-forest-900/20 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide flex-wrap">
                {['All', ...categories.map(c => c.name)].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat
                                ? 'bg-forest-900 text-white shadow-lg shadow-forest-900/25'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        {cat === 'All' ? 'All Events' : cat}
                    </button>
                ))}
            </div>

            {/* Status filter */}
            <div className="flex gap-2">
                {['All', 'Upcoming', 'Completed', 'Closed'].map(s => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${statusFilter === s
                                ? 'bg-gray-900 text-white'
                                : 'border border-gray-200 text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* Results count */}
            <p className="text-sm text-gray-400">{filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found</p>

            {/* Event Grid */}
            {filteredEvents.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
                    <Search className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No events match your filters.</p>
                    <button onClick={() => { setSelectedCategory('All'); setSearchTerm(''); setStatusFilter('All'); }}
                        className="mt-3 text-forest-900 text-sm font-semibold hover:underline">
                        Clear filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event, index) => {
                        const fillPct = Math.min(Math.round((event.currentParticipants / event.maxParticipants) * 100), 100);
                        const isFull = event.currentParticipants >= event.maxParticipants;
                        return (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="p-0 overflow-hidden group border-0 shadow-lg shadow-gray-200/50 h-full flex flex-col">
                                    {/* Image */}
                                    <div className="h-48 overflow-hidden relative flex-shrink-0">
                                        <img
                                            src={event.image || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600`}
                                            alt={event.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                        <div className="absolute top-3 left-3 flex gap-2">
                                            <Badge variant={statusColors[event.status]}>{event.status}</Badge>
                                        </div>
                                        <div className="absolute top-3 right-3">
                                            <span className="text-xs bg-white/90 backdrop-blur-sm text-gray-700 font-semibold px-2 py-1 rounded-lg">
                                                {event.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{event.title}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{event.description}</p>

                                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-forest-900" />
                                                {new Date(event.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Users className="w-3.5 h-3.5 text-forest-900" />
                                                {event.currentParticipants}/{event.maxParticipants}
                                            </span>
                                        </div>

                                        {/* Capacity bar */}
                                        <div className="mb-4">
                                            <div className="flex justify-between text-xs font-semibold text-gray-400 mb-1">
                                                <span>{fillPct}% filled</span>
                                                {isFull && <span className="text-red-500 font-bold">Full!</span>}
                                                {!isFull && fillPct > 80 && <span className="text-orange-500">Filling fast!</span>}
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full transition-all ${isFull ? 'bg-red-500' : fillPct > 80 ? 'bg-orange-400' : 'bg-emerald-500'}`}
                                                    style={{ width: `${fillPct}%` }} />
                                            </div>
                                        </div>

                                        <div className="mt-auto">
                                            <Link to={`/student/events/${event.id}`}>
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    disabled={event.status !== 'Upcoming'}
                                                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors ${event.status === 'Upcoming'
                                                            ? 'bg-forest-900 text-white hover:bg-forest-800'
                                                            : 'bg-gray-100 text-gray-400 cursor-default'
                                                        }`}
                                                >
                                                    {event.status === 'Upcoming' ? 'View & Register' : 'View Details'}
                                                    <ArrowRight className="w-4 h-4" />
                                                </motion.button>
                                            </Link>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
