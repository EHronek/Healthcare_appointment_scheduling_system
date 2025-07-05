import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(role === 'patient' ? 'patient' : 'user');
    navigate(role === 'patient' ? '/patient-login' : '/login');
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow">
      <div className="text-lg font-semibold">Health Scheduler</div>
      <div className="flex space-x-4">
        {role === 'patient' && (
          <>
            <Link to="/patient" className="hover:underline">Dashboard</Link>
            <Link to="/patient/book" className="hover:underline">Book Appointment</Link>
          </>
        )}
        {role === 'doctor' && (
          <Link to="/doctor" className="hover:underline">Dashboard</Link>
        )}
        {role === 'admin' && (
          <Link to="/admin" className="hover:underline">Create Doctor</Link>
        )}
        <button onClick={handleLogout} className="hover:underline">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
