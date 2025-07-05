import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

function BookAppointment() {
  const [patient, setPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    doctorId: '',
    date: '',
    time: '',
  });

  useEffect(() => {
    const stored = localStorage.getItem('patient');
    if (!stored) {
      alert('Please log in to book an appointment.');
      window.location.href = '/patient-login';
      return;
    }

    const parsed = JSON.parse(stored);
    setPatient(parsed);

    fetch('http://localhost:5000/api/doctors')
      .then((res) => res.json())
      .then((data) => setDoctors(data))
      .catch((error) => {
        console.error('Failed to fetch doctors:', error);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      patientId: patient.id,
    };

    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Appointment booked successfully!');
        window.location.href = '/patient';
      } else {
        alert(data.message || 'Failed to book appointment.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed due to a network error.');
    }
  };

  return (
    <>
      <Navbar role="patient" />
      <div className="p-6 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-bold mb-6">Book Appointment</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Select Doctor</label>
            <select
              name="doctorId"
              value={form.doctorId}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded-lg"
            >
              <option value="">-- Choose a doctor --</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  Dr. {doc.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Select Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Select Time</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Book Appointment
          </button>
        </form>
      </div>
    </>
  );
}

export default BookAppointment;
