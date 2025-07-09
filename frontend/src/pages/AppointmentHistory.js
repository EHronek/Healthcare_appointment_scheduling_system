import React, { useEffect, useState } from 'react';
import Navbar from '../components/PatientNavbar';
import PatientSidebar from '../components/PatientSidebar';
import { format, parseISO } from 'date-fns';

function AppointmentHistory() {
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stored = localStorage.getItem('patient');
        if (!stored) {
          window.location.href = '/patient-login';
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
        const pastAppointments = data.filter(appt => 
          appt.status === 'completed' || 
          new Date(appt.scheduled_time) < new Date()
        );

        setAppointments(pastAppointments);
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
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Navbar role="patient" />
      <div className="flex">
        <PatientSidebar />
        <div className="flex-1 bg-gray-50 min-h-screen p-10">
          <h2 className="text-3xl font-bold text-blue-800 mb-6">Appointment History</h2>
          
          {appointments.length === 0 ? (
            <p className="text-gray-600">No past appointments found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow rounded-lg overflow-hidden">
                <thead className="bg-gradient-to-r from-blue-800 to-red-700 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Doctor</th>
                    <th className="py-3 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt) => (
                    <tr key={appt.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {format(parseISO(appt.scheduled_time), 'PPPp')}
                      </td>
                      <td className="px-4 py-3">
                        Dr. {appt.doctor?.first_name} {appt.doctor?.last_name}
                      </td>
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
      </div>
    </>
  );
}

export default AppointmentHistory;
