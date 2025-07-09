import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Calendar, MessageSquare, Home, LogOut } from 'lucide-react';

const PatientSidebar = () => {
  const location = useLocation();
  const patient = JSON.parse(localStorage.getItem('patient'));

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700' : 'text-gray-700';
  };

  const handleLogout = () => {
    localStorage.removeItem('patient');
    localStorage.removeItem('token');
    window.location.href = '/patient-login';
  };

  return (
    <div className="w-64 bg-white shadow-lg hidden md:block">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <User className="text-blue-700" size={24} />
          </div>
          <div>
            <h3 className="font-semibold">{patient?.first_name} {patient?.last_name}</h3>
            <p className="text-sm text-gray-500">Patient</p>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        <Link
          to="/patient"
          className={`flex items-center p-3 rounded-lg transition ${isActive('/patient')}`}
        >
          <Home size={18} className="mr-3" />
          Dashboard
        </Link>
        <Link
          to="/patient/appointments"
          className={`flex items-center p-3 rounded-lg transition ${isActive('/patient/appointments')}`}
        >
          <Calendar size={18} className="mr-3" />
          Appointments
        </Link>
        <Link
          to="/patient/history"
          className={`flex items-center p-3 rounded-lg transition ${isActive('/patient/history')}`}
        >
          <Calendar size={18} className="mr-3" />
          History
        </Link>
        <Link
          to="/patient/feedback"
          className={`flex items-center p-3 rounded-lg transition ${isActive('/patient/feedback')}`}
        >
          <MessageSquare size={18} className="mr-3" />
          Feedback
        </Link>
        <Link
          to="/patient/profile"
          className={`flex items-center p-3 rounded-lg transition ${isActive('/patient/profile')}`}
        >
          <User size={18} className="mr-3" />
          Profile
        </Link>
      </nav>

      <div className="p-4 border-t absolute bottom-0 w-64">
        <button
          onClick={handleLogout}
          className="flex items-center p-3 text-red-600 hover:bg-red-50 rounded-lg w-full transition"
        >
          <LogOut size={18} className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default PatientSidebar;
