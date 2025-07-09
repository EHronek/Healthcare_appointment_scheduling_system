import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRole }) {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || user.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
