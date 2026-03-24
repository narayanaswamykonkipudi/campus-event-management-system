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

const CERT_OPTIONS = [
    { value: 'participation', label: '🏅 Participation' },
    { value: 'merit', label: '🏆 Merit' },
    { value: 'none', label: '❌ Absent / No Cert' },
];

const certBadge = (type) => {
    const map = {
        participation: { bg: '#dbeafe', color: '#1e40af', label: '🏅 Participation' },
        merit: { bg: '#fef9c3', color: '#854d0e', label: '🏆 Merit' },
        none: { bg: '#fee2e2', color: '#991b1b', label: '❌ Absent' },
    };
    const s = map[type];
    if (!s) return <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>—</span>;
    return <span style={{ background: s.bg, color: s.color, padding: '2px 8px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700 }}>{s.label}</span>;
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

const FacultyDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user')) || {};

    const [myEvents, setMyEvents] = useState([]);
    const [selectedEventRegs, setSelectedEventRegs] = useState([]);
    const [selectedEventForCerts, setSelectedEventForCerts] = useState(null);
    const [certAssignments, setCertAssignments] = useState({});
    const [certFilter, setCertFilter] = useState('all');
    const [showCreate, setShowCreate] = useState(false);
    const [editId, setEditId] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '', description: '',
        department: user.department || '',
        rules: '', maxRegistrations: 50, deadline: '', eventDate: '',
        yieldTags: { year: '', dept: '', section: '' }
    });
    const [successMsg, setSuccessMsg] = useState('');
    const [certSaveMsg, setCertSaveMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    const fetchMyEvents = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('http://localhost:5000/api/events', { headers: { Authorization: token } });
            const userId = (user.id || user._id).toString();
            const sorted = res.data
                .filter(e => (e.createdBy?._id || e.createdBy).toString() === userId)
                .sort((a, b) => {
                    const aEnded = getEventStatus(a) === 'ended';
                    const bEnded = getEventStatus(b) === 'ended';
                    return aEnded === bEnded ? 0 : aEnded ? 1 : -1;
                });
            setMyEvents(sorted);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchMyEvents(); }, []);

    const handleEdit = (event) => {
        setEditId(event._id);
        setFormData({
            title: event.title, description: event.description, department: event.department,
            rules: event.rules || '', maxRegistrations: event.maxRegistrations,
            deadline: event.deadline.split('T')[0],
            eventDate: event.eventDate ? event.eventDate.split('T')[0] : '',
            yieldTags: {
                year: event.eligibleTags?.year?.join(',') || '',
                dept: event.eligibleTags?.department?.join(',') || '',
                section: event.eligibleTags?.section?.join(',') || ''
            }
        });
        setShowCreate(true);
        setActiveTab('events');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const payload = {
            ...formData,
            eligibleTags: {
                year: formData.yieldTags.year.split(',').map(Number).filter(v => !isNaN(v) && v !== 0),
                department: formData.yieldTags.dept.split(',').map(v => v.trim()).filter(v => v),
                section: formData.yieldTags.section.split(',').map(v => v.trim()).filter(v => v)
            }
        };
        try {
            if (editId) {
                await axios.put(`http://localhost:5000/api/events/${editId}`, payload, { headers: { Authorization: token } });
            } else {
                await axios.post('http://localhost:5000/api/events', payload, { headers: { Authorization: token } });
            }
            setShowCreate(false); setEditId(null);
            setSuccessMsg(editId ? '✅ Event updated!' : '✅ Event published!');
            setTimeout(() => setSuccessMsg(''), 3000);
            setFormData({ title: '', description: '', department: user.department || '', rules: '', maxRegistrations: 50, deadline: '', eventDate: '', yieldTags: { year: '', dept: '', section: '' } });
            fetchMyEvents();
        } catch (err) { alert(err.response?.data?.message || 'Failed to save event'); }
    };

    const viewRegistrations = async (e, eventId, event) => {
        e.stopPropagation();
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(`http://localhost:5000/api/registrations/event/${eventId}`, { headers: { Authorization: token } });
            setSelectedEventRegs(res.data);
            setSelectedEventForCerts(event);
            setCertFilter('all');
            const init = {};
            res.data.forEach(r => { init[r._id] = r.certificateType || 'participation'; });
            setCertAssignments(init);
            setActiveTab('certs');
        } catch (err) { console.error(err); }
    };

    const handleCertChange = (regId, value) => {
        setCertAssignments(prev => ({ ...prev, [regId]: value }));
    };

    const saveCertAssignments = async () => {
        const token = localStorage.getItem('token');
        const assignments = Object.entries(certAssignments).map(([registrationId, certificateType]) => ({ registrationId, certificateType }));
        setLoading(true);
        try {
            await axios.patch(
                `http://localhost:5000/api/registrations/event/${selectedEventForCerts._id}/assign-certs`,
                { assignments },
                { headers: { Authorization: token } }
            );
            setCertSaveMsg('✅ Certificate assignments saved!');
            const res = await axios.get(`http://localhost:5000/api/registrations/event/${selectedEventForCerts._id}`, { headers: { Authorization: token } });
            setSelectedEventRegs(res.data);
            const updated = {};
            res.data.forEach(r => { updated[r._id] = r.certificateType || 'participation'; });
            setCertAssignments(updated);
        } catch (err) {
            setCertSaveMsg('❌ ' + (err.response?.data?.message || 'Failed to save.'));
        } finally {
            setLoading(false);
            setTimeout(() => setCertSaveMsg(''), 4000);
        }
    };

    const closeRegistrations = () => {
        setSelectedEventRegs([]); setSelectedEventForCerts(null);
        setCertAssignments({}); setCertSaveMsg(''); setCertFilter('all');
    };

    const filteredRegs = selectedEventRegs.filter(reg => {
        if (certFilter === 'merit') return certAssignments[reg._id] === 'merit';
        if (certFilter === 'none') return certAssignments[reg._id] === 'none';
        return true;
    });

    // Derived stats
    const upcomingEvents = myEvents.filter(e => getEventStatus(e) === 'upcoming');
    const endedEvents = myEvents.filter(e => getEventStatus(e) === 'ended');
    const totalRegs = myEvents.reduce((sum, e) => sum + (e.currentRegistrations || 0), 0);
    const totalCap = myEvents.reduce((sum, e) => sum + (e.maxRegistrations || 0), 0);
    const occupancy = totalCap > 0 ? Math.round((totalRegs / totalCap) * 100) : 0;

    const tabs = [
        { key: 'overview', icon: '🏠', label: 'Overview' },
        { key: 'events', icon: '📅', label: `My Events (${myEvents.length})` },
        { key: 'certs', icon: '🎓', label: 'Certificates' },
        { key: 'profile', icon: '👤', label: 'Profile' },
    ];

    const renderEventCard = (event) => (
        <div key={event._id} className="event-card fac-event-card" onClick={() => setSelectedEvent(event)}>
            <div className="event-card-top">
                <span className="event-card-dept">{event.department}</span>
                <EventStatusBadge event={event} />
            </div>
            <h4 className="event-card-title">{event.title}</h4>
            <div style={{ marginTop: '6px', marginBottom: '2px' }}>
                <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px' }}>
                    <div style={{ width: `${Math.min((event.currentRegistrations / event.maxRegistrations) * 100, 100)}%`, height: '100%', background: getEventStatus(event) === 'ended' ? '#94a3b8' : '#0ea5e9', borderRadius: '2px' }} />
                </div>
            </div>
            <p className="event-card-desc">{event.currentRegistrations}/{event.maxRegistrations} registered{event.eventDate && ` · ${new Date(event.eventDate).toLocaleDateString('en-IN')}`}</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }} onClick={ev => ev.stopPropagation()}>
                <button onClick={() => handleEdit(event)} style={{ background: '#64748b', padding: '5px 12px', fontSize: '0.8rem' }}>Edit</button>
                <button onClick={ev => viewRegistrations(ev, event._id, event)} style={{ padding: '5px 12px', fontSize: '0.8rem' }}>Manage Certs</button>
            </div>
        </div>
    );

    return (
        <div className="dash-page">
            {/* Page header */}
            <div className="dash-page-header">
                <div>
                    <h1 className="dash-page-title">Faculty Dashboard</h1>
                    <p className="dash-page-sub">Hello, <strong>{user.name}</strong> · {user.department}</p>
                </div>
                <button
                    onClick={() => { setShowCreate(!showCreate); setEditId(null); setActiveTab('events'); }}
                    style={{ background: '#0ea5e9', color: '#fff', padding: '9px 20px', fontWeight: 700, fontSize: '0.9rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                >
                    {showCreate ? '✕ Cancel' : '+ New Event'}
                </button>
            </div>

            <DashTab tabs={tabs} active={activeTab} onChange={setActiveTab} />

            {successMsg && <div className="dash-alert dash-alert--success">{successMsg}</div>}

            {/* ── OVERVIEW ── */}
            {activeTab === 'overview' && (
                <div className="dash-section">
                    <div className="dash-stats-row">
                        <StatCard icon="📅" label="Total Events" value={myEvents.length} sub={`${upcomingEvents.length} upcoming · ${endedEvents.length} ended`} color="#0ea5e9" />
                        <StatCard icon="👥" label="Total Registrations" value={totalRegs} sub={`across all events`} color="#7c3aed" />
                        <StatCard icon="📊" label="Seat Occupancy" value={`${occupancy}%`} sub={`${totalRegs}/${totalCap} seats filled`} color="#059669" />
                        <StatCard icon="🔴" label="Ended Events" value={endedEvents.length} sub="ready for cert assignment" color="#dc2626" />
                    </div>

                    {/* Occupancy bar */}
                    {totalCap > 0 && (
                        <div className="dash-card" style={{ marginTop: '20px' }}>
                            <h3 className="dash-card-title">Overall Seat Occupancy</h3>
                            <div style={{ marginTop: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Seats filled</span>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0ea5e9' }}>{occupancy}%</span>
                                </div>
                                <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '5px' }}>
                                    <div style={{ width: `${occupancy}%`, height: '100%', background: 'linear-gradient(90deg,#0ea5e9,#7c3aed)', borderRadius: '5px', transition: 'width 0.6s' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Ended events needing cert attention */}
                    {endedEvents.length > 0 && (
                        <div className="dash-card" style={{ marginTop: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 className="dash-card-title">⚠ Ended Events — Action Needed</h3>
                                <button className="dash-link-btn" onClick={() => setActiveTab('certs')}>Go to Certs →</button>
                            </div>
                            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {endedEvents.map(e => (
                                    <div key={e._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#fff7ed', borderRadius: '8px', border: '1px solid #fed7aa' }}>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{e.title}</p>
                                            <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>{e.currentRegistrations} participants</p>
                                        </div>
                                        <button onClick={ev => viewRegistrations(ev, e._id, e)} style={{ padding: '5px 12px', fontSize: '0.8rem', background: '#d97706' }}>
                                            Assign Certs
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {myEvents.length === 0 && (
                        <div className="dash-empty-state">
                            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📅</div>
                            <p style={{ fontWeight: 600, color: '#1e293b' }}>No events yet</p>
                            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Create your first event to get started</p>
                            <button className="dash-cta-btn" onClick={() => { setShowCreate(true); setActiveTab('events'); }}>+ Create Event</button>
                        </div>
                    )}
                </div>
            )}

            {/* ── MY EVENTS TAB ── */}
            {activeTab === 'events' && (
                <div className="dash-section">
                    {/* Create / Edit form */}
                    {showCreate && (
                        <div className="dash-card" style={{ marginBottom: '24px', border: '2px solid #0ea5e9' }}>
                            <h3 className="dash-card-title" style={{ marginBottom: '16px' }}>{editId ? '✏ Edit Event' : '+ Create New Event'}</h3>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div className="form-field">
                                        <label>Title</label>
                                        <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                    </div>
                                    <div className="form-field">
                                        <label>Max Registrations</label>
                                        <input type="number" value={formData.maxRegistrations} onChange={e => setFormData({ ...formData, maxRegistrations: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="form-field">
                                    <label>Description</label>
                                    <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required rows={3} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div className="form-field">
                                        <label>Registration Deadline</label>
                                        <input type="date" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} required />
                                    </div>
                                    <div className="form-field">
                                        <label>Event Date</label>
                                        <input type="date" value={formData.eventDate} onChange={e => setFormData({ ...formData, eventDate: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-field">
                                    <label>Rules <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.8rem' }}>(optional)</span></label>
                                    <textarea value={formData.rules} onChange={e => setFormData({ ...formData, rules: e.target.value })} rows={2} />
                                </div>
                                <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px', border: '1px solid #e2e8f0' }}>
                                    <p style={{ margin: '0 0 10px', fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>Eligibility Filters <span style={{ fontWeight: 400 }}>(comma-separated, leave blank for all)</span></p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                                        <div className="form-field">
                                            <label>Years</label>
                                            <input type="text" placeholder="1,2" value={formData.yieldTags.year} onChange={e => setFormData({ ...formData, yieldTags: { ...formData.yieldTags, year: e.target.value } })} />
                                        </div>
                                        <div className="form-field">
                                            <label>Departments</label>
                                            <input type="text" placeholder="CSE,AIML" value={formData.yieldTags.dept} onChange={e => setFormData({ ...formData, yieldTags: { ...formData.yieldTags, dept: e.target.value } })} />
                                        </div>
                                        <div className="form-field">
                                            <label>Sections</label>
                                            <input type="text" placeholder="A,B" value={formData.yieldTags.section} onChange={e => setFormData({ ...formData, yieldTags: { ...formData.yieldTags, section: e.target.value } })} />
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button type="submit" style={{ background: '#059669', padding: '9px 20px' }}>{editId ? 'Update Event' : 'Publish Event'}</button>
                                    <button type="button" onClick={() => { setShowCreate(false); setEditId(null); }} style={{ background: '#64748b', padding: '9px 20px' }}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {upcomingEvents.length > 0 && (
                        <>
                            <h3 className="dash-section-label dash-section-label--green">🟢 Upcoming Events</h3>
                            <div className="event-grid">{upcomingEvents.map(renderEventCard)}</div>
                        </>
                    )}

                    {endedEvents.length > 0 && (
                        <>
                            <h3 className="dash-section-label dash-section-label--red" style={{ marginTop: '24px' }}>🔴 Ended Events <span style={{ fontWeight: 400, fontSize: '0.82rem', color: '#94a3b8' }}>— assign certificates</span></h3>
                            <div className="event-grid">{endedEvents.map(renderEventCard)}</div>
                        </>
                    )}

                    {myEvents.length === 0 && !showCreate && (
                        <div className="dash-empty-state">
                            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📅</div>
                            <p style={{ fontWeight: 600 }}>No events yet</p>
                            <button className="dash-cta-btn" onClick={() => setShowCreate(true)}>+ Create your first event</button>
                        </div>
                    )}
                </div>
            )}

            {/* ── CERTIFICATES TAB ── */}
            {activeTab === 'certs' && (
                <div className="dash-section">
                    {!selectedEventForCerts ? (
                        <div>
                            <p style={{ color: '#64748b', marginBottom: '16px', fontSize: '0.9rem' }}>Select an ended event to assign certificates to participants.</p>
                            {endedEvents.length === 0 ? (
                                <div className="dash-empty-state">
                                    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🎓</div>
                                    <p style={{ fontWeight: 600 }}>No ended events yet</p>
                                    <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Once an event ends, you can assign certificates here</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {endedEvents.map(e => (
                                        <div key={e._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                                            <div>
                                                <p style={{ margin: 0, fontWeight: 600, color: '#1e293b' }}>{e.title}</p>
                                                <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>{e.department} · {e.currentRegistrations} participants</p>
                                            </div>
                                            <button onClick={ev => viewRegistrations(ev, e._id, e)} style={{ padding: '7px 16px', fontSize: '0.85rem' }}>
                                                🎓 Assign Certs
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            {/* Panel header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>
                                        {selectedEventForCerts.title} &nbsp;<EventStatusBadge event={selectedEventForCerts} />
                                    </h3>
                                    <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                                        {getEventStatus(selectedEventForCerts) === 'ended'
                                            ? 'All students default to Participation. Promote to Merit or mark absent as needed.'
                                            : '⏳ Event ongoing — pre-assign certs if you want.'}
                                    </p>
                                </div>
                                <button onClick={closeRegistrations} style={{ background: '#64748b', padding: '7px 14px', fontSize: '0.85rem' }}>← Back</button>
                            </div>

                            {/* Summary chips */}
                            {selectedEventRegs.length > 0 && (
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                    {[
                                        { label: `Total: ${selectedEventRegs.length}`, bg: '#f1f5f9', color: '#475569' },
                                        { label: `🏆 Merit: ${Object.values(certAssignments).filter(v => v === 'merit').length}`, bg: '#fef9c3', color: '#854d0e' },
                                        { label: `🏅 Participation: ${Object.values(certAssignments).filter(v => v === 'participation').length}`, bg: '#dbeafe', color: '#1e40af' },
                                        { label: `❌ Absent: ${Object.values(certAssignments).filter(v => v === 'none').length}`, bg: '#fee2e2', color: '#991b1b' },
                                    ].map(chip => (
                                        <span key={chip.label} style={{ background: chip.bg, color: chip.color, padding: '4px 12px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600 }}>{chip.label}</span>
                                    ))}
                                </div>
                            )}

                            {certSaveMsg && (
                                <div className={`dash-alert ${certSaveMsg.startsWith('✅') ? 'dash-alert--success' : 'dash-alert--error'}`} style={{ marginBottom: '12px' }}>
                                    {certSaveMsg}
                                </div>
                            )}

                            {/* Filter */}
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Filter:</span>
                                {[{ key: 'all', label: 'All Students' }, { key: 'merit', label: '🏆 Merit' }, { key: 'none', label: '❌ Absent' }].map(opt => (
                                    <button key={opt.key} onClick={() => setCertFilter(opt.key)}
                                        style={{ background: certFilter === opt.key ? '#0ea5e9' : '#f1f5f9', color: certFilter === opt.key ? '#fff' : '#475569', padding: '4px 12px', fontSize: '0.8rem' }}>
                                        {opt.label}
                                    </button>
                                ))}
                            </div>

                            {selectedEventRegs.length === 0 ? (
                                <p style={{ color: '#94a3b8' }}>No students have registered for this event.</p>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Student</th>
                                            <th>Dept / Year</th>
                                            <th>Status</th>
                                            <th>Saved</th>
                                            <th>Assign <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.75rem' }}>(default: Participation)</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRegs.map((reg, idx) => (
                                            <tr key={reg._id} style={{ background: certAssignments[reg._id] === 'merit' ? '#fffbeb' : certAssignments[reg._id] === 'none' ? '#fff5f5' : 'transparent' }}>
                                                <td style={{ color: '#94a3b8' }}>{idx + 1}</td>
                                                <td>
                                                    <strong>{reg.studentId.name}</strong>
                                                    <br /><span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{reg.studentId.email}</span>
                                                </td>
                                                <td>{reg.studentId.department} / Yr {reg.studentId.year}</td>
                                                <td><span className={`status-badge status-${reg.status}`}>{reg.status}</span></td>
                                                <td>{certBadge(reg.certificateType)}</td>
                                                <td>
                                                    <select
                                                        value={certAssignments[reg._id] ?? 'participation'}
                                                        onChange={e => handleCertChange(reg._id, e.target.value)}
                                                        style={{ margin: 0, padding: '5px 8px', width: 'auto', fontSize: '0.85rem', borderColor: certAssignments[reg._id] === 'merit' ? '#d4a429' : certAssignments[reg._id] === 'none' ? '#ef4444' : '#cbd5e1' }}
                                                    >
                                                        {CERT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            {selectedEventRegs.length > 0 && (
                                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                                    <button onClick={saveCertAssignments} disabled={loading} style={{ background: '#059669', padding: '9px 20px' }}>
                                        {loading ? 'Saving…' : '💾 Save Assignments'}
                                    </button>
                                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Tip: Only change from Participation if needed.</span>
                                </div>
                            )}
                        </div>
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
                                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg,#059669,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.3rem' }}>
                                    {user.name?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem', color: '#1e293b' }}>{user.name}</p>
                                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>Faculty</p>
                                </div>
                            </div>
                            <div className="profile-info-row"><span>📧 Email</span><span>{user.email}</span></div>
                            <div className="profile-info-row"><span>🏛 Department</span><span>{user.department}</span></div>
                            {user.collegeId && <div className="profile-info-row"><span>🪪 Employee Code</span><span>{user.collegeId}</span></div>}
                        </div>

                        {/* Performance card */}
                        <div className="dash-card">
                            <h3 className="dash-card-title">Event Performance</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
                                {[
                                    { label: 'Events Created', value: myEvents.length, icon: '📅', color: '#0ea5e9' },
                                    { label: 'Total Participants', value: totalRegs, icon: '👥', color: '#7c3aed' },
                                    { label: 'Upcoming Events', value: upcomingEvents.length, icon: '🟢', color: '#059669' },
                                    { label: 'Ended Events', value: endedEvents.length, icon: '🔴', color: '#dc2626' },
                                    { label: 'Avg Participation', value: myEvents.length > 0 ? Math.round(totalRegs / myEvents.length) : 0, icon: '📊', color: '#d97706', sub: 'per event' },
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

export default FacultyDashboard;
