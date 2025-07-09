import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function OAuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');
    const errorParam = urlParams.get('error');

    if (errorParam) {
      setError(errorParam);
      return;
    }

    if (accessToken && refreshToken) {
      handleOAuthSuccess(accessToken, refreshToken);
    } else {
      setError('Missing OAuth tokens in callback URL');
    }
  }, []);

  const handleOAuthSuccess = async (accessToken, refreshToken) => {
    try {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);

      // Fetch user data
      const res = await fetch('http://localhost:5000/api/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch user info');

      const userData = await res.json();
      localStorage.setItem('user', JSON.stringify(userData));

      // Redirect based on role
      switch (userData.role) {
        case 'patient':
          navigate('/patient');
          break;
        case 'doctor':
          navigate('/doctor');
          break;
        case 'admin':
          navigate('/admin');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      console.error('OAuth error:', err);
      setError('OAuth login failed. Please try again.');
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Processing Google Login...</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default OAuthCallback;
