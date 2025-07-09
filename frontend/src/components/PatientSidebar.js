import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, MessageSquare, User, LogOut } from 'lucide-react';

const PatientSidebar = () => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('patient');
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Optional unified logout
    window.location.href = '/login';
  };

  const linkClasses = (path) =>
    `flex items-center p-2 rounded hover:bg-blue-100 ${
      location.pathname === path ? 'bg-blue-200 font-semibold' : ''
    }`;

  return (
    <div className="h-screen bg-white shadow-md p-4 w-64">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">Patient Menu</h2>
      <nav className="space-y-2">
        <Link to="/patient" className={linkClasses('/patient')}>
          <Home size={18} className="mr-2" />
          Dashboard
        </Link>
        <Link to="/patient/appointments" className={linkClasses('/patient/appointments')}>
          <Calendar size={18} className="mr-2" />
          Appointments
        </Link>
        <Link to="/patient/feedback" className={linkClasses('/patient/feedback')}>
          <MessageSquare size={18} className="mr-2" />
          Feedback
        </Link>
        <Link to="/patient/profile" className={linkClasses('/patient/profile')}>
          <User size={18} className="mr-2" />
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center p-2 text-red-600 hover:text-red-800 mt-4"
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </button>
      </nav>
    </div>
  );
};

export default PatientSidebar;
