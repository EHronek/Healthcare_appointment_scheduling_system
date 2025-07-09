import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const error = params.get('error');

      if (error) {
        console.error('OAuth error:', error);
        navigate('/login?error=' + encodeURIComponent(error));
        return;
      }

      if (accessToken && refreshToken) {
        try {
          // Save tokens to localStorage
          localStorage.setItem('access_token', accessToken);
          localStorage.setItem('refresh_token', refreshToken);

          // Fetch user info (you may need to adjust this endpoint)
          const response = await fetch('http://localhost:5000/api/v1/users/me', {
            credentials: "include",
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch user info');
          }

          const userData = await response.json();
          localStorage.setItem('user', JSON.stringify(userData));

          // Redirect based on role
          if (userData.role === 'patient') {
            navigate('/patient');
          } else if (userData.role === 'doctor') {
            navigate('/doctor');
          } else if (userData.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        } catch (err) {
          console.error('Error processing OAuth:', err);
          navigate('/login?error=' + encodeURIComponent(err.message));
        }
      } else {
        navigate('/login?error=missing_tokens');
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  return <div>Processing login...</div>;
}

export default OAuthCallback;
