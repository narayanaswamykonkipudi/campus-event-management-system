import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

const App = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <header>
        <div className="logo">CampusEvents</div>
        <nav>
          {user ? (
            <>
              <span>Welcome, {user.name} ({user.role})</span>
              <button onClick={handleLogout} style={{ marginLeft: '20px' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" style={{ marginLeft: '1rem' }}>Register</Link>
            </>
          )}
        </nav>
      </header>

      <Routes>
        {/* Public home — shown only when not logged in */}
        <Route path="/" element={user ? <Navigate to={`/${user.role}-dashboard`} /> : <HomePage />} />

        {/* Auth pages */}
        <Route path="/login" element={user ? <Navigate to={`/${user.role}-dashboard`} /> : <LoginPage setUser={setUser} startMode="login" />} />
        <Route path="/register" element={user ? <Navigate to={`/${user.role}-dashboard`} /> : <LoginPage setUser={setUser} startMode="register" />} />

        {/* Dashboards */}
        <Route path="/student-dashboard" element={user?.role === 'student' ? <div className="container"><StudentDashboard /></div> : <Navigate to="/" />} />
        <Route path="/faculty-dashboard" element={user?.role === 'faculty' ? <div className="container"><FacultyDashboard /></div> : <Navigate to="/" />} />
        <Route path="/admin-dashboard" element={user?.role === 'admin' ? <div className="container"><AdminDashboard /></div> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
