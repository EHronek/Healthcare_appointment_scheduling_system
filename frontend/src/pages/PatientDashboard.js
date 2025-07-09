import React, { useEffect, useState } from 'react';
import Navbar from '../components/PatientNavbar';
import { format, parseISO } from 'date-fns';

function PatientDashboard() {
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stored = localStorage.getItem('patient');
        if (!stored) {
          window.location.href = '/login'; // ✅ updated from /patient-login
          return;
        }

        const parsed = JSON.parse(stored);
        setPatient(parsed);

        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/v1/appointments/patient/${parsed.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }

        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <>
      <Navbar role="patient" />
      <div className="p-6 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-bold mb-4">
          Welcome, {patient?.first_name || 'Patient'}
        </h2>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-semibold mb-4">Your Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Name:</p>
              <p className="font-medium">{patient?.first_name} {patient?.last_name}</p>
            </div>
            <div>
              <p className="text-gray-600">Insurance:</p>
              <p className="font-medium">
                {patient?.insurance_provider || 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Email:</p>
              <p className="font-medium">{patient?.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Phone:</p>
              <p className="font-medium">{patient?.phone_number}</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-2">Upcoming Appointments</h3>
        {appointments.filter(a => a.status === 'scheduled').length === 0 ? (
          <p className="text-gray-600">No upcoming appointments.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white shadow rounded-lg overflow-hidden">
              <thead className="bg-blue-800 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Date & Time</th>
                  <th className="py-3 px-4 text-left">Doctor</th>
                  <th className="py-3 px-4 text-left">Duration</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments
                  .filter(a => a.status === 'scheduled')
                  .map((appt) => (
                    <tr key={appt.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {format(parseISO(appt.scheduled_time), 'PPpp')}
                      </td>
                      <td className="px-4 py-3">
                        Dr. {appt.doctor?.first_name} {appt.doctor?.last_name}
                      </td>
                      <td className="px-4 py-3">{appt.duration} minutes</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${statusColor(appt.status)}`}>
                          {appt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default PatientDashboard;
