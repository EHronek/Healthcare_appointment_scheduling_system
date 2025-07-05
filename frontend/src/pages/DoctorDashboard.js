import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

function DoctorDashboard() {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      alert('Unauthorized');
      window.location.href = '/login';
      return;
    }

    const parsed = JSON.parse(stored);
    setDoctor(parsed);

    fetch(`http://localhost:5000/api/appointments/doctor/${parsed.id}`)
      .then((res) => res.json())
      .then((data) => setAppointments(data))
      .catch((err) => {
        console.error('Error fetching appointments:', err);
      });
  }, []);

  return (
    <>
      <Navbar role="doctor" />
      <div className="p-6 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Welcome, Dr. {doctor?.name || 'Doctor'}</h2>

        <h3 className="text-xl font-semibold mb-2">Appointments</h3>
        {appointments.length === 0 ? (
          <p>No appointments available.</p>
        ) : (
          <table className="w-full border mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border">Date</th>
                <th className="py-2 px-4 border">Time</th>
                <th className="py-2 px-4 border">Patient</th>
                <th className="py-2 px-4 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id} className="text-center">
                  <td className="border px-4 py-2">{appt.date}</td>
                  <td className="border px-4 py-2">{appt.time}</td>
                  <td className="border px-4 py-2">{appt.patientName}</td>
                  <td className="border px-4 py-2">{appt.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default DoctorDashboard;
