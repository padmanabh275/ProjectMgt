import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import CompanyList from './components/CompanyList';
import CompanyDetail from './components/CompanyDetail';
import CompanyDashboard from './components/CompanyDashboard';
import Dashboard from './components/Dashboard';
import UserDashboard from './components/UserDashboard';
import UserManagement from './components/UserManagement';
import PasswordChange from './components/PasswordChange';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { initializeReminders } from './utils/reminders';
import './App.css';

const AppContent = () => {
  const { user, logout, isAuthenticated, isMaster, isAdmin } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      // Request notification permission and initialize reminders
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
      initializeReminders();
    }
  }, [isAuthenticated]);

  return (
    <div className="app">
      {isAuthenticated && (
        <header className="app-header">
          <div className="header-content">
            <h1>Task Reminder & Management</h1>
            <nav>
              {isMaster && (
                <>
                  <Link to="/">Companies</Link>
                  <Link to="/dashboard">Dashboard</Link>
                  <Link to="/users">Users</Link>
                </>
              )}
              {isAdmin && !isMaster && (
                <>
                  <Link to={user?.companyId ? `/company/${user.companyId}/dashboard` : "/"}>Dashboard</Link>
                  <Link to="/users">Users</Link>
                </>
              )}
              {!isMaster && !isAdmin && (
                <>
                  <Link to="/my-tasks">My Tasks</Link>
                </>
              )}
              {user && (
                <div className="user-menu">
                  <span className="user-name">{user.name}</span>
                  <span className="user-role">{user.role}</span>
                  <Link to="/change-password" className="btn-change-password">Change Password</Link>
                  <button onClick={logout} className="btn-logout">Logout</button>
                </div>
              )}
            </nav>
          </div>
        </header>
      )}
      <main className={isAuthenticated ? "app-main" : ""}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <CompanyList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/:companyId"
            element={
              <ProtectedRoute>
                <CompanyDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/:companyId/dashboard"
            element={
              <ProtectedRoute>
                <CompanyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-tasks"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute requireAdmin>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <PasswordChange />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
