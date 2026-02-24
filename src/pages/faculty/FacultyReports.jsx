import { useAuth } from '../../context/AuthContext';
import { events as allEvents, registrations as allRegistrations, users } from '../../data/mockData';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { FileText, Download, BarChart2, Users, Award } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#064e3b', '#10b981', '#f97316', '#3b82f6', '#8b5cf6'];

export const FacultyReports = () => {
    const { user } = useAuth();
    const myEvents = allEvents.filter(e => e.createdBy === user?.id);

    const eventStats = myEvents.map(event => {
        const regs = allRegistrations.filter(r => r.eventId === event.id);
        const attended = regs.filter(r => r.attendanceStatus === 'Attended').length;
        return {
            name: event.title.slice(0, 14) + (event.title.length > 14 ? '…' : ''),
            registered: event.currentParticipants,
            attended,
            attendanceRate: event.currentParticipants > 0 ? Math.round((attended / event.currentParticipants) * 100) : 0,
        };
    });

    const categoryData = myEvents.reduce((acc, e) => {
        const found = acc.find(a => a.name === e.category);
        if (found) found.value++;
        else acc.push({ name: e.category, value: 1 });
        return acc;
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-forest-900" />
                    <h1 className="text-2xl font-bold text-gray-900">My Reports</h1>
                </div>
                <button className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4" /> Export Report
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { icon: BarChart2, label: 'Events Conducted', value: myEvents.length, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { icon: Users, label: 'Total Registrations', value: myEvents.reduce((s, e) => s + e.currentParticipants, 0), color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { icon: Award, label: 'Certificates Issued', value: allRegistrations.filter(r => myEvents.some(e => e.id === r.eventId) && r.certificateIssued).length, color: 'text-yellow-500', bg: 'bg-yellow-50' },
                ].map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <Card key={i} className={`${s.bg} !p-4`}>
                            <Icon className={`w-5 h-5 ${s.color} mb-2`} />
                            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                            <p className="text-sm text-gray-600">{s.label}</p>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Registrations vs Attendance chart */}
                <Card>
                    <h2 className="font-bold text-gray-900 mb-4">Registered vs Attended</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={eventStats}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <Bar dataKey="registered" name="Registered" fill="#064e3b" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="attended" name="Attended" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                {/* Events by Category */}
                <Card>
                    <h2 className="font-bold text-gray-900 mb-4">Events by Category</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4}>
                                {categoryData.map((_, idx) => (
                                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>

                {/* Event-by-event table */}
                <Card className="lg:col-span-2">
                    <h2 className="font-bold text-gray-900 mb-4">Event-wise Summary</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    {['Event', 'Type', 'Date', 'Registered', 'Attended', 'Attendance Rate', 'Status'].map(h => (
                                        <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide py-3 pr-4">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {myEvents.map(event => {
                                    const regs = allRegistrations.filter(r => r.eventId === event.id);
                                    const attended = regs.filter(r => r.attendanceStatus === 'Attended').length;
                                    const rate = event.currentParticipants > 0 ? Math.round((attended / event.currentParticipants) * 100) : 0;
                                    return (
                                        <tr key={event.id} className="hover:bg-gray-50/50">
                                            <td className="py-3 pr-4 font-medium text-gray-900">{event.title}</td>
                                            <td className="py-3 pr-4 text-gray-600">{event.category}</td>
                                            <td className="py-3 pr-4 text-gray-600">{new Date(event.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                            <td className="py-3 pr-4 font-semibold text-gray-900">{event.currentParticipants}</td>
                                            <td className="py-3 pr-4 font-semibold text-emerald-600">{attended}</td>
                                            <td className="py-3 pr-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-gray-100 rounded-full h-1.5 max-w-16">
                                                        <div className="bg-emerald-500 rounded-full h-1.5" style={{ width: `${rate}%` }} />
                                                    </div>
                                                    <span className="text-xs font-semibold text-gray-700">{rate}%</span>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <Badge variant={event.status === 'Upcoming' ? 'green' : event.status === 'Completed' ? 'purple' : 'yellow'}>{event.status}</Badge>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};
