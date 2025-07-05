import React, { useState } from 'react';

function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'doctor', // default role
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Login successful!');
        localStorage.setItem('user', JSON.stringify(data));

        if (form.role === 'doctor') {
          window.location.href = '/doctor';
        } else if (form.role === 'admin') {
          window.location.href = '/admin';
        }
      } else {
        alert(data.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed due to network error.');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
      <h2>Doctor / Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label><br />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <div>
          <label>Password:</label><br />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <div>
          <label>Role:</label><br />
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
