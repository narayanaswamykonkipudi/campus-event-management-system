import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipboardList, Calendar, Download, Eye, XCircle } from 'lucide-react';
import { events, registrations as allRegistrations } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';

const tabs = ['All', 'Upcoming', 'Attended', 'Absent', 'Cancelled'];

const attendanceBadgeColors = {
    Registered: 'blue',
    Attended: 'green',
    Absent: 'red',
    Cancelled: 'yellow',
};

export const MyRegistrations = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('All');

    const myRegistrations = allRegistrations
        .filter(r => r.studentId === user?.id)
        .map(r => ({
            ...r,
            event: events.find(e => e.id === r.eventId)
        }))
        .filter(r => r.event);

    const filtered = myRegistrations.filter(r => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Upcoming') return r.attendanceStatus === 'Registered' && new Date(r.event.eventDate) > new Date();
        if (activeTab === 'Attended') return r.attendanceStatus === 'Attended';
        if (activeTab === 'Absent') return r.attendanceStatus === 'Absent';
        if (activeTab === 'Cancelled') return r.attendanceStatus === 'Cancelled';
        return true;
    });

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <ClipboardList className="w-6 h-6 text-forest-900" />
                <h1 className="text-2xl font-bold text-gray-900">My Registrations</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto pb-1">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${activeTab === tab
                                ? 'border-forest-900 text-forest-900'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab}
                        <span className="ml-1.5 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                            {tab === 'All' ? myRegistrations.length :
                                tab === 'Upcoming' ? myRegistrations.filter(r => r.attendanceStatus === 'Registered' && new Date(r.event.eventDate) > new Date()).length :
                                    myRegistrations.filter(r => r.attendanceStatus === tab).length}
                        </span>
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <Card className="text-center py-16">
                    <ClipboardList className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No registrations in this category.</p>
                    <Link to="/student/events" className="mt-3 inline-block text-forest-900 font-semibold text-sm hover:underline">
                        Browse Events to get started
                    </Link>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filtered.map((reg, i) => (
                        <motion.div
                            key={reg.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card className="!p-4">
                                <div className="flex items-start gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-gray-900 truncate">{reg.event.title}</h3>
                                            <Badge variant={attendanceBadgeColors[reg.attendanceStatus]}>
                                                {reg.attendanceStatus}
                                            </Badge>
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(reg.event.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                            <span>{reg.event.department}</span>
                                            {reg.score !== null && <span className="font-medium text-forest-900">Score: {reg.score}</span>}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Registered on {new Date(reg.registrationDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <Link
                                            to={`/student/events/${reg.eventId}`}
                                            className="flex items-center gap-1 text-xs text-forest-900 border border-forest-900/30 px-3 py-1.5 rounded-lg hover:bg-forest-900/5 transition-colors"
                                        >
                                            <Eye className="w-3 h-3" /> View
                                        </Link>
                                        {reg.certificateIssued && (
                                            <button className="flex items-center gap-1 text-xs text-white bg-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors">
                                                <Download className="w-3 h-3" /> Certificate
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};
