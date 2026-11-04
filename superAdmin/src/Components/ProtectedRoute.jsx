import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSuperAdminStore } from '../context/SuperAdminContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSuperAdminStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
