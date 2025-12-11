import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireMaster = false, requireAdmin = false }) => {
  const { isAuthenticated, isMaster, isAdmin, loading, user } = useAuth();

  // Debug logging
  useEffect(() => {
    if (!loading) {
      console.log('ProtectedRoute check:', {
        isAuthenticated,
        user: user ? { name: user.name, role: user.role } : null,
        requireMaster,
        requireAdmin
      });
    }
  }, [loading, isAuthenticated, user, requireMaster, requireAdmin]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (requireMaster && !isMaster) {
    console.log('Master required but not master, redirecting to home');
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !isAdmin) {
    console.log('Admin required but not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

