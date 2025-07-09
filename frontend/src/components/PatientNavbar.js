import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Calendar, MessageSquare, Home } from 'lucide-react';

const PatientNavbar = ({ role }) => {
  const navigate = useNavigate();
  const patient = JSON.parse(localStorage.getItem('patient'));

  const handleLogout = () => {
    localStorage.removeItem('patient');
    localStorage.removeItem('token');
    navigate('/patient-login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/patient" className="flex items-center">
              <span className="text-xl font-bold text-blue-800">HealthConnect</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/patient" 
              className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 transition"
            >
              <Home size={18} className="mr-2" />
              Dashboard
            </Link>
            <Link 
              to="/patient/appointments" 
              className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 transition"
            >
              <Calendar size={18} className="mr-2" />
              Appointments
            </Link>
            <Link 
              to="/patient/feedback" 
              className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 transition"
            >
              <MessageSquare size={18} className="mr-2" />
              Feedback
            </Link>
            <Link 
              to="/patient/profile" 
              className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 transition"
            >
              <User size={18} className="mr-2" />
              Profile
            </Link>
          </div>

          <div className="flex items-center">
            <div className="hidden md:flex items-center mr-4">
              <span className="text-gray-700">
                {patient?.first_name} {patient?.last_name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-red-600 hover:text-red-800 transition"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PatientNavbar;
