import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRole }) {
  const user =
    JSON.parse(localStorage.getItem('user')) ||
    JSON.parse(localStorage.getItem('patient'));

  if (!user || user.role !== allowedRole) {
    return <Navigate to={allowedRole === 'patient' ? '/patient-login' : '/login'} />;
  }

  return children;
}

export default ProtectedRoute;
