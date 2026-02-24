import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Save, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

const roleBadgeMap = { student: 'green', faculty: 'yellow', admin: 'red' };

export const ProfilePage = () => {
    const { user } = useAuth();
    const isStudent = user?.role === 'student';
    const isFaculty = user?.role === 'faculty';

    const [form, setForm] = useState({
        fullName: user?.name || '',
        mobile: user?.mobile || '',
        age: user?.age || '',
        gender: user?.gender || '',
    });
    const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
    const [saved, setSaved] = useState(false);
    const [pwSaved, setPwSaved] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        await new Promise(r => setTimeout(r, 600));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        await new Promise(r => setTimeout(r, 600));
        setPwSaved(true);
        setPasswords({ current: '', newPass: '', confirm: '' });
        setTimeout(() => setPwSaved(false), 3000);
    };

    const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-forest-900" />
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Summary Card */}
                <div className="lg:col-span-1">
                    <Card className="text-center">
                        <div className="w-20 h-20 rounded-full bg-forest-900 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                            {initials}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                        <div className="mt-2 mb-4">
                            <Badge variant={roleBadgeMap[user?.role] || 'blue'}>{user?.role}</Badge>
                        </div>
                        <div className="text-left space-y-3 border-t border-gray-100 pt-4">
                            {[
                                { label: 'Email', value: user?.email },
                                { label: 'Department', value: user?.department },
                                isStudent && { label: 'Year', value: user?.year },
                                isStudent && { label: 'Section', value: user?.section },
                                isStudent && { label: 'Student ID', value: user?.studentId },
                                isFaculty && { label: 'Faculty ID', value: user?.facultyId },
                                { label: 'Member Since', value: user?.joinedDate ? new Date(user.joinedDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '-' },
                            ].filter(Boolean).map(item => (
                                <div key={item.label}>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{item.label}</p>
                                    <p className="text-sm font-semibold text-gray-800">{item.value || '-'}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Editable Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                            <User className="w-4 h-4" /> Personal Information
                        </h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        value={form.fullName}
                                        onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/30 focus:border-forest-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Mobile Number</label>
                                    <input
                                        value={form.mobile}
                                        onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/30 focus:border-forest-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Age</label>
                                    <input
                                        type="number"
                                        value={form.age}
                                        onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/30 focus:border-forest-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                                    <select
                                        value={form.gender}
                                        onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/30 focus:border-forest-900"
                                    >
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>
                            {/* Read-only fields */}
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                                <div>
                                    <p className="text-xs font-medium text-gray-400 mb-0.5">Email (read-only)</p>
                                    <p className="text-sm text-gray-700">{user?.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400 mb-0.5">Department (read-only)</p>
                                    <p className="text-sm text-gray-700">{user?.department}</p>
                                </div>
                            </div>
                            {saved && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-emerald-600 text-sm bg-emerald-50 px-4 py-2 rounded-xl">
                                    <CheckCircle className="w-4 h-4" /> Changes saved successfully!
                                </motion.div>
                            )}
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.97 }}
                                className="flex items-center gap-2 bg-forest-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-forest-800 transition-colors"
                            >
                                <Save className="w-4 h-4" /> Save Changes
                            </motion.button>
                        </form>
                    </Card>

                    {/* Change Password */}
                    <Card>
                        <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                            <Lock className="w-4 h-4" /> Change Password
                        </h3>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { label: 'Current Password', key: 'current', placeholder: 'Enter current password' },
                                    { label: 'New Password', key: 'newPass', placeholder: 'Min 6 characters' },
                                    { label: 'Confirm New Password', key: 'confirm', placeholder: 'Repeat new password' },
                                ].map(field => (
                                    <div key={field.key}>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">{field.label}</label>
                                        <input
                                            type="password"
                                            value={passwords[field.key]}
                                            onChange={e => setPasswords(p => ({ ...p, [field.key]: e.target.value }))}
                                            placeholder={field.placeholder}
                                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/30 focus:border-forest-900"
                                        />
                                    </div>
                                ))}
                            </div>
                            {pwSaved && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-emerald-600 text-sm bg-emerald-50 px-4 py-2 rounded-xl">
                                    <CheckCircle className="w-4 h-4" /> Password updated successfully!
                                </motion.div>
                            )}
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.97 }}
                                className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
                            >
                                <Lock className="w-4 h-4" /> Update Password
                            </motion.button>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};
