import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { departments } from '../../data/mockData';

export const RegisterPage = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('student');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        fullName: '', email: '', password: '', confirmPassword: '',
        mobile: '', age: '', gender: '', department: '',
        year: '', section: '', studentId: '', facultyId: ''
    });

    const update = (field, val) => setForm(f => ({ ...f, [field]: val }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.fullName || !form.email || !form.password || !form.confirmPassword || !form.department) {
            setError('Please fill in all required fields.');
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setError('');
        setLoading(true);
        await new Promise(r => setTimeout(r, 800));
        setLoading(false);
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-xl">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-3xl shadow-xl p-8"
                >
                    <div className="flex flex-col items-center mb-8">
                        <div className="bg-forest-900 p-3 rounded-2xl mb-3">
                            <Rocket className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
                        <p className="text-gray-500 text-sm mt-1">Join Campus Event Management System</p>
                    </div>

                    {/* Role Selector */}
                    <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
                        {['student', 'faculty'].map(r => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setRole(r)}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all capitalize ${role === r
                                        ? 'bg-white shadow text-forest-900'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                I am a {r === 'student' ? 'Student' : 'Faculty'}
                            </button>
                        ))}
                    </div>

                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8"
                        >
                            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900">Registration Successful!</h3>
                            <p className="text-gray-500 mt-2">Redirecting you to login...</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Common Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                                    <input
                                        value={form.fullName}
                                        onChange={e => update('fullName', e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/30 focus:border-forest-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={e => update('email', e.target.value)}
                                        placeholder="you@college.edu"
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/30 focus:border-forest-900"
                                    />
                                </div>
                                <div className="relative">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Password *</label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={form.password}
                                        onChange={e => update('password', e.target.value)}
                                        placeholder="Min 6 characters"
                                        className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/30 focus:border-forest-900"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 bottom-3 text-gray-400">
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Confirm Password *</label>
                                    <input
                                        type="password"
                                        value={form.confirmPassword}
                                        onChange={e => update('confirmPassword', e.target.value)}
                                        placeholder="Repeat password"
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/30 focus:border-forest-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Mobile Number</label>
                                    <input
                                        value={form.mobile}
                                        onChange={e => update('mobile', e.target.value)}
                                        placeholder="10-digit number"
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/30 focus:border-forest-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Age</label>
                                    <input
                                        type="number"
                                        value={form.age}
                                        onChange={e => update('age', e.target.value)}
                                        placeholder="Your age"
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/30 focus:border-forest-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                                    <select
                                        value={form.gender}
                                        onChange={e => update('gender', e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/30 focus:border-forest-900"
                                    >
                                        <option value="">Select</option>
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Department *</label>
                                    <select
                                        value={form.department}
                                        onChange={e => update('department', e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/30 focus:border-forest-900"
                                    >
                                        <option value="">Select Department</option>
                                        {departments.filter(d => d !== 'Administration').map(d => (
                                            <option key={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Student-specific fields */}
                            {role === 'student' && (
                                <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Year / Batch *</label>
                                        <select
                                            value={form.year}
                                            onChange={e => update('year', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/30"
                                        >
                                            <option value="">Select</option>
                                            {['1st', '2nd', '3rd', '4th'].map(y => <option key={y}>{y}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Section</label>
                                        <select
                                            value={form.section}
                                            onChange={e => update('section', e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/30"
                                        >
                                            <option value="">Select</option>
                                            {['A', 'B', 'C', 'D'].map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Student ID *</label>
                                        <input
                                            value={form.studentId}
                                            onChange={e => update('studentId', e.target.value)}
                                            placeholder="CS2024001"
                                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/30"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Faculty-specific fields */}
                            {role === 'faculty' && (
                                <div className="border-t border-gray-100 pt-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Faculty ID *</label>
                                        <input
                                            value={form.facultyId}
                                            onChange={e => update('facultyId', e.target.value)}
                                            placeholder="FAC2024001"
                                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/30"
                                        />
                                    </div>
                                </div>
                            )}

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl text-sm"
                                >
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    {error}
                                </motion.div>
                            )}

                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-forest-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-forest-800 transition-colors disabled:opacity-60"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </motion.button>
                        </form>
                    )}

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-forest-900 font-semibold hover:underline">Login here</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};
