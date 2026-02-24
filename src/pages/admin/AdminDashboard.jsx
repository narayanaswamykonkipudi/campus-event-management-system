import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { stats } from '../../data/mockData';
import { Card } from '../../components/ui/Card';
import { Users, Calendar, CheckCircle, Activity } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
    <Card
        delay={delay}
        className="relative overflow-hidden group"
    >
        <div className="relative z-10">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color} bg-opacity-10 text-opacity-100`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            <p className="text-gray-500 font-medium mb-1">{title}</p>
            <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">{value}</h3>
        </div>
        <div className={`absolute -right-4 -bottom-4 w-32 h-32 rounded-full opacity-5 ${color}`} />
    </Card>
);

export const AdminDashboard = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1">Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-white p-2 rounded-lg border border-gray-200 text-gray-600 font-medium text-sm">Export Report</button>
                    <button className="bg-forest-900 px-4 py-2 rounded-lg text-white font-medium text-sm">Create Event</button>
                </div>
            </div>

            {/* Bento Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Events"
                    value={stats.totalEvents}
                    icon={Calendar}
                    color="bg-blue-500"
                    delay={0}
                />
                <StatCard
                    title="Total Registrations"
                    value={stats.totalRegistrations}
                    icon={Users}
                    color="bg-emerald-500"
                    delay={0.1}
                />
                <StatCard
                    title="Departments"
                    value={stats.departments}
                    icon={Activity}
                    color="bg-purple-500"
                    delay={0.2}
                />
                <StatCard
                    title="Active Events"
                    value={stats.activeEvents}
                    icon={CheckCircle}
                    color="bg-orange-500"
                    delay={0.3}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                {/* Dark Theme Area Chart */}
                <Card className="lg:col-span-2 bg-gray-900 border-gray-800 text-white shadow-xl shadow-black/20" delay={0.4}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Activity className="text-neon-green w-5 h-5" /> Registration Trends
                        </h3>
                        <div className="flex gap-2">
                            <span className="w-3 h-3 rounded-full bg-neon-green"></span>
                            <span className="text-xs text-gray-400">Past 30 Days</span>
                        </div>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.registrationsOverTime}>
                                <defs>
                                    <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#a3e635" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#a3e635" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#a3e635"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorReg)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Pie Chart */}
                <Card className="flex flex-col" delay={0.5}>
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Events by Category</h3>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.eventsByCategory}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.eventsByCategory.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#064e3b', '#a3e635', '#f97316', '#8b5cf6'][index % 4]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                        {stats.eventsByCategory.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#064e3b', '#a3e635', '#f97316', '#8b5cf6'][index % 4] }}></span>
                                <span className="text-gray-600 truncate">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};
