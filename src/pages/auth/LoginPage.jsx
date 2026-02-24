import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Rocket, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const LoginPage = () => {
    const { login, getDashboardPath, user } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // If user is already logged in (or becomes logged in), redirect to dashboard
    useEffect(() => {
        if (user) {
            navigate(getDashboardPath(user.role), { replace: true });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Both fields are required.');
            return;
        }
        setError('');
        setLoading(true);
        await new Promise(r => setTimeout(r, 600));
        const result = login(email, password);
        if (!result.success) {
            setError('Invalid email or password.');
            toast.error('Invalid credentials — please try again.');
            setLoading(false);
        } else {
            toast.success(`Welcome back! Redirecting to your dashboard...`);
        }
        // If success: the useEffect above will fire once `user` state updates
    };

    const demoCredentials = [
        { role: 'Student', email: 'john@student.edu', password: 'student123' },
        { role: 'Faculty', email: 'rajan@faculty.edu', password: 'faculty123' },
        { role: 'Admin', email: 'admin@college.edu', password: 'admin123' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-3xl shadow-xl p-8"
                >
                    {/* Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="bg-forest-900 p-3 rounded-2xl mb-3">
                            <Rocket className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 text-center">Campus Event Management</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage. Register. Participate.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@college.edu"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-900/30 focus:border-forest-900 transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-900/30 focus:border-forest-900 transition-all text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
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
                            className="w-full bg-forest-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-forest-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Login'}
                        </motion.button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-forest-900 font-semibold hover:underline">
                            Register here
                        </Link>
                    </p>

                    {/* Demo credentials */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
                        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Demo Credentials</p>
                        <div className="space-y-1.5">
                            {demoCredentials.map(cred => (
                                <button
                                    key={cred.role}
                                    type="button"
                                    onClick={() => { setEmail(cred.email); setPassword(cred.password); }}
                                    className="w-full text-left text-xs text-gray-600 hover:text-forest-900 px-2 py-1 rounded-lg hover:bg-white transition-colors"
                                >
                                    <span className="font-semibold">{cred.role}:</span> {cred.email}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
