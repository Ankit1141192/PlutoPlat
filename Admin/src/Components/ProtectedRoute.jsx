import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminStore } from '../context/AdminContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAdminStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
