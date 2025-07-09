import React, { useEffect, useState } from 'react';
import Navbar from '../components/PatientNavbar';
import PatientSidebar from '../components/PatientSidebar';

function PatientProfile() {
  const [patient, setPatient] = useState(null);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    insurance_provider: '',
    insurance_number: '',
    password: ''
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('patient');
    if (!stored) {
      window.location.href = '/patient-login';
      return;
    }

    const parsed = JSON.parse(stored);
    setPatient(parsed);
    setForm({
      first_name: parsed.first_name,
      last_name: parsed.last_name,
      email: parsed.email,
      phone_number: parsed.phone_number,
      insurance_provider: parsed.insurance_provider || '',
      insurance_number: parsed.insurance_number,
      password: ''
    });
    setPreview(parsed.profile_picture || null);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile_picture' && files && files[0]) {
      const file = files[0];
      setPreview(URL.createObjectURL(file));
      setForm(prev => ({ ...prev, [name]: file }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      for (const key in form) {
        if (form[key]) {
          formData.append(key, form[key]);
        }
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/v1/patients/${patient.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Update failed');
      }

      const updatedPatient = await response.json();
      localStorage.setItem('patient', JSON.stringify(updatedPatient));
      setPatient(updatedPatient);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
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
        <div className="flex-1 p-10 bg-gray-50 min-h-screen">
          <h2 className="text-3xl font-bold text-blue-800 mb-6">My Profile</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              Profile updated successfully!
            </div>
          )}

          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center">
                <img
                  src={preview || '/default-avatar.png'}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-600 mb-4"
                />
                <label className="cursor-pointer bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200 transition">
                  Change Photo
                  <input
                    type="file"
                    name="profile_picture"
                    onChange={handleChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">First Name*</label>
                    <input
                      type="text"
                      name="first_name"
                      value={form.first_name}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Last Name*</label>
                    <input
                      type="text"
                      name="last_name"
                      value={form.last_name}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Phone Number*</label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Insurance Provider</label>
                    <input
                      type="text"
                      name="insurance_provider"
                      value={form.insurance_provider}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Insurance Number*</label>
                    <input
                      type="text"
                      name="insurance_number"
                      value={form.insurance_number}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current password"
                    className="w-full p-3 border rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 bg-blue-600 text-white rounded-lg font-bold mt-4 ${loading ? 'opacity-50' : 'hover:bg-blue-700'}`}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PatientProfile;
