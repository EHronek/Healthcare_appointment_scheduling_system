import React, { useEffect, useState } from 'react';
import Navbar from '../components/PatientNavbar';
import { format, addDays } from 'date-fns';

function BookAppointment() {
  const [patient, setPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    doctorId: '',
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'), // Default to tomorrow
    time: '',
    notes: ''
  });

  useEffect(() => {
    const stored = localStorage.getItem('patient');
    if (!stored) {
      window.location.href = '/patient-login';
      return;
    }
    setPatient(JSON.parse(stored));

    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/v1/doctors', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    if (form.doctorId && form.date) {
      fetchSlots();
    }
  }, [form.doctorId, form.date]);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/v1/appointments/availability?doctor_id=${form.doctorId}&date=${form.date}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const data = await response.json();
      setAvailableSlots(data.available_slots || []);
    } catch (error) {
      console.error('Failed to fetch slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/v1/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          patient_id: patient.id,
          doctor_id: form.doctorId,
          scheduled_time: `${form.date}T${form.time}:00`,
          notes: form.notes
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Booking failed');
      }

      alert('Appointment booked successfully!');
      window.location.href = '/patient/appointments';
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar role="patient" />
      <div className="p-6 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-bold mb-6">Book Appointment</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">Doctor*</label>
            <select
              name="doctorId"
              value={form.doctorId}
              onChange={(e) => setForm({...form, doctorId: e.target.value})}
              required
              className="w-full border px-4 py-2 rounded-lg"
            >
              <option value="">Select Doctor</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  Dr. {doc.first_name} {doc.last_name} ({doc.specialization})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Date*</label>
            <input
              type="date"
              name="date"
              value={form.date}
              min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
              onChange={(e) => setForm({...form, date: e.target.value})}
              required
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>

          {form.doctorId && (
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Available Time Slots*</label>
              {loading ? (
                <p>Loading available slots...</p>
              ) : availableSlots.length > 0 ? (
                <select
                  name="time"
                  value={form.time}
                  onChange={(e) => setForm({...form, time: e.target.value})}
                  required
                  className="w-full border px-4 py-2 rounded-lg"
                >
                  <option value="">Select Time</option>
                  {availableSlots.map((slot) => (
                    <option key={slot.start} value={slot.start.split('T')[1].slice(0,5)}>
                      {slot.start.split('T')[1].slice(0,5)} - {slot.end.split('T')[1].slice(0,5)}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-red-500">No available slots for selected date</p>
              )}
            </div>
          )}

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={(e) => setForm({...form, notes: e.target.value})}
              className="w-full border px-4 py-2 rounded-lg"
              rows="3"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !form.time}
            className={`w-full py-2 rounded-lg font-medium text-white ${loading || !form.time ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Booking...' : 'Confirm Appointment'}
          </button>
        </form>
      </div>
    </>
  );
}

export default BookAppointment;
