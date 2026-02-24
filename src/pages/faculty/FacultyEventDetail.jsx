import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, Award, ChevronLeft, Check, X, Download } from 'lucide-react';
import { events, registrations as allRegistrations, users } from '../../data/mockData';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';

export const FacultyEventDetail = () => {
    const { eventId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const event = events.find(e => e.id === eventId);

    const registrations = allRegistrations
        .filter(r => r.eventId === eventId)
        .map(r => ({ ...r, student: users.find(u => u.id === r.studentId) }));

    const [marks, setMarks] = useState(
        Object.fromEntries(registrations.map(r => [r.id, { score: r.score ?? '', attendance: r.attendanceStatus }]))
    );
    const [saved, setSaved] = useState(false);

    if (!event) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500">Event not found.</p>
                <Link to="/faculty/events" className="mt-4 text-forest-900 font-semibold hover:underline">Back to events</Link>
            </div>
        );
    }

    const handleSave = async () => {
        await new Promise(r => setTimeout(r, 600));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
                    <p className="text-sm text-gray-500">Event Management</p>
                </div>
            </div>

            {/* Event Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { icon: Calendar, label: 'Event Date', value: new Date(event.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), color: 'text-blue-500', bg: 'bg-blue-50' },
                    { icon: Users, label: 'Total Registered', value: event.currentParticipants, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { icon: Check, label: 'Attended', value: registrations.filter(r => r.attendanceStatus === 'Attended').length, color: 'text-purple-500', bg: 'bg-purple-50' },
                    { icon: X, label: 'Absent', value: registrations.filter(r => r.attendanceStatus === 'Absent').length, color: 'text-red-500', bg: 'bg-red-50' },
                ].map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <Card key={i} className={`${s.bg} !p-4`}>
                            <Icon className={`w-5 h-5 ${s.color} mb-2`} />
                            <p className="text-xl font-bold text-gray-900">{s.value}</p>
                            <p className="text-sm text-gray-600">{s.label}</p>
                        </Card>
                    );
                })}
            </div>

            {/* Attendance & Scores Table */}
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-gray-900 text-lg">Registrations & Attendance</h2>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-1.5 text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                            <Download className="w-3 h-3" /> Export CSV
                        </button>
                        <motion.button onClick={handleSave} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-1.5 text-xs bg-forest-900 text-white px-4 py-1.5 rounded-lg hover:bg-forest-800 transition-colors">
                            {saved ? <Check className="w-3 h-3" /> : null} {saved ? 'Saved!' : 'Save Changes'}
                        </motion.button>
                    </div>
                </div>

                {registrations.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">No registrations yet.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide py-3 pr-4">Student</th>
                                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide py-3 pr-4">Dept / Year</th>
                                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide py-3 pr-4">Attendance</th>
                                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide py-3 pr-4">Score</th>
                                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide py-3">Certificate</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {registrations.map(reg => (
                                    <tr key={reg.id} className="hover:bg-gray-50/50">
                                        <td className="py-3 pr-4">
                                            <div className="flex items-center gap-2">
                                                <img src={reg.student?.avatar} alt="" className="w-7 h-7 rounded-full" />
                                                <div>
                                                    <p className="font-medium text-gray-900">{reg.student?.name}</p>
                                                    <p className="text-xs text-gray-400">{reg.student?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 pr-4 text-gray-600">
                                            {reg.student?.department} / {reg.student?.year}
                                        </td>
                                        <td className="py-3 pr-4">
                                            <select
                                                value={marks[reg.id]?.attendance}
                                                onChange={e => setMarks(m => ({ ...m, [reg.id]: { ...m[reg.id], attendance: e.target.value } }))}
                                                className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-forest-900/30"
                                            >
                                                <option value="Registered">Registered</option>
                                                <option value="Attended">Attended</option>
                                                <option value="Absent">Absent</option>
                                            </select>
                                        </td>
                                        <td className="py-3 pr-4">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={marks[reg.id]?.score}
                                                onChange={e => setMarks(m => ({ ...m, [reg.id]: { ...m[reg.id], score: e.target.value } }))}
                                                placeholder="—"
                                                className="w-20 text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-forest-900/30"
                                            />
                                        </td>
                                        <td className="py-3">
                                            <button className="text-xs text-emerald-600 border border-emerald-200 px-2 py-1 rounded-lg hover:bg-emerald-50 transition-colors">
                                                Issue
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
};
