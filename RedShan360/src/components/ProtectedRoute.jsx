import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');
  
  let user = null;
  if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
    try {
      user = JSON.parse(savedUser);
    } catch (e) {
      console.error('Failed to parse user from localStorage in ProtectedRoute:', e);
    }
  }

  const isAuthenticated = Boolean(token && user);

  useEffect(() => {
    if (!isAuthenticated) {
      setTimeout(() => {
        window.dispatchEvent(new Event('show-login-required'));
      }, 150);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role ? String(user.role).toUpperCase() : '';
    const normalizedAllowedRoles = allowedRoles.map((r) => String(r).toUpperCase());
    
    if (!userRole || !normalizedAllowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
