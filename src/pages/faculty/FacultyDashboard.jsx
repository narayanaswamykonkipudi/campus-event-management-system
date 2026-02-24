import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Users, CheckCircle, PlusSquare, TrendingUp, Clock, Award, AlertCircle } from 'lucide-react';
import { events, facultyStats } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const statCards = (stats) => [
    { icon: Calendar, label: 'Total Events Created', value: stats.totalEventsCreated, color: 'bg-blue-50', iconColor: 'text-blue-500' },
    { icon: Users, label: 'Total Registrations', value: stats.totalRegistrations, color: 'bg-emerald-50', iconColor: 'text-emerald-500' },
    { icon: TrendingUp, label: 'Active Events', value: stats.activeEvents, color: 'bg-orange-50', iconColor: 'text-orange-500' },
    { icon: CheckCircle, label: 'Completed Events', value: stats.completedEvents, color: 'bg-purple-50', iconColor: 'text-purple-500' },
];

export const FacultyDashboard = () => {
    const { user } = useAuth();

    const myEvents = events.filter(e => e.createdBy === user?.id);
    const regData = myEvents.map(e => ({ name: e.title.slice(0, 12) + '...', registered: e.currentParticipants, capacity: e.maxParticipants }));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name?.split(' ')[1] || user?.name}!</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your events and track engagement</p>
                </div>
                <Link to="/faculty/events/create">
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-2 bg-forest-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-forest-800 transition-colors shadow-lg shadow-forest-900/20"
                    >
                        <PlusSquare className="w-4 h-4" /> Create Event
                    </motion.button>
                </Link>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards(facultyStats).map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                            <Card className={`${card.color}`}>
                                <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-3 shadow-sm`}>
                                    <Icon className={`w-5 h-5 ${card.iconColor}`} />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                                <p className="text-sm text-gray-600 mt-0.5">{card.label}</p>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* My Events */}
                <div className="lg:col-span-2">
                    <Card>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-bold text-gray-900 text-lg">My Events</h2>
                            <Link to="/faculty/events" className="text-sm text-forest-900 font-semibold hover:underline">View All</Link>
                        </div>
                        <div className="space-y-3">
                            {myEvents.slice(0, 4).map(event => (
                                <Link key={event.id} to={`/faculty/events/${event.id}`} className="block">
                                    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                                        <div className="w-10 h-10 rounded-xl bg-forest-900/10 flex items-center justify-center flex-shrink-0">
                                            <Calendar className="w-5 h-5 text-forest-900" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-forest-900">{event.title}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(event.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} •{' '}
                                                {event.currentParticipants}/{event.maxParticipants} registered
                                            </p>
                                        </div>
                                        <Badge variant={event.status === 'Upcoming' ? 'green' : event.status === 'Completed' ? 'purple' : 'yellow'}>
                                            {event.status}
                                        </Badge>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        {myEvents.length === 0 && (
                            <div className="text-center py-8">
                                <Calendar className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                                <p className="text-gray-400 text-sm">No events created yet.</p>
                                <Link to="/faculty/events/create" className="mt-2 text-forest-900 text-sm font-semibold hover:underline block">Create your first event</Link>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Recent Activity */}
                <div>
                    <Card>
                        <h2 className="font-bold text-gray-900 text-lg mb-5">Recent Activity</h2>
                        <div className="space-y-4">
                            {facultyStats.recentActivity.map((act, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="w-2 h-2 rounded-full bg-forest-900 mt-1.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-700">{act.message}</p>
                                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />{act.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Registrations chart */}
            {regData.length > 0 && (
                <Card>
                    <h2 className="font-bold text-gray-900 text-lg mb-5">Registrations vs Capacity</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={regData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Bar dataKey="registered" fill="#064e3b" radius={[4, 4, 0, 0]} name="Registered" />
                            <Bar dataKey="capacity" fill="#d1fae5" radius={[4, 4, 0, 0]} name="Capacity" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            )}
        </div>
    );
};
