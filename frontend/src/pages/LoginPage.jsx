import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ setUser, startMode }) => {
    const [isRegistering, setIsRegistering] = useState(startMode === 'register');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'student',
        year: '', department: '', section: '', collegeId: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                email: formData.email,
                password: formData.password,
            });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            navigate(`/${res.data.user.role}-dashboard`);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            setSuccessMsg('Account created! You can now log in.');
            setIsRegistering(false);
            setFormData({ ...formData, password: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    const switchToRegister = () => { setIsRegistering(true); setError(''); setSuccessMsg(''); };
    const switchToLogin = () => { setIsRegistering(false); setError(''); setSuccessMsg(''); };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                {/* Top accent bar */}
                <div className="auth-card-bar" />

                {/* Header */}
                <div className="auth-header">
                    <div className="auth-logo">🎓</div>
                    <h2 className="auth-title">{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
                    <p className="auth-subtitle">
                        {isRegistering
                            ? 'Join the campus events platform'
                            : 'Sign in to your CampusEvents account'}
                    </p>
                </div>

                {/* Toggle tabs */}
                <div className="auth-tabs">
                    <button
                        type="button"
                        className={`auth-tab ${!isRegistering ? 'auth-tab--active' : ''}`}
                        onClick={switchToLogin}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        className={`auth-tab ${isRegistering ? 'auth-tab--active' : ''}`}
                        onClick={switchToRegister}
                    >
                        Register
                    </button>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="auth-alert auth-alert--error">
                        ⚠ {error}
                    </div>
                )}
                {successMsg && (
                    <div className="auth-alert auth-alert--success">
                        ✓ {successMsg}
                    </div>
                )}

                {/* Forms */}
                {isRegistering ? (
                    <form onSubmit={handleRegister} className="auth-form">
                        <div className="auth-field">
                            <label>Full Name</label>
                            <input type="text" name="name" placeholder="e.g. Karthik Sharma" value={formData.name} onChange={handleChange} required />
                        </div>

                        <div className="auth-field">
                            <label>Email</label>
                            <input type="email" name="email" placeholder="you@student.edu" value={formData.email} onChange={handleChange} required />
                        </div>

                        <div className="auth-field">
                            <label>Password</label>
                            <input type="password" name="password" placeholder="Create a password" value={formData.password} onChange={handleChange} required />
                        </div>

                        <div className="auth-row">
                            <div className="auth-field">
                                <label>Role</label>
                                <select name="role" value={formData.role} onChange={handleChange}>
                                    <option value="student">Student</option>
                                    <option value="faculty">Faculty</option>
                                </select>
                            </div>
                            <div className="auth-field">
                                <label>Department</label>
                                <select name="department" value={formData.department} onChange={handleChange} required>
                                    <option value="">Select</option>
                                    <option value="CSE">CSE</option>
                                    <option value="AIML">AIML</option>
                                    <option value="ECE">ECE</option>
                                </select>
                            </div>
                        </div>

                        {formData.role === 'student' && (
                            <div className="auth-row">
                                <div className="auth-field">
                                    <label>Year</label>
                                    <input type="number" name="year" min="1" max="4" placeholder="1–4" value={formData.year} onChange={handleChange} required />
                                </div>
                                <div className="auth-field">
                                    <label>Section</label>
                                    <select name="section" value={formData.section} onChange={handleChange} required>
                                        <option value="">Select</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {formData.role === 'faculty' && (
                            <div className="auth-field">
                                <label>Employee Code</label>
                                <input type="text" name="collegeId" placeholder="e.g. FAC-CSE-01" value={formData.collegeId} onChange={handleChange} required />
                            </div>
                        )}

                        <button type="submit" className="auth-submit" disabled={loading}>
                            {loading ? 'Creating account…' : 'Create Account'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleLogin} className="auth-form">
                        <div className="auth-field">
                            <label>Email</label>
                            <input type="email" name="email" placeholder="you@student.edu" value={formData.email} onChange={handleChange} required />
                        </div>

                        <div className="auth-field">
                            <label>Password</label>
                            <input type="password" name="password" placeholder="Your password" value={formData.password} onChange={handleChange} required />
                        </div>

                        <button type="submit" className="auth-submit" disabled={loading}>
                            {loading ? 'Signing in…' : 'Sign In'}
                        </button>

                        {/* Demo credentials */}
                        <details className="auth-demo">
                            <summary>Demo credentials</summary>
                            <div className="auth-demo-list">
                                <div><span className="auth-demo-role">Admin</span> admin@campus.edu / adminpassword</div>
                                <div><span className="auth-demo-role">Faculty</span> cse.faculty@campus.edu / FAC-CSE-01</div>
                                <div><span className="auth-demo-role">Student</span> 22csea01@student.edu / 22csea01</div>
                            </div>
                        </details>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
