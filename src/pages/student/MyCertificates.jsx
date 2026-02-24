import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Download, Search, Calendar } from 'lucide-react';
import { events, registrations as allRegistrations } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const MyCertificates = () => {
    const { user } = useAuth();
    const [search, setSearch] = useState('');

    const certificates = allRegistrations
        .filter(r => r.studentId === user?.id && r.certificateIssued)
        .map(r => ({ ...r, event: events.find(e => e.id === r.eventId) }))
        .filter(r => r.event && r.event.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-yellow-500" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Certificates</h1>
                        <p className="text-sm text-gray-500">You have earned <strong>{certificates.length}</strong> certificate(s).</p>
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by event..."
                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/30"
                    />
                </div>
            </div>

            {certificates.length === 0 ? (
                <Card className="text-center py-16">
                    <Award className="w-16 h-16 text-gray-200 mx-auto mb-3" />
                    <h3 className="font-bold text-gray-700 text-lg">No Certificates Yet</h3>
                    <p className="text-gray-400 text-sm mt-1">Attend events to earn certificates.</p>
                    <Link to="/student/events" className="mt-4 inline-block text-sm text-forest-900 font-semibold hover:underline">
                        Browse Events
                    </Link>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {certificates.map((cert, i) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.08 }}
                        >
                            <Card className="flex flex-col h-full">
                                <div className="flex-1">
                                    <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center mb-3">
                                        <Award className="w-6 h-6 text-yellow-500" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-base mb-1">{cert.event.title}</h3>
                                    <Badge variant="green">Certificate Issued</Badge>
                                    <div className="mt-3 space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>Event: {new Date(cert.event.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                        <p className="text-sm text-gray-500">{cert.event.department}</p>
                                        {cert.score !== null && (
                                            <p className="text-sm font-semibold text-forest-900">Score: {cert.score}</p>
                                        )}
                                    </div>
                                </div>
                                <button className="mt-4 w-full flex items-center justify-center gap-2 bg-forest-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-forest-800 transition-colors">
                                    <Download className="w-4 h-4" /> Download Certificate
                                </button>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};
