import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ setUser }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();

    // Form fields
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
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email: formData.email, password: formData.password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            navigate(`/${res.data.user.role}-dashboard`);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            setSuccessMsg('Registration successful! Please login.');
            setIsRegistering(false); // Switch back to login view
            setFormData({ ...formData, password: '' }); // Clear password
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={{ maxWidth: '450px', margin: '40px auto' }} className="card">
            <h2 style={{ textAlign: 'center' }}>{isRegistering ? 'Register' : 'Login'}</h2>
            {error && <p className="error-msg">{error}</p>}
            {successMsg && <div style={{ padding: '10px', background: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '15px' }}>{successMsg}</div>}

            {isRegistering ? (
                <form onSubmit={handleRegister}>
                    <label>Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                    <label>Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                    <label>Password *</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />

                    <label>Role</label>
                    <select name="role" value={formData.role} onChange={handleChange}>
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                    </select>

                    <label>Department *</label>
                    <select name="department" value={formData.department} onChange={handleChange} required>
                        <option value="">Select Dept</option>
                        <option value="CSE">CSE</option>
                        <option value="AIML">AIML</option>
                        <option value="ECE">ECE</option>
                    </select>

                    {formData.role === 'student' && (
                        <>
                            <label>Year *</label>
                            <input type="number" name="year" min="1" max="4" value={formData.year} onChange={handleChange} required />
                            <label>Section *</label>
                            <select name="section" value={formData.section} onChange={handleChange} required>
                                <option value="">Select Section</option>
                                <option value="A">A</option><option value="B">B</option><option value="C">C</option>
                            </select>
                        </>
                    )}

                    {formData.role === 'faculty' && (
                        <>
                            <label>College ID / Employee Code *</label>
                            <input type="text" name="collegeId" value={formData.collegeId} onChange={handleChange} required />
                        </>
                    )}

                    <button type="submit" style={{ width: '100%', marginTop: '10px' }}>Sign Up</button>
                    <p style={{ textAlign: 'center', marginTop: '15px' }}>
                        Already have an account? <span style={{ color: '#3498db', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setIsRegistering(false)}>Login here</span>
                    </p>
                </form>
            ) : (
                <form onSubmit={handleLogin}>
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    <button type="submit" style={{ width: '100%' }}>Login</button>
                    <p style={{ textAlign: 'center', marginTop: '15px' }}>
                        Don't have an account? <span style={{ color: '#3498db', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => { setIsRegistering(true); setError(''); setSuccessMsg(''); }}>Register here</span>
                    </p>
                </form>
            )}

            {!isRegistering && (
                <div style={{ marginTop: '20px', fontSize: '0.8rem', color: '#666', textAlign: 'center' }}>
                    <p><strong>Demo Credentials:</strong></p>
                    <p>Admin: admin@campus.edu / adminpassword</p>
                    <p>Faculty: cse.faculty@campus.edu / FAC-CSE-01</p>
                    <p>Student: 22csea01@student.edu / 22csea01</p>
                </div>
            )}
        </div>
    );
};

export default LoginPage;
