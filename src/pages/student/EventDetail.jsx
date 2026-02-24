import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, ChevronRight, Award, CheckCircle, AlertTriangle, Download } from 'lucide-react';
import { events, registrations } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import toast from 'react-hot-toast';

const statusColor = {
    Upcoming: 'green',
    Closed: 'yellow',
    Completed: 'purple',
    Cancelled: 'red',
};

export const EventDetail = () => {
    const { eventId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const event = events.find(e => e.id === eventId);

    const [myRegistration, setMyRegistration] = useState(
        registrations.find(r => r.studentId === user?.id && r.eventId === eventId) || null
    );
    const [loading, setLoading] = useState(false);
    const [dialog, setDialog] = useState(null); // 'register' | 'cancel' | null

    if (!event) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <AlertTriangle className="w-16 h-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-bold text-gray-700">Event Not Found</h2>
                <Link to="/student/events" className="mt-4 text-forest-900 font-semibold hover:underline">Back to Browse Events</Link>
            </div>
        );
    }

    const isFull = event.currentParticipants >= event.maxParticipants;
    const deadlinePassed = new Date(event.registrationDeadline) < new Date();
    const canRegister = !myRegistration && !isFull && !deadlinePassed && event.status === 'Upcoming';
    const canCancel = myRegistration && !deadlinePassed && myRegistration.attendanceStatus === 'Registered';

    const handleRegister = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 700));
        setMyRegistration({ id: 'r_new', studentId: user.id, eventId, registrationDate: new Date().toISOString(), attendanceStatus: 'Registered', score: null, certificateIssued: false });
        setDialog(null);
        setLoading(false);
        toast.success(`🎉 Registered for "${event.title}" successfully!`);
    };

    const handleCancel = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 700));
        setMyRegistration(null);
        setDialog(null);
        setLoading(false);
        toast('Registration cancelled.', { icon: '↩️' });
    };

    return (
        <div className="max-w-5xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Link to="/student/dashboard" className="hover:text-forest-900">Dashboard</Link>
                <ChevronRight className="w-4 h-4" />
                <Link to="/student/events" className="hover:text-forest-900">Browse Events</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium truncate">{event.title}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column - event info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
                            <Badge variant={statusColor[event.status]}>{event.status}</Badge>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-6">{event.description}</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                                <Calendar className="w-4 h-4 text-forest-900" />
                                <div>
                                    <p className="text-xs text-gray-500">Event Date</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {new Date(event.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                                <Clock className="w-4 h-4 text-orange-500" />
                                <div>
                                    <p className="text-xs text-gray-500">Registration Deadline</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {new Date(event.registrationDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                                <MapPin className="w-4 h-4 text-blue-500" />
                                <div>
                                    <p className="text-xs text-gray-500">Department</p>
                                    <p className="text-sm font-semibold text-gray-900">{event.department}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                                <Users className="w-4 h-4 text-purple-500" />
                                <div>
                                    <p className="text-xs text-gray-500">Participants</p>
                                    <p className="text-sm font-semibold text-gray-900">{event.currentParticipants} / {event.maxParticipants}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {event.prizes && (
                        <Card>
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Award className="w-5 h-5 text-yellow-500" /> Prizes
                            </h3>
                            <p className="text-gray-600 text-sm">{event.prizes}</p>
                        </Card>
                    )}

                    {event.guidelines && (
                        <Card>
                            <h3 className="font-bold text-gray-900 mb-3">Guidelines</h3>
                            <p className="text-gray-600 text-sm whitespace-pre-line">{event.guidelines}</p>
                        </Card>
                    )}

                    <Card>
                        <h3 className="font-bold text-gray-900 mb-3">Eligibility</h3>
                        <div className="space-y-2">
                            <div>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Departments</span>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                    {event.allowedDepartments.map(d => (
                                        <span key={d} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg font-medium">{d}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Years</span>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                    {event.allowedYears.map(y => (
                                        <span key={y} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg font-medium">{y}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Sections</span>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                    {event.allowedSections.map(s => (
                                        <span key={s} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-lg font-medium">Section {s}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right column - registration panel */}
                <div className="space-y-4">
                    <Card className="sticky top-24">
                        <h3 className="font-bold text-gray-900 mb-4">Registration</h3>

                        {/* Capacity Bar */}
                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-500">Registered</span>
                                <span className="font-semibold text-gray-900">{event.currentParticipants}/{event.maxParticipants}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                    className="bg-forest-900 rounded-full h-2 transition-all"
                                    style={{ width: `${Math.min((event.currentParticipants / event.maxParticipants) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* My registration status */}
                        {myRegistration?.attendanceStatus === 'Attended' && (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4">
                                <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm mb-1">
                                    <CheckCircle className="w-4 h-4" /> You Attended
                                </div>
                                {myRegistration.score !== null && (
                                    <p className="text-sm text-emerald-600">Score: <strong>{myRegistration.score}</strong></p>
                                )}
                                {myRegistration.certificateIssued && (
                                    <button className="mt-2 flex items-center gap-1.5 text-xs text-white bg-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors">
                                        <Download className="w-3 h-3" /> Download Certificate
                                    </button>
                                )}
                            </div>
                        )}

                        {myRegistration && myRegistration.attendanceStatus === 'Registered' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 text-sm text-blue-700 font-medium">
                                ✓ You are registered for this event
                            </div>
                        )}

                        {canRegister && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setDialog('register')}
                                className="w-full bg-forest-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-forest-800 transition-colors"
                            >
                                Register Now
                            </motion.button>
                        )}

                        {canCancel && (
                            <button
                                onClick={() => setDialog('cancel')}
                                className="w-full border border-red-300 text-red-600 py-3 rounded-xl font-semibold text-sm hover:bg-red-50 transition-colors"
                            >
                                Cancel Registration
                            </button>
                        )}

                        {!canRegister && !canCancel && !myRegistration && (
                            <div className="text-center text-sm text-gray-500 py-3 bg-gray-50 rounded-xl">
                                {isFull ? 'Event is full' : deadlinePassed ? 'Registration deadline passed' : 'Registration closed'}
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            {/* Dialog modal */}
            {dialog && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl"
                    >
                        <h3 className="font-bold text-gray-900 text-lg mb-2">
                            {dialog === 'register' ? 'Confirm Registration' : 'Cancel Registration'}
                        </h3>
                        <p className="text-gray-600 text-sm mb-6">
                            {dialog === 'register'
                                ? `Confirm registration for "${event.title}"?`
                                : `Are you sure you want to cancel your registration for "${event.title}"?`}
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDialog(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
                                Go Back
                            </button>
                            <button
                                disabled={loading}
                                onClick={dialog === 'register' ? handleRegister : handleCancel}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors ${dialog === 'register' ? 'bg-forest-900 hover:bg-forest-800' : 'bg-red-600 hover:bg-red-700'
                                    }`}
                            >
                                {loading ? 'Processing...' : dialog === 'register' ? 'Confirm' : 'Yes, Cancel'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};
