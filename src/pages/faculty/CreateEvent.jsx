import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusSquare, AlertCircle, CheckCircle, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { departments } from '../../data/mockData';
import { Card } from '../../components/ui/Card';

const years = ['1st', '2nd', '3rd', '4th'];
const sections = ['A', 'B', 'C', 'D'];
const eventTypes = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Leadership'];

const defaultForm = {
    title: '', description: '', eventType: 'Technical', eventDate: '', registrationDeadline: '',
    maxParticipants: '', prizes: '', guidelines: '',
    allowedDepartments: [], allowedYears: [], allowedSections: [],
};

export const CreateEvent = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState(defaultForm);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const update = (field, val) => setForm(f => ({ ...f, [field]: val }));

    const toggleArr = (field, val) => {
        setForm(f => ({
            ...f,
            [field]: f[field].includes(val) ? f[field].filter(v => v !== val) : [...f[field], val]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || !form.eventDate || !form.registrationDeadline || !form.maxParticipants) {
            setError('Please fill all required fields.');
            return;
        }
        if (form.allowedDepartments.length === 0) {
            setError('Select at least one allowed department.');
            return;
        }
        setError('');
        setLoading(true);
        await new Promise(r => setTimeout(r, 900));
        setLoading(false);
        setSuccess(true);
        setTimeout(() => navigate('/faculty/events'), 2000);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <PlusSquare className="w-6 h-6 text-forest-900" />
                <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
            </div>

            {success ? (
                <Card className="text-center py-16">
                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900">Event Created Successfully!</h3>
                    <p className="text-gray-500 mt-2">Redirecting to your events list...</p>
                </Card>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <Card>
                        <h3 className="font-bold text-gray-900 mb-4">Basic Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Event Title *</label>
                                <input value={form.title} onChange={e => update('title', e.target.value)}
                                    placeholder="e.g. Hackathon 2025"
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/30 focus:border-forest-900" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Description *</label>
                                <textarea value={form.description} onChange={e => update('description', e.target.value)}
                                    rows={4} placeholder="Describe the event for students..."
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/30 focus:border-forest-900 resize-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Event Type *</label>
                                    <select value={form.eventType} onChange={e => update('eventType', e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/30 focus:border-forest-900">
                                        {eventTypes.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Max Participants *</label>
                                    <input type="number" value={form.maxParticipants} onChange={e => update('maxParticipants', e.target.value)}
                                        placeholder="e.g. 100"
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/30 focus:border-forest-900" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Event Date & Time *</label>
                                    <input type="datetime-local" value={form.eventDate} onChange={e => update('eventDate', e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/30 focus:border-forest-900" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Registration Deadline *</label>
                                    <input type="datetime-local" value={form.registrationDeadline} onChange={e => update('registrationDeadline', e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/30 focus:border-forest-900" />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Eligibility */}
                    <Card>
                        <h3 className="font-bold text-gray-900 mb-4">Eligibility Criteria</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-medium text-gray-700 mb-2">Allowed Departments *</p>
                                <div className="flex flex-wrap gap-2">
                                    {departments.filter(d => d !== 'Administration').map(d => (
                                        <button key={d} type="button" onClick={() => toggleArr('allowedDepartments', d)}
                                            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${form.allowedDepartments.includes(d)
                                                    ? 'bg-forest-900 border-forest-900 text-white'
                                                    : 'border-gray-200 text-gray-600 hover:border-forest-900/50'
                                                }`}>
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-700 mb-2">Allowed Years</p>
                                <div className="flex gap-2">
                                    {years.map(y => (
                                        <button key={y} type="button" onClick={() => toggleArr('allowedYears', y)}
                                            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${form.allowedYears.includes(y)
                                                    ? 'bg-blue-600 border-blue-600 text-white'
                                                    : 'border-gray-200 text-gray-600 hover:border-blue-400'
                                                }`}>
                                            {y}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-700 mb-2">Allowed Sections</p>
                                <div className="flex gap-2">
                                    {sections.map(s => (
                                        <button key={s} type="button" onClick={() => toggleArr('allowedSections', s)}
                                            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${form.allowedSections.includes(s)
                                                    ? 'bg-purple-600 border-purple-600 text-white'
                                                    : 'border-gray-200 text-gray-600 hover:border-purple-400'
                                                }`}>
                                            Section {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Prizes & Guidelines */}
                    <Card>
                        <h3 className="font-bold text-gray-900 mb-4">Prizes & Guidelines</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Prizes</label>
                                <input value={form.prizes} onChange={e => update('prizes', e.target.value)}
                                    placeholder="e.g. 1st: ₹50,000 | 2nd: ₹25,000"
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/30 focus:border-forest-900" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Guidelines / Rules</label>
                                <textarea value={form.guidelines} onChange={e => update('guidelines', e.target.value)}
                                    rows={3} placeholder="Enter any guidelines or rules for participants..."
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/30 focus:border-forest-900 resize-none" />
                            </div>
                        </div>
                    </Card>

                    {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                        </motion.div>
                    )}

                    <div className="flex gap-3 pb-4">
                        <button type="button" onClick={() => navigate(-1)}
                            className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <motion.button type="submit" disabled={loading}
                            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
                            className="flex-1 bg-forest-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-forest-800 transition-colors disabled:opacity-60">
                            {loading ? 'Creating Event...' : 'Create Event'}
                        </motion.button>
                    </div>
                </form>
            )}
        </div>
    );
};
