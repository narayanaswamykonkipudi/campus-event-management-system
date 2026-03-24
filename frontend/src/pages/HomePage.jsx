import React from 'react';
import { useNavigate } from 'react-router-dom';

const features = [
    {
        icon: '📅',
        title: 'Browse Events',
        desc: 'Discover workshops, seminars, hackathons, and cultural events happening across campus.',
    },
    {
        icon: '✅',
        title: 'Easy Registration',
        desc: 'Register for events in one click. Track your registrations and attendance in one place.',
    },
    {
        icon: '🏅',
        title: 'Earn Certificates',
        desc: 'Automatically receive participation and merit certificates after attending events.',
    },
];

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="home-page">
            {/* Hero */}
            <section className="hero">
                <div className="hero-content">
                    <span className="hero-tag">🎓 Your Campus. Your Events.</span>
                    <h1 className="hero-title">Campus Event Management System</h1>
                    <p className="hero-sub">
                        Discover, register, and participate in exciting events across all departments.
                        Faculty can organize, students can engage — all in one platform.
                    </p>
                    <div className="hero-actions">
                        <button className="btn-primary" onClick={() => navigate('/login')}>
                            Login
                        </button>
                        <button className="btn-outline" onClick={() => navigate('/register')}>
                            Register
                        </button>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features-section">
                <h2 className="features-heading">Everything you need</h2>
                <div className="features-grid">
                    {features.map((f) => (
                        <div className="feature-card" key={f.title}>
                            <div className="feature-icon">{f.icon}</div>
                            <h3 className="feature-title">{f.title}</h3>
                            <p className="feature-desc">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
