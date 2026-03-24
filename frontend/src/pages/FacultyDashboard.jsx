import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventModal from '../components/EventModal';

// ── Helpers ──────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────

const FacultyDashboard = () => {
    const [myEvents, setMyEvents] = useState([]);
    const [selectedEventRegs, setSelectedEventRegs] = useState([]);
    const [selectedEventForCerts, setSelectedEventForCerts] = useState(null);
    const [certAssignments, setCertAssignments] = useState({});
    const [certFilter, setCertFilter] = useState('all');   // 'all' | 'merit' | 'none'
    const [showCreate, setShowCreate] = useState(false);
    const [editId, setEditId] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '', description: '',
        department: JSON.parse(localStorage.getItem('user'))?.department || '',
        rules: '', maxRegistrations: 50, deadline: '', eventDate: '',
        yieldTags: { year: '', dept: '', section: '' }
    });
    const [successMsg, setSuccessMsg] = useState('');
    const [certSaveMsg, setCertSaveMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchMyEvents = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('http://localhost:5000/api/events', { headers: { Authorization: token } });
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = (user.id || user._id).toString();
            const sorted = res.data
                .filter(e => (e.createdBy?._id || e.createdBy).toString() === userId)
                .sort((a, b) => {
                    // Upcoming first, ended last
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
            setSuccessMsg(editId ? 'Event updated!' : 'Event created!');
            setTimeout(() => setSuccessMsg(''), 3000);
            setFormData({ title: '', description: '', department: JSON.parse(localStorage.getItem('user'))?.department || '', rules: '', maxRegistrations: 50, deadline: '', eventDate: '', yieldTags: { year: '', dept: '', section: '' } });
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
            // Default: pre-fill as 'participation' for new (unset) entries, keep existing values
            const init = {};
            res.data.forEach(r => { init[r._id] = r.certificateType || 'participation'; });
            setCertAssignments(init);
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

    // Filter by what faculty changed from default (participation → merit or → none)
    const filteredRegs = selectedEventRegs.filter(reg => {
        if (certFilter === 'merit') return certAssignments[reg._id] === 'merit';
        if (certFilter === 'none') return certAssignments[reg._id] === 'none';
        return true;
    });

    // Split events for display
    const upcomingEvents = myEvents.filter(e => getEventStatus(e) === 'upcoming');
    const endedEvents = myEvents.filter(e => getEventStatus(e) === 'ended');

    const renderEventCard = (event) => (
        <div key={event._id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelectedEvent(event)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <h4 style={{ margin: 0 }}>{event.title}</h4>
                        <EventStatusBadge event={event} />
                    </div>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>
                        {event.currentRegistrations}/{event.maxRegistrations} registered
                        {event.eventDate && ` · Event: ${new Date(event.eventDate).toLocaleDateString('en-IN')}`}
                    </p>
                </div>
                <div onClick={ev => ev.stopPropagation()} style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEdit(event)} style={{ background: '#64748b' }}>Edit</button>
                    <button onClick={ev => viewRegistrations(ev, event._id, event)}>Registrations</button>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <h1>Faculty Dashboard</h1>
            {successMsg && <div style={{ padding: '10px', background: '#dcfce7', color: '#166534', border: '1px solid #166534', borderRadius: '8px', marginBottom: '10px' }}>{successMsg}</div>}
            <button onClick={() => { setShowCreate(!showCreate); setEditId(null); }}>{showCreate ? 'Cancel' : '+ Create New Event'}</button>

            {showCreate && (
                <form onSubmit={handleSubmit} className="card" style={{ marginTop: '20px' }}>
                    <h3>{editId ? 'Edit Event' : 'Create Event'}</h3>
                    <label>Title</label>
                    <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                    <label>Description</label>
                    <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                    <label>Max Registrations</label>
                    <input type="number" value={formData.maxRegistrations} onChange={e => setFormData({ ...formData, maxRegistrations: e.target.value })} required />
                    <label>Registration Deadline</label>
                    <input type="date" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} required />
                    <label>Event Date <span style={{ color: '#94a3b8', fontWeight: 400 }}>(actual event day — unlocks certificate download)</span></label>
                    <input type="date" value={formData.eventDate} onChange={e => setFormData({ ...formData, eventDate: e.target.value })} />
                    <label>Rules</label>
                    <textarea value={formData.rules} onChange={e => setFormData({ ...formData, rules: e.target.value })} />
                    <h4>Eligibility (comma separated)</h4>
                    <label>Years</label>
                    <input type="text" placeholder="1,2" value={formData.yieldTags.year} onChange={e => setFormData({ ...formData, yieldTags: { ...formData.yieldTags, year: e.target.value } })} />
                    <label>Departments</label>
                    <input type="text" placeholder="CSE" value={formData.yieldTags.dept} onChange={e => setFormData({ ...formData, yieldTags: { ...formData.yieldTags, dept: e.target.value } })} />
                    <label>Sections</label>
                    <input type="text" placeholder="A, B" value={formData.yieldTags.section} onChange={e => setFormData({ ...formData, yieldTags: { ...formData.yieldTags, section: e.target.value } })} />
                    <button type="submit">{editId ? 'Update Event' : 'Publish Event'}</button>
                </form>
            )}

            {/* ── Upcoming Events ── */}
            {upcomingEvents.length > 0 && (
                <>
                    <h3 style={{ marginTop: '24px' }}>🟢 Upcoming Events</h3>
                    {upcomingEvents.map(renderEventCard)}
                </>
            )}

            {/* ── Ended Events ── */}
            {endedEvents.length > 0 && (
                <>
                    <h3 style={{ marginTop: '24px' }}>🔴 Ended Events <span style={{ fontWeight: 400, fontSize: '0.85rem', color: '#94a3b8' }}>— assign certificates here</span></h3>
                    {endedEvents.map(renderEventCard)}
                </>
            )}

            {myEvents.length === 0 && <p style={{ color: '#94a3b8' }}>No events created yet.</p>}

            {/* ── Certificate Assignment Panel ── */}
            {selectedEventRegs.length >= 0 && selectedEventForCerts && (
                <div style={{ marginTop: '30px', border: '2px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h3 style={{ margin: 0 }}>
                                Certificate Assignment — <em>{selectedEventForCerts.title}</em>
                                &nbsp;<EventStatusBadge event={selectedEventForCerts} />
                            </h3>
                            <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                                {getEventStatus(selectedEventForCerts) === 'ended'
                                    ? '✅ Event has ended. All students default to Participation. Promote specific students to Merit, or mark absent ones as No Cert.'
                                    : '⏳ Event is ongoing. You can pre-assign — students can download only after event ends.'}
                            </p>
                        </div>
                        <button onClick={closeRegistrations} style={{ background: '#64748b', flexShrink: 0 }}>✕ Close</button>
                    </div>

                    {/* Quick summary bar */}
                    {selectedEventRegs.length > 0 && (
                        <div style={{ display: 'flex', gap: '12px', marginTop: '14px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.82rem', background: '#f1f5f9', padding: '4px 12px', borderRadius: '20px' }}>
                                Total: <strong>{selectedEventRegs.length}</strong>
                            </span>
                            <span style={{ fontSize: '0.82rem', background: '#fef9c3', padding: '4px 12px', borderRadius: '20px' }}>
                                🏆 Merit: <strong>{Object.values(certAssignments).filter(v => v === 'merit').length}</strong>
                            </span>
                            <span style={{ fontSize: '0.82rem', background: '#dbeafe', padding: '4px 12px', borderRadius: '20px' }}>
                                🏅 Participation: <strong>{Object.values(certAssignments).filter(v => v === 'participation').length}</strong>
                            </span>
                            <span style={{ fontSize: '0.82rem', background: '#fee2e2', padding: '4px 12px', borderRadius: '20px' }}>
                                ❌ No Cert: <strong>{Object.values(certAssignments).filter(v => v === 'none').length}</strong>
                            </span>
                        </div>
                    )}

                    {certSaveMsg && (
                        <div style={{ margin: '12px 0', padding: '10px 14px', background: certSaveMsg.startsWith('✅') ? '#dcfce7' : '#fef9c3', color: certSaveMsg.startsWith('✅') ? '#166534' : '#854d0e', borderRadius: '8px', fontWeight: 600 }}>
                            {certSaveMsg}
                        </div>
                    )}

                    {/* Filter bar */}
                    <div style={{ display: 'flex', gap: '8px', margin: '16px 0 12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Filter:</span>
                        {[
                            { key: 'all', label: 'All Students' },
                            { key: 'merit', label: '🏆 Merit Assigned' },
                            { key: 'none', label: '❌ Absent Marked' },
                        ].map(opt => (
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
                                    <th>Saved Cert</th>
                                    <th>Assign <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.78rem' }}>(default: Participation)</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRegs.map((reg, idx) => (
                                    <tr key={reg._id} style={{ background: certAssignments[reg._id] === 'merit' ? '#fffbeb' : certAssignments[reg._id] === 'none' ? '#fff5f5' : 'transparent' }}>
                                        <td style={{ color: '#94a3b8' }}>{idx + 1}</td>
                                        <td>
                                            <strong>{reg.studentId.name}</strong>
                                            <br /><span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{reg.studentId.email}</span>
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
                            <button onClick={saveCertAssignments} disabled={loading} style={{ background: '#059669' }}>
                                {loading ? 'Saving…' : '💾 Save Assignments'}
                            </button>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                Tip: All students default to 🏅 Participation — only change if needed.
                            </span>
                        </div>
                    )}
                </div>
            )}

            <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        </div>
    );
};

export default FacultyDashboard;
