import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSuperAdminStore } from '../context/SuperAdminContext';

const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useSuperAdminStore();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0D0B] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#B49A70] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-serif text-[#D9C49B] tracking-wider uppercase">Verifying Root Security Clearance…</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Strictly check role permission: Only super_admin allowed
  if (user.role !== 'super_admin') {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          permissionDenied: true,
          message: 'Access Denied: Only SuperAdmin Platform Owners with Level 0 clearance are authorized to access Platform HQ.'
        }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
