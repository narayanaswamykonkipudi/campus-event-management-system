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

const StudentDashboard = () => {
    const [events, setEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [downloadingId, setDownloadingId] = useState(null);
    const [activeTab, setActiveTab] = useState('events'); // 'events' | 'myregs'

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        try {
            const [resEvents, resRegs] = await Promise.all([
                axios.get('http://localhost:5000/api/events', { headers: { Authorization: token } }),
                axios.get('http://localhost:5000/api/registrations/my', { headers: { Authorization: token } }),
            ]);
            setEvents(resEvents.data);
            setRegistrations(resRegs.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleRegister = async (e, eventId) => {
        e.stopPropagation();
        const token = localStorage.getItem('token');
        try {
            await axios.post(`http://localhost:5000/api/registrations/register/${eventId}`, {}, { headers: { Authorization: token } });
            setMessage('✅ Successfully registered!');
            fetchData();
        } catch (err) {
            setMessage('❌ ' + (err.response?.data?.message || 'Registration failed'));
        }
        setTimeout(() => setMessage(''), 4000);
    };

    const isRegistered = (eventId) => registrations.some(reg => reg.eventId._id === eventId);

    const handleDownloadCert = async (reg) => {
        const token = localStorage.getItem('token');
        setDownloadingId(reg._id);
        try {
            const res = await axios.get(
                `http://localhost:5000/api/registrations/${reg._id}/certificate`,
                { headers: { Authorization: token }, responseType: 'blob' }
            );
            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            const certLabel = reg.certificateType === 'merit' ? 'Certificate_of_Merit' : 'Certificate_of_Participation';
            link.href = url;
            link.setAttribute('download', `${certLabel}_${(reg.eventId?.title || 'Event').replace(/[^a-z0-9]/gi, '_')}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert('Could not download certificate. Please try again.');
        } finally {
            setDownloadingId(null);
        }
    };

    // Split eligible events
    const upcomingEvents = events.filter(e => getEventStatus(e) === 'upcoming');
    const endedEvents = events.filter(e => getEventStatus(e) === 'ended');

    // Pending certs (registrations where cert is available)
    const certReadyRegs = registrations.filter(r =>
        getEventStatus(r.eventId) === 'ended' && r.certificateType && r.certificateType !== 'none'
    );

    return (
        <div>
            <h1>Student Dashboard</h1>

            {message && (
                <div style={{ padding: '10px', background: message.startsWith('✅') ? '#dcfce7' : '#fee2e2', color: message.startsWith('✅') ? '#166534' : '#991b1b', border: `1px solid ${message.startsWith('✅') ? '#bbf7d0' : '#fca5a5'}`, borderRadius: '8px', marginBottom: '20px' }}>
                    {message}
                </div>
            )}

            {/* Cert ready notification banner */}
            {certReadyRegs.length > 0 && (
                <div style={{ background: 'linear-gradient(135deg,#0ea5e9,#7c3aed)', color: '#fff', borderRadius: '10px', padding: '12px 18px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>🎓 You have <strong>{certReadyRegs.length}</strong> certificate{certReadyRegs.length > 1 ? 's' : ''} ready to download!</span>
                    <button onClick={() => setActiveTab('myregs')} style={{ background: '#fff', color: '#0ea5e9', fontWeight: 700, padding: '6px 14px', fontSize: '0.85rem' }}>View →</button>
                </div>
            )}

            {/* Tab bar */}
            <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid #e2e8f0', marginBottom: '20px' }}>
                {[{ key: 'events', label: '📅 Events' }, { key: 'myregs', label: `📋 My Registrations (${registrations.length})` }].map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ background: 'transparent', color: activeTab === tab.key ? '#0ea5e9' : '#64748b', borderBottom: activeTab === tab.key ? '3px solid #0ea5e9' : '3px solid transparent', borderRadius: 0, padding: '10px 20px', fontWeight: activeTab === tab.key ? 700 : 500 }}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Events Tab ── */}
            {activeTab === 'events' && (
                <>
                    {upcomingEvents.length > 0 && (
                        <>
                            <h3 style={{ color: '#059669' }}>🟢 Upcoming Events</h3>
                            <div className="event-list">
                                {upcomingEvents.map(event => (
                                    <div key={event._id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelectedEvent(event)}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <h4 style={{ margin: 0 }}>{event.title}</h4>
                                                    <EventStatusBadge event={event} />
                                                </div>
                                                <p style={{ margin: '4px 0', color: '#64748b', fontSize: '0.85rem' }}>{event.description.substring(0, 100)}…</p>
                                                <p style={{ margin: 0, fontSize: '0.82rem' }}><strong>Seats:</strong> {event.currentRegistrations}/{event.maxRegistrations}</p>
                                            </div>
                                            <div onClick={e => e.stopPropagation()}>
                                                {isRegistered(event._id)
                                                    ? <button disabled style={{ background: '#cbd5e1', cursor: 'default' }}>✔ Registered</button>
                                                    : <button onClick={e => handleRegister(e, event._id)}>Register</button>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {endedEvents.length > 0 && (
                        <>
                            <h3 style={{ color: '#dc2626', marginTop: '24px' }}>🔴 Ended Events</h3>
                            <div className="event-list">
                                {endedEvents.map(event => (
                                    <div key={event._id} className="card" style={{ cursor: 'pointer', opacity: 0.8, borderColor: '#fca5a5' }} onClick={() => setSelectedEvent(event)}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <h4 style={{ margin: 0, color: '#64748b' }}>{event.title}</h4>
                                            <EventStatusBadge event={event} />
                                        </div>
                                        <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>{event.department} — {event.currentRegistrations} participants</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {events.length === 0 && <p style={{ color: '#94a3b8' }}>No eligible events found.</p>}
                </>
            )}

            {/* ── My Registrations Tab ── */}
            {activeTab === 'myregs' && (
                <>
                    {registrations.length === 0 ? <p style={{ color: '#94a3b8' }}>You have not registered for any events yet.</p> : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Event</th>
                                    <th>Status</th>
                                    <th>Event Status</th>
                                    <th>Certificate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrations.map(reg => {
                                    const ended = getEventStatus(reg.eventId) === 'ended';
                                    const isMerit = reg.certificateType === 'merit';
                                    return (
                                        <tr key={reg._id}>
                                            <td>
                                                <strong>{reg.eventId.title}</strong>
                                                <br /><span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Registered {new Date(reg.registeredAt).toLocaleDateString('en-IN')}</span>
                                            </td>
                                            <td><span className={`status-badge status-${reg.status}`}>{reg.status}</span></td>
                                            <td><EventStatusBadge event={reg.eventId} /></td>
                                            <td>
                                                {!ended ? (
                                                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>⏳ Awaiting event end</span>
                                                ) : !reg.certificateType ? (
                                                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>⏳ Awaiting faculty</span>
                                                ) : reg.certificateType === 'none' ? (
                                                    <span style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600 }}>❌ Not eligible</span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleDownloadCert(reg)}
                                                        disabled={downloadingId === reg._id}
                                                        style={{ background: isMerit ? '#d97706' : '#0ea5e9', padding: '6px 14px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                                    >
                                                        {downloadingId === reg._id ? 'Generating…' : <>{isMerit ? '🏆' : '🏅'} Download {isMerit ? 'Merit' : 'Participation'} Cert</>}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </>
            )}

            <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        </div>
    );
};

export default StudentDashboard;
