import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import EventModal from '../components/EventModal';

const PIE_COLORS = ['#22c55e', '#ef4444'];

const getEventStatus = (event) => {
    const endDate = event?.eventDate || event?.deadline;
    if (!endDate) return 'upcoming';
    return new Date() > new Date(endDate) ? 'ended' : 'upcoming';
};

const EventStatusBadge = ({ event }) => {
    const status = getEventStatus(event);
    return status === 'ended'
        ? <span className="event-badge event-badge--ended">● ENDED</span>
        : <span className="event-badge event-badge--upcoming">● UPCOMING</span>;
};

const AdminDashboard = () => {
    const [events, setEvents] = useState([]);
    const [userStats, setUserStats] = useState({ studentCount: 0, facultyCount: 0, adminCount: 0 });
    const [metrics, setMetrics] = useState({ totalEvents: 0, totalRegistrations: 0, totalCapacity: 0, deptStats: {} });
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        try {
            const [resEvents, resStats] = await Promise.all([
                axios.get('http://localhost:5000/api/events', { headers: { Authorization: token } }),
                axios.get('http://localhost:5000/api/auth/stats', { headers: { Authorization: token } }),
            ]);
            setEvents(resEvents.data);
            setUserStats(resStats.data);

            let totalRegs = 0, totalCap = 0;
            const deptStats = {};
            resEvents.data.forEach(e => {
                totalRegs += e.currentRegistrations;
                totalCap += e.maxRegistrations;
                if (!deptStats[e.department]) deptStats[e.department] = { events: 0, regs: 0, cap: 0 };
                deptStats[e.department].events += 1;
                deptStats[e.department].regs += e.currentRegistrations;
                deptStats[e.department].cap += e.maxRegistrations;
            });
            setMetrics({ totalEvents: resEvents.data.length, totalRegistrations: totalRegs, totalCapacity: totalCap, deptStats });
        } catch (err) {
            console.error(err);
            setError('Failed to fetch dashboard data.');
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm('Delete this event?')) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/events/${id}`, { headers: { Authorization: token } });
            fetchData();
        } catch { alert('Delete failed'); }
    };

    const occupancyRate = metrics.totalCapacity > 0 ? ((metrics.totalRegistrations / metrics.totalCapacity) * 100).toFixed(1) : 0;
    const endedCount = events.filter(e => getEventStatus(e) === 'ended').length;
    const upcomingCount = events.length - endedCount;

    // Data for charts
    const pieData = [
        { name: 'Upcoming', value: upcomingCount },
        { name: 'Ended', value: endedCount },
    ];

    const barData = Object.entries(metrics.deptStats).map(([dept, stats]) => ({
        dept,
        Registrations: stats.regs,
        Capacity: stats.cap,
    }));

    const filteredEvents = events.filter(e => {
        if (statusFilter === 'upcoming') return getEventStatus(e) === 'upcoming';
        if (statusFilter === 'ended') return getEventStatus(e) === 'ended';
        return true;
    }).sort((a, b) => {
        const aEnded = getEventStatus(a) === 'ended';
        const bEnded = getEventStatus(b) === 'ended';
        return aEnded === bEnded ? 0 : aEnded ? 1 : -1;
    });

    return (
        <div>
            <h1>Admin Dashboard</h1>
            {error && <p className="error-msg">{error}</p>}

            {/* Stat cards row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '8px' }}>
                {/* Platform Users */}
                <div className="card stat-card">
                    <div className="stat-card-icon" style={{ background: '#ede9fe', color: '#7c3aed' }}>👥</div>
                    <div className="stat-card-body">
                        <p className="stat-card-label">Platform Users</p>
                        <p className="stat-card-value">{userStats.studentCount + userStats.facultyCount + userStats.adminCount}</p>
                        <p className="stat-card-sub">
                            {userStats.studentCount} Students · {userStats.facultyCount} Faculty · {userStats.adminCount} Admin
                        </p>
                    </div>
                </div>

                {/* Total Events */}
                <div className="card stat-card">
                    <div className="stat-card-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>📅</div>
                    <div className="stat-card-body">
                        <p className="stat-card-label">Total Events</p>
                        <p className="stat-card-value">{metrics.totalEvents}</p>
                        <p className="stat-card-sub">
                            <span style={{ color: '#16a34a' }}>↑ {upcomingCount} upcoming</span>
                            {' · '}
                            <span style={{ color: '#dc2626' }}>✓ {endedCount} ended</span>
                        </p>
                    </div>
                </div>

                {/* Occupancy */}
                <div className="card stat-card">
                    <div className="stat-card-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>📊</div>
                    <div className="stat-card-body">
                        <p className="stat-card-label">Seat Occupancy</p>
                        <p className="stat-card-value">{occupancyRate}%</p>
                        <div style={{ marginTop: '8px', height: '6px', background: '#e2e8f0', borderRadius: '3px' }}>
                            <div style={{ width: `${occupancyRate}%`, height: '100%', background: '#0ea5e9', borderRadius: '3px', transition: 'width 0.6s' }} />
                        </div>
                        <p className="stat-card-sub" style={{ marginTop: '4px' }}>{metrics.totalRegistrations} / {metrics.totalCapacity} seats</p>
                    </div>
                </div>
            </div>

            {/* Charts row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginTop: '16px' }}>
                {/* Donut / Pie chart - Event Status */}
                <div className="card" style={{ minHeight: '260px' }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: '1rem', color: '#475569' }}>Events Status</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={80}
                                paddingAngle={4}
                                dataKey="value"
                            >
                                {pieData.map((entry, i) => (
                                    <Cell key={i} fill={PIE_COLORS[i]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend iconType="circle" iconSize={10} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar chart - Department Registrations */}
                <div className="card" style={{ minHeight: '260px' }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: '1rem', color: '#475569' }}>Department — Registrations vs Capacity</h3>
                    {barData.length === 0 ? (
                        <p style={{ color: '#94a3b8', textAlign: 'center', paddingTop: '60px' }}>No data yet</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="dept" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Legend iconType="circle" iconSize={10} />
                                <Bar dataKey="Registrations" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Capacity" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* All Events table */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px' }}>
                <h3 style={{ margin: 0 }}>All Events</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {[{ key: 'all', label: 'All' }, { key: 'upcoming', label: '🟢 Upcoming' }, { key: 'ended', label: '🔴 Ended' }].map(opt => (
                        <button key={opt.key} onClick={() => setStatusFilter(opt.key)}
                            style={{ background: statusFilter === opt.key ? '#0ea5e9' : '#f1f5f9', color: statusFilter === opt.key ? '#fff' : '#475569', padding: '5px 14px', fontSize: '0.82rem' }}>
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Dept</th>
                        <th>Faculty</th>
                        <th>Status</th>
                        <th>Registrations</th>
                        <th>Fill %</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEvents.map(event => {
                        const fillPercent = ((event.currentRegistrations / event.maxRegistrations) * 100).toFixed(0);
                        const ended = getEventStatus(event) === 'ended';
                        return (
                            <tr key={event._id} style={{ cursor: 'pointer', opacity: ended ? 0.75 : 1 }} onClick={() => setSelectedEvent(event)}>
                                <td><strong>{event.title}</strong></td>
                                <td>{event.department}</td>
                                <td>{event.createdBy?.name || 'Faculty'}</td>
                                <td><EventStatusBadge event={event} /></td>
                                <td>{event.currentRegistrations} / {event.maxRegistrations}</td>
                                <td>
                                    <span style={{ color: fillPercent > 80 ? '#e74c3c' : fillPercent > 50 ? '#f39c12' : '#27ae60', fontWeight: 'bold' }}>
                                        {fillPercent}%
                                    </span>
                                </td>
                                <td>
                                    <button style={{ background: '#e74c3c', padding: '5px 8px' }} onClick={e => handleDelete(e, event._id)}>Delete</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        </div>
    );
};

export default AdminDashboard;
