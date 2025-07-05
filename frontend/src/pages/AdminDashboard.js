import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

function AdminDashboard() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const admin = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!admin || admin.role !== 'admin') {
      alert('Unauthorized access');
      window.location.href = '/login';
      return;
    }

    fetch('http://localhost:5000/api/doctors')
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch doctors:', error);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:5000/api/doctors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        alert('Doctor created successfully!');
        setDoctors([...doctors, data]);
        setForm({ name: '', email: '', password: '' });
      })
      .catch((error) => {
        console.error('Error creating doctor:', error);
        alert('Failed to create doctor.');
      });
  };

  return (
    <>
      <Navbar role="admin" />
      <div className="p-6 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

        <h3 className="text-xl font-semibold mb-2">Create New Doctor</h3>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Temporary Password"
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">
            Create Doctor
          </button>
        </form>

        <h3 className="text-xl font-semibold mt-6 mb-2">Existing Doctors</h3>
        {loading ? (
          <p>Loading doctors...</p>
        ) : doctors.length === 0 ? (
          <p>No doctors found.</p>
        ) : (
          <ul className="list-disc ml-6 mt-2">
            {doctors.map((doc) => (
              <li key={doc.id}>
                {doc.name} — {doc.email}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default AdminDashboard;
