import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layouts
import { DashboardLayout } from './components/layout/DashboardLayout';

// Public / Auth Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { EventOversight } from './pages/admin/EventOversight';
import { Attendees } from './pages/admin/Attendees';
import { SystemAnalytics } from './pages/admin/SystemAnalytics';
import { ScorePolicy } from './pages/admin/ScorePolicy';

// Faculty Pages
import { FacultyDashboard } from './pages/faculty/FacultyDashboard';
import { CreateEvent } from './pages/faculty/CreateEvent';
import { ManageEvents as FacultyManageEvents } from './pages/faculty/ManageEvents';
import { FacultyEventDetail } from './pages/faculty/FacultyEventDetail';
import { FacultyReports } from './pages/faculty/FacultyReports';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { DiscoverEvents } from './pages/student/DiscoverEvents';
import { EventDetail } from './pages/student/EventDetail';
import { MyTickets } from './pages/student/MyTickets';
import { MyRegistrations } from './pages/student/MyRegistrations';
import { MyCertificates } from './pages/student/MyCertificates';

// Shared Pages
import { ProfilePage } from './pages/shared/ProfilePage';
import { NotFoundPage } from './pages/shared/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              borderRadius: '14px',
              fontFamily: 'inherit',
              fontSize: '14px',
              padding: '12px 16px',
              boxShadow: '0 8px 32px rgb(0 0 0 / 0.12)',
            },
            success: { iconTheme: { primary: '#064e3b', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <Routes>
          {/* =================== PUBLIC ROUTES =================== */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* =================== ADMIN ROUTES =================== */}
          <Route path="/admin" element={<DashboardLayout allowedRole="admin" />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="events" element={<EventOversight />} />
            <Route path="attendees" element={<Attendees />} />
            <Route path="analytics" element={<SystemAnalytics />} />
            <Route path="score-policy" element={<ScorePolicy />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* =================== FACULTY ROUTES =================== */}
          <Route path="/faculty" element={<DashboardLayout allowedRole="faculty" />}>
            <Route index element={<Navigate to="/faculty/dashboard" replace />} />
            <Route path="dashboard" element={<FacultyDashboard />} />
            <Route path="events" element={<FacultyManageEvents />} />
            <Route path="events/create" element={<CreateEvent />} />
            <Route path="events/:eventId" element={<FacultyEventDetail />} />
            <Route path="reports" element={<FacultyReports />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* =================== STUDENT ROUTES =================== */}
          <Route path="/student" element={<DashboardLayout allowedRole="student" />}>
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="events" element={<DiscoverEvents />} />
            <Route path="events/:eventId" element={<EventDetail />} />
            <Route path="registrations" element={<MyRegistrations />} />
            <Route path="tickets" element={<MyTickets />} />
            <Route path="certificates" element={<MyCertificates />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* =================== 404 =================== */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
