import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    Radar, ResponsiveContainer, Tooltip,
    AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { studentStats, events, registrations } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Trophy, Calendar, Award, Star, ArrowRight, Clock } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, suffix = '', delay = 0 }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
        <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}18` }}>
                <Icon className="w-6 h-6" style={{ color }} />
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}{suffix}</h3>
            </div>
        </Card>
    </motion.div>
);

export const StudentDashboard = () => {
    const { user } = useAuth();

    // Get upcoming events the current student is registered for
    const myRegistrations = registrations.filter(r => r.studentId === user?.id);
    const upcomingEvents = myRegistrations
        .map(r => ({ reg: r, event: events.find(e => e.id === r.eventId) }))
        .filter(({ event }) => event && event.status === 'Upcoming')
        .slice(0, 3);

    // Recommend events not yet registered for
    const registeredIds = new Set(myRegistrations.map(r => r.eventId));
    const recommended = events.filter(e => !registeredIds.has(e.id) && e.status === 'Upcoming').slice(0, 3);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, {user?.name?.split(' ')[0] ?? 'Student'} 👋
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {user?.department} · {user?.year} Year · Section {user?.section}
                    </p>
                </div>
                <Link to="/student/events">
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-2 bg-forest-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-forest-800 transition-colors">
                        Browse Events <ArrowRight className="w-4 h-4" />
                    </motion.button>
                </Link>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Events Attended" value={studentStats.eventsAttended} icon={Trophy} color="#f97316" delay={0} />
                <StatCard title="Upcoming RSVPs" value={studentStats.upcoming} icon={Calendar} color="#064e3b" delay={0.05} />
                <StatCard title="Merit Points" value={user?.meritPoints ?? studentStats.meritPoints} icon={Star} color="#eab308" delay={0.1} />
                <StatCard title="Certificates" value={user?.certificatesEarned ?? studentStats.certificatesEarned} icon={Award} color="#8b5cf6" delay={0.15} />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Participation Radar */}
                <Card delay={0.2}>
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Participation Analysis</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={studentStats.involvement}>
                                <PolarGrid stroke="#e5e7eb" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                <Radar name="You" dataKey="A" stroke="#064e3b" strokeWidth={2.5} fill="#064e3b" fillOpacity={0.18} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: 12 }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Participation Trend */}
                <Card delay={0.25}>
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Participation Trend</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={studentStats.participationTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#064e3b" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#064e3b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgb(0 0 0 / 0.08)', fontSize: 12 }} />
                                <Area type="monotone" dataKey="events" stroke="#064e3b" strokeWidth={2.5} fill="url(#trendGrad)" dot={{ fill: '#064e3b', r: 4 }} activeDot={{ r: 6 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Upcoming Events & Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* My Upcoming */}
                <Card delay={0.3}>
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-bold text-gray-900">My Upcoming Events</h3>
                        <Link to="/student/registrations" className="text-xs text-forest-900 font-semibold hover:underline">
                            View all
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {upcomingEvents.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-sm">
                                <Clock className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                                No upcoming events registered.
                                <br />
                                <Link to="/student/events" className="text-forest-900 font-semibold hover:underline">Browse events →</Link>
                            </div>
                        ) : upcomingEvents.map(({ event, reg }) => (
                            <Link key={reg.id} to={`/student/events/${event.id}`}>
                                <div className="flex gap-4 items-center p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 group-hover:text-forest-900 transition-colors text-sm truncate">{event.title}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {new Date(event.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {event.category}
                                        </p>
                                    </div>
                                    <Badge variant="success" className="text-xs flex-shrink-0">Registered</Badge>
                                </div>
                            </Link>
                        ))}
                    </div>
                </Card>

                {/* Recommended */}
                <Card delay={0.35}>
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-bold text-gray-900">Recommended For You</h3>
                        <Link to="/student/events" className="text-xs text-forest-900 font-semibold hover:underline">
                            See all
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recommended.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-8">You're registered for all upcoming events!</p>
                        ) : recommended.map((event) => (
                            <Link key={event.id} to={`/student/events/${event.id}`}>
                                <div className="flex gap-4 items-center p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                                        <img
                                            src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=200'}
                                            alt={event.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 group-hover:text-forest-900 transition-colors text-sm truncate">{event.title}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {new Date(event.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {event.currentParticipants}/{event.maxParticipants} registered
                                        </p>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        className="p-2 bg-forest-900/10 rounded-xl text-forest-900 group-hover:bg-forest-900 group-hover:text-white transition-colors flex-shrink-0"
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </Link>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};
