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

const DashTab = ({ tabs, active, onChange }) => (
    <div className="dash-tabs">
        {tabs.map(t => (
            <button
                key={t.key}
                className={`dash-tab${active === t.key ? ' dash-tab--active' : ''}`}
                onClick={() => onChange(t.key)}
            >
                <span className="dash-tab-icon">{t.icon}</span>
                {t.label}
            </button>
        ))}
    </div>
);

const StatCard = ({ icon, label, value, sub, color }) => (
    <div className="dash-stat-card">
        <div className="dash-stat-icon" style={{ background: color + '22', color }}>{icon}</div>
        <div>
            <p className="dash-stat-label">{label}</p>
            <p className="dash-stat-value">{value}</p>
            {sub && <p className="dash-stat-sub">{sub}</p>}
        </div>
    </div>
);

const StudentDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const [events, setEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [downloadingId, setDownloadingId] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

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
        } catch { alert('Could not download certificate.'); }
        finally { setDownloadingId(null); }
    };

    // Derived stats
    const upcomingEvents = events.filter(e => getEventStatus(e) === 'upcoming');
    const endedEvents = events.filter(e => getEventStatus(e) === 'ended');
    const certReadyRegs = registrations.filter(r =>
        getEventStatus(r.eventId) === 'ended' && r.certificateType && r.certificateType !== 'none'
    );
    const meritCount = registrations.filter(r => r.certificateType === 'merit').length;
    const participationCount = registrations.filter(r => r.certificateType === 'participation').length;
    const attendedCount = registrations.filter(r => getEventStatus(r.eventId) === 'ended').length;

    const tabs = [
        { key: 'overview', icon: '🏠', label: 'Overview' },
        { key: 'events', icon: '📅', label: 'Events' },
        { key: 'myregs', icon: '📋', label: `Registrations (${registrations.length})` },
        { key: 'profile', icon: '👤', label: 'Profile' },
    ];

    return (
        <div className="dash-page">
            {/* Page header */}
            <div className="dash-page-header">
                <div>
                    <h1 className="dash-page-title">Student Dashboard</h1>
                    <p className="dash-page-sub">Hello, <strong>{user.name}</strong> · {user.department} · Year {user.year} · Sec {user.section}</p>
                </div>
                {certReadyRegs.length > 0 && (
                    <div className="dash-cert-banner" onClick={() => setActiveTab('myregs')} title="Go to registrations">
                        🎓 <strong>{certReadyRegs.length}</strong> cert{certReadyRegs.length > 1 ? 's' : ''} ready ↗
                    </div>
                )}
            </div>

            <DashTab tabs={tabs} active={activeTab} onChange={setActiveTab} />

            {message && (
                <div className={`dash-alert ${message.startsWith('✅') ? 'dash-alert--success' : 'dash-alert--error'}`}>
                    {message}
                </div>
            )}

            {/* ── OVERVIEW ── */}
            {activeTab === 'overview' && (
                <div className="dash-section">
                    <div className="dash-stats-row">
                        <StatCard icon="📅" label="Events Available" value={events.length} sub={`${upcomingEvents.length} upcoming`} color="#0ea5e9" />
                        <StatCard icon="✅" label="Registered" value={registrations.length} sub={`${attendedCount} attended`} color="#7c3aed" />
                        <StatCard icon="🏅" label="Participations" value={participationCount} color="#2563eb" />
                        <StatCard icon="🏆" label="Merit Certs" value={meritCount} color="#d97706" />
                    </div>

                    {/* Cert progress section */}
                    {registrations.length > 0 && (
                        <div className="dash-card" style={{ marginTop: '20px' }}>
                            <h3 className="dash-card-title">Certificate Progress</h3>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
                                {[
                                    { label: '🏆 Merit', count: meritCount, total: attendedCount, color: '#d97706', bg: '#fffbeb' },
                                    { label: '🏅 Participation', count: participationCount, total: attendedCount, color: '#2563eb', bg: '#eff6ff' },
                                ].map(item => {
                                    const pct = attendedCount > 0 ? Math.round((item.count / attendedCount) * 100) : 0;
                                    return (
                                        <div key={item.label} style={{ flex: '1', minWidth: '180px', background: item.bg, borderRadius: '10px', padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: item.color }}>{item.label}</span>
                                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: item.color }}>{item.count}</span>
                                            </div>
                                            <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px' }}>
                                                <div style={{ width: `${pct}%`, height: '100%', background: item.color, borderRadius: '3px', transition: 'width 0.6s' }} />
                                            </div>
                                            <p style={{ margin: '6px 0 0', fontSize: '0.75rem', color: '#64748b' }}>{pct}% of attended events</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Recent registrations quick view */}
                    {registrations.length > 0 && (
                        <div className="dash-card" style={{ marginTop: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 className="dash-card-title">Recent Registrations</h3>
                                <button className="dash-link-btn" onClick={() => setActiveTab('myregs')}>View all →</button>
                            </div>
                            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {registrations.slice(0, 4).map(reg => (
                                    <div key={reg._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{reg.eventId.title}</p>
                                            <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                                                Registered {new Date(reg.registeredAt).toLocaleDateString('en-IN')}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <EventStatusBadge event={reg.eventId} />
                                            {reg.certificateType && reg.certificateType !== 'none' && (
                                                <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', background: reg.certificateType === 'merit' ? '#fef9c3' : '#dbeafe', color: reg.certificateType === 'merit' ? '#854d0e' : '#1e40af' }}>
                                                    {reg.certificateType === 'merit' ? '🏆 Merit' : '🏅 Participation'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {registrations.length === 0 && events.length > 0 && (
                        <div className="dash-empty-state">
                            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🎯</div>
                            <p style={{ fontWeight: 600, color: '#1e293b' }}>No registrations yet</p>
                            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Browse events and register to get started</p>
                            <button className="dash-cta-btn" onClick={() => setActiveTab('events')}>Browse Events</button>
                        </div>
                    )}
                </div>
            )}

            {/* ── EVENTS TAB ── */}
            {activeTab === 'events' && (
                <div className="dash-section">
                    {upcomingEvents.length > 0 && (
                        <>
                            <h3 className="dash-section-label dash-section-label--green">🟢 Upcoming Events</h3>
                            <div className="event-grid">
                                {upcomingEvents.map(event => (
                                    <div key={event._id} className="event-card" onClick={() => setSelectedEvent(event)}>
                                        <div className="event-card-top">
                                            <span className="event-card-dept">{event.department}</span>
                                            <EventStatusBadge event={event} />
                                        </div>
                                        <h4 className="event-card-title">{event.title}</h4>
                                        <p className="event-card-desc">{event.description.substring(0, 90)}…</p>
                                        <div className="event-card-footer">
                                            <div className="event-card-seats">
                                                <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', flex: 1 }}>
                                                    <div style={{ width: `${Math.min((event.currentRegistrations / event.maxRegistrations) * 100, 100)}%`, height: '100%', background: '#0ea5e9', borderRadius: '2px' }} />
                                                </div>
                                                <span>{event.currentRegistrations}/{event.maxRegistrations} seats</span>
                                            </div>
                                            <div onClick={e => e.stopPropagation()}>
                                                {isRegistered(event._id)
                                                    ? <button className="btn-registered" disabled>✔ Registered</button>
                                                    : <button className="btn-register" onClick={e => handleRegister(e, event._id)}>Register</button>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {endedEvents.length > 0 && (
                        <>
                            <h3 className="dash-section-label dash-section-label--red" style={{ marginTop: '28px' }}>🔴 Ended Events</h3>
                            <div className="event-grid event-grid--muted">
                                {endedEvents.map(event => (
                                    <div key={event._id} className="event-card event-card--ended" onClick={() => setSelectedEvent(event)}>
                                        <div className="event-card-top">
                                            <span className="event-card-dept">{event.department}</span>
                                            <EventStatusBadge event={event} />
                                        </div>
                                        <h4 className="event-card-title" style={{ color: '#64748b' }}>{event.title}</h4>
                                        <p className="event-card-desc" style={{ color: '#94a3b8' }}>{event.currentRegistrations} participants</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {events.length === 0 && <p style={{ color: '#94a3b8' }}>No events available right now.</p>}
                </div>
            )}

            {/* ── MY REGISTRATIONS TAB ── */}
            {activeTab === 'myregs' && (
                <div className="dash-section">
                    {registrations.length === 0 ? (
                        <div className="dash-empty-state">
                            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📋</div>
                            <p style={{ fontWeight: 600 }}>No registrations yet</p>
                        </div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Event</th>
                                    <th>Dept</th>
                                    <th>Event Status</th>
                                    <th>Reg. Status</th>
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
                                                <br /><span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Registered {new Date(reg.registeredAt).toLocaleDateString('en-IN')}</span>
                                            </td>
                                            <td><span className="tag">{reg.eventId.department}</span></td>
                                            <td><EventStatusBadge event={reg.eventId} /></td>
                                            <td><span className={`status-badge status-${reg.status}`}>{reg.status}</span></td>
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
                                                        style={{ background: isMerit ? '#d97706' : '#0ea5e9', padding: '5px 12px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                                                    >
                                                        {downloadingId === reg._id ? 'Generating…' : <>{isMerit ? '🏆' : '🏅'} {isMerit ? 'Merit' : 'Participation'}</>}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* ── PROFILE TAB ── */}
            {activeTab === 'profile' && (
                <div className="dash-section">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                        {/* Info card */}
                        <div className="dash-card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg,#0ea5e9,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.3rem' }}>
                                    {user.name?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem', color: '#1e293b' }}>{user.name}</p>
                                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>Student</p>
                                </div>
                            </div>
                            <div className="profile-info-row"><span>📧 Email</span><span>{user.email}</span></div>
                            <div className="profile-info-row"><span>🏛 Department</span><span>{user.department}</span></div>
                            <div className="profile-info-row"><span>📚 Year</span><span>Year {user.year}</span></div>
                            <div className="profile-info-row"><span>🔤 Section</span><span>Section {user.section}</span></div>
                        </div>

                        {/* Activity summary */}
                        <div className="dash-card">
                            <h3 className="dash-card-title">Activity Summary</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
                                {[
                                    { label: 'Events Registered', value: registrations.length, icon: '✅', color: '#0ea5e9' },
                                    { label: 'Events Attended', value: attendedCount, icon: '🎯', color: '#7c3aed' },
                                    { label: 'Merit Certificates', value: meritCount, icon: '🏆', color: '#d97706' },
                                    { label: 'Participation Certs', value: participationCount, icon: '🏅', color: '#2563eb' },
                                ].map(item => (
                                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', borderRadius: '8px' }}>
                                        <span style={{ fontSize: '0.88rem', color: '#475569' }}>{item.icon} {item.label}</span>
                                        <span style={{ fontWeight: 700, fontSize: '1rem', color: item.color }}>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        </div>
    );
};

export default StudentDashboard;
