import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventModal from '../components/EventModal';

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
    const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'upcoming' | 'ended'

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

            {/* Stats cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                <div className="card">
                    <h3>Platform Users</h3>
                    <p><strong>Students:</strong> {userStats.studentCount}</p>
                    <p><strong>Faculty:</strong> {userStats.facultyCount}</p>
                    <p><strong>Admins:</strong> {userStats.adminCount}</p>
                </div>
                <div className="card">
                    <h3>Events Overview</h3>
                    <p><strong>Total:</strong> {metrics.totalEvents}</p>
                    <p style={{ color: '#059669' }}><strong>🟢 Upcoming:</strong> {upcomingCount}</p>
                    <p style={{ color: '#dc2626' }}><strong>🔴 Ended:</strong> {endedCount}</p>
                </div>
                <div className="card">
                    <h3>Registration Health</h3>
                    <p><strong>Seats Filled:</strong> {metrics.totalRegistrations} / {metrics.totalCapacity}</p>
                    <div style={{ marginTop: '10px', height: '10px', background: '#e2e8f0', borderRadius: '5px' }}>
                        <div style={{ width: `${occupancyRate}%`, height: '100%', background: '#0ea5e9', borderRadius: '5px', transition: 'width 0.5s' }} />
                    </div>
                    <p style={{ marginTop: '5px' }}><strong>Occupancy:</strong> {occupancyRate}%</p>
                </div>
                <div className="card">
                    <h3>Dept Performance</h3>
                    <table style={{ fontSize: '0.85rem', marginTop: 0 }}>
                        <thead><tr><th>Dept</th><th>Events</th><th>Regs</th><th>Util%</th></tr></thead>
                        <tbody>
                            {Object.entries(metrics.deptStats).map(([dept, stats]) => (
                                <tr key={dept}>
                                    <td>{dept}</td>
                                    <td>{stats.events}</td>
                                    <td>{stats.regs}</td>
                                    <td>{((stats.regs / stats.cap) * 100 || 0).toFixed(0)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* All Events table */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px' }}>
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
