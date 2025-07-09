import React, { useEffect, useState } from 'react';
import Navbar from '../components/PatientNavbar';
import PatientSidebar from '../components/PatientSidebar';
import { Star } from 'lucide-react';
import { format, parseISO } from 'date-fns';

function PatientFeedback() {
  const [patient, setPatient] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('patient');
    if (!stored) {
      window.location.href = '/patient-login';
      return;
    }
    setPatient(JSON.parse(stored));

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch completed appointments
        const appsResponse = await fetch(
          `http://localhost:5000/api/v1/appointments/patient/${JSON.parse(stored).id}?status=completed`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        const appsData = await appsResponse.json();
        setAppointments(appsData);

        // Fetch feedback history
        const fbResponse = await fetch(
          `http://localhost:5000/api/v1/feedback/patient/${JSON.parse(stored).id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        const fbData = await fbResponse.json();
        setHistory(fbData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !feedback.trim()) {
      alert('Please provide both a rating and feedback.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/v1/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          patient_id: patient.id,
          rating,
          comments: feedback,
          appointment_id: document.getElementById('appointment-select').value
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Submission failed');
      }

      const newFeedback = await response.json();
      setHistory([newFeedback, ...history]);
      setFeedback('');
      setRating(0);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar role="patient" />
      <div className="flex">
        <PatientSidebar />
        <div className="flex-1 bg-gray-50 min-h-screen p-10">
          <h2 className="text-3xl font-bold text-blue-800 mb-6">Feedback</h2>

          {submitted && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Thank you for your feedback!
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md max-w-2xl space-y-6 mb-8">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Select Appointment</label>
              <select
                id="appointment-select"
                className="w-full p-3 border rounded-lg bg-gray-50"
                required
              >
                <option value="">Select completed appointment</option>
                {appointments.map(appt => (
                  <option key={appt.id} value={appt.id}>
                    {format(parseISO(appt.scheduled_time), 'PPpp')} - Dr. {appt.doctor.first_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={28}
                    onClick={() => setRating(star)}
                    className={`cursor-pointer ${star <= rating ? 'text-yellow-400 fill-yellow-300' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Comments</label>
              <textarea
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full p-4 border rounded-lg bg-gray-50"
                placeholder="Share your experience..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-blue-600 text-white rounded-lg font-bold ${loading ? 'opacity-50' : 'hover:bg-blue-700'}`}
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>

          <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Your Feedback History</h3>
            {history.length === 0 ? (
              <p className="text-gray-600">No feedback submitted yet.</p>
            ) : (
              <ul className="space-y-4">
                {history.map((item) => (
                  <li key={item.id} className="border-b pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {item.appointment?.doctor.first_name && (
                            `Dr. ${item.appointment.doctor.first_name}`
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(parseISO(item.created_at), 'PPpp')}
                        </p>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={18}
                            className={`${i < item.rating ? 'text-yellow-400 fill-yellow-300' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-gray-700">{item.comments}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default PatientFeedback;
