import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

function PatientLogin() {
  const handleLoginSuccess = (credentialResponse) => {
    console.log("Token:", credentialResponse.credential);

    // send token to backend for validation
    fetch('http://localhost:5000/api/patient-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: credentialResponse.credential })
    })
      .then(res => res.json())
      .then(data => {
        console.log("Backend Response:", data);
        alert("Login successful!");
        // navigate to patient dashboard
      })
      .catch(err => {
        console.error("Login failed:", err);
        alert("Login failed.");
      });
  };

  return (
    <div>
      <h2>Patient Login</h2>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => {
          console.log('Login Failed');
          alert("Google login failed.");
        }}
      />
    </div>
  );
}

export default PatientLogin;
