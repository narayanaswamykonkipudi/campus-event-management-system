import { motion } from 'framer-motion';
import { BarChart3, Users, Calendar, Award, TrendingUp } from 'lucide-react';
import { stats, topStudents, users as allUsers, events as allEvents, registrations } from '../../data/mockData';
import { Card } from '../../components/ui/Card';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const COLORS = ['#064e3b', '#10b981', '#f97316', '#3b82f6', '#8b5cf6'];

export const SystemAnalytics = () => {
    const facultyCount = allUsers.filter(u => u.role === 'faculty').length;
    const studentCount = allUsers.filter(u => u.role === 'student').length;

    const roleData = [
        { name: 'Students', value: studentCount },
        { name: 'Faculty', value: facultyCount },
        { name: 'Admins', value: allUsers.filter(u => u.role === 'admin').length },
    ];

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-forest-900" />
                <h1 className="text-2xl font-bold text-gray-900">System Analytics</h1>
            </div>

            {/* KPI Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { icon: Calendar, label: 'Total Events', value: stats.totalEvents, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { icon: Users, label: 'Total Users', value: stats.totalUsers, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { icon: TrendingUp, label: 'Total Registrations', value: stats.totalRegistrations, color: 'text-orange-500', bg: 'bg-orange-50' },
                    { icon: Award, label: 'Certificates Issued', value: stats.totalCertificates, color: 'text-purple-500', bg: 'bg-purple-50' },
                ].map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                            <Card className={`${s.bg} !p-4`}>
                                <Icon className={`w-5 h-5 ${s.color} mb-2`} />
                                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                                <p className="text-sm text-gray-600">{s.label}</p>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Registrations Over Time */}
                <Card>
                    <h2 className="font-bold text-gray-900 mb-4">Registrations Over Time</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={stats.registrationsOverTime}>
                            <defs>
                                <linearGradient id="colorRegs" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#064e3b" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#064e3b" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Area type="monotone" dataKey="value" stroke="#064e3b" fill="url(#colorRegs)" strokeWidth={2} name="Registrations" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>

                {/* Events by Category */}
                <Card>
                    <h2 className="font-bold text-gray-900 mb-4">Events by Category</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={stats.eventsByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4}>
                                {stats.eventsByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Legend />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>

                {/* Attendance Rate by Department */}
                <Card>
                    <h2 className="font-bold text-gray-900 mb-4">Attendance Rate by Department</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={stats.attendanceRateByDept} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                            <YAxis type="category" dataKey="name" width={40} tick={{ fontSize: 11 }} />
                            <Tooltip formatter={v => `${v}%`} />
                            <Bar dataKey="rate" fill="#10b981" radius={[0, 4, 4, 0]} name="Attendance %" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                {/* User Role Distribution */}
                <Card>
                    <h2 className="font-bold text-gray-900 mb-4">User Role Distribution</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={roleData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Count" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Year-wise participation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h2 className="font-bold text-gray-900 mb-4">Year-wise Participation</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={stats.yearWiseParticipation}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Participants" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                {/* Top Students */}
                <Card>
                    <h2 className="font-bold text-gray-900 mb-4">Top Students by Merit Points</h2>
                    <div className="space-y-3">
                        {topStudents.map(s => (
                            <div key={s.rank} className="flex items-center gap-3">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${s.rank === 1 ? 'bg-yellow-100 text-yellow-700' : s.rank === 2 ? 'bg-gray-100 text-gray-700' : s.rank === 3 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-600'}`}>
                                    {s.rank}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 text-sm truncate">{s.name}</p>
                                    <p className="text-xs text-gray-500">{s.department} | {s.year} Year</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-forest-900 text-sm">{s.meritPoints} pts</p>
                                    <p className="text-xs text-gray-400">{s.eventsAttended} events</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};
