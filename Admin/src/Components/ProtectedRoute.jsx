import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminStore } from '../context/AdminContext';

const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAdminStore();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#B49A70] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-serif text-[#1C201C] tracking-wider uppercase">Authenticating Workstation…</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verify role permission: Only admin and super_admin
  const hasPermission = user.role === 'admin' || user.role === 'super_admin';
  if (!hasPermission) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          permissionDenied: true,
          message: 'Access Denied: Your account role does not have permission to access the Admin Workstation.'
        }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
