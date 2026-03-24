import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
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
            <Link to="/">Login</Link>
          )}
        </nav>
      </header>

      <div className="container">
        <Routes>
          <Route path="/" element={user ? <Navigate to={`/${user.role}-dashboard`} /> : <LoginPage setUser={setUser} />} />
          <Route path="/student-dashboard" element={user?.role === 'student' ? <StudentDashboard /> : <Navigate to="/" />} />
          <Route path="/faculty-dashboard" element={user?.role === 'faculty' ? <FacultyDashboard /> : <Navigate to="/" />} />
          <Route path="/admin-dashboard" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
