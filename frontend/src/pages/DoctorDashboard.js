import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [doctorData, setDoctorData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [exceptions, setExceptions] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorData = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        console.error("No user found in localStorage");
        return;
      }

      const user = JSON.parse(storedUser);
      const userId = user.id

      try {
        /* const currentUser = localStorage.getItem('user');
        console.log(currentUser)
        console.log(currentUser['id'])
        console.log(`http://localhost:5000/api/v1/doctors/user/${currentUser.id}`) */
        
        // Fetch doctor profile
        // console.log(userId)
        setLoading(true);
        setError(null);

        const doctorResponse = await fetch(`http://localhost:5000/api/v1/doctors/user/${userId}`, {
          credentials: "include",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        
        if (!doctorResponse.ok) throw new Error('Failed to fetch doctor data');
        const doctor = await doctorResponse.json();
        setDoctorData(doctor);

        // Fetch appointments
        const appointmentsResponse = await fetch(`http://localhost:5000/api/v1/doctors/${doctor.id}/appointments`, {
          credentials: "include",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });

        if (!appointmentsResponse.ok) throw new Error('Failed to fetch appointments');
        const appointmentsData = await appointmentsResponse.json();
        setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);

        // Fetch availabilities
        const availabilitiesResponse = await fetch(`http://localhost:5000/api/v1/doctors/${doctor.id}/availabilities`, {
          credentials: "include",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        const availabilitiesData = await availabilitiesResponse.json();
        setAvailabilities(availabilitiesData);

        // Fetch exceptions
        const exceptionsResponse = await fetch(`http://localhost:5000/api/v1/doctors/${doctor.id}/exceptions`, {
          credentials: "include",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        const exceptionsData = await exceptionsResponse.json();
        setExceptions(exceptionsData);

        // Fetch medical records
        const recordsResponse = await fetch(`http://localhost:5000/api/v1/doctors/${doctor.id}/medical_records`, {
          credentials: "include",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        const recordsData = await recordsResponse.json();
        setMedicalRecords(recordsData);

      } catch (err) {
        setError(err.message);
        if (err.message.includes('Unauthorized')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [navigate]);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid #eee'
      }}>
        <h1 style={{ margin: 0 }}>Doctor Dashboard</h1>
        <div>
          <span style={{ marginRight: '1rem' }}>Dr. {doctorData.first_name} {doctorData.last_name}</span>
          <button 
            onClick={() => {
              localStorage.removeItem('access_token');
              navigate('/login');
            }}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <nav style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        borderBottom: '1px solid #eee',
        paddingBottom: '1rem'
      }}>
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'profile' ? '#3498db' : '#f8f9fa',
            color: activeTab === 'profile' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'appointments' ? '#3498db' : '#f8f9fa',
            color: activeTab === 'appointments' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Appointments
        </button>
        <button
          onClick={() => setActiveTab('availability')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'availability' ? '#3498db' : '#f8f9fa',
            color: activeTab === 'availability' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Availability
        </button>
        <button
          onClick={() => setActiveTab('exceptions')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'exceptions' ? '#3498db' : '#f8f9fa',
            color: activeTab === 'exceptions' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Exceptions
        </button>
        <button
          onClick={() => setActiveTab('records')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'records' ? '#3498db' : '#f8f9fa',
            color: activeTab === 'records' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Medical Records
        </button>
      </nav>

      <div style={{ padding: '1rem' }}>
        {activeTab === 'profile' && (
          <ProfileTab 
            doctorData={doctorData} 
            setDoctorData={setDoctorData} 
          />
        )}
        
        {activeTab === 'appointments' && (
          <AppointmentsTab 
            appointments={appointments} 
            doctorId={doctorData.id} 
          />
        )}
        
        {activeTab === 'availability' && (
          <AvailabilityTab 
            availabilities={availabilities} 
            doctorId={doctorData.id} 
            setAvailabilities={setAvailabilities} 
          />
        )}
        
        {activeTab === 'exceptions' && (
          <ExceptionsTab 
            exceptions={exceptions} 
            doctorId={doctorData.id} 
            setExceptions={setExceptions} 
          />
        )}
        
        {activeTab === 'records' && (
          <MedicalRecordsTab 
            records={medicalRecords} 
            doctorId={doctorData.id} 
          />
        )}
      </div>
    </div>
  );
};

const getPatientData = async (patientId, accessToken) => {
  try {
    const response = await fetch(`http://localhost:5000/api/v1/patients/${patientId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}` // Send JWT token
      },
      credentials: 'include' // if using cookies for auth
    });

    if (!response.ok) {
      // Try parsing error message from Flask backend
      let errorData;
      try {
        errorData = await response.json();
      } catch (jsonError) {
        errorData = {};
      }

      const errorMessage = errorData.error || 'Failed to fetch patient data';
      throw new Error(errorMessage);
    }

    const data = await response.json(); // This is the patient object
    console.log('Patient Data:', data);
    return data;

  } catch (error) {
    console.error("Error fetching patient:", error.message);
    alert(error.message); // Show user-friendly error
  }
};

// Component for Profile Tab
const ProfileTab = ({ doctorData, setDoctorData }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...doctorData });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/v1/doctors/${doctorData.id}`, {
        credentials: "include",
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Failed to update profile');
      
      const updatedDoctor = await response.json();
      setDoctorData(updatedDoctor);
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h2>My Profile</h2>
        <button
          onClick={() => setEditMode(!editMode)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: editMode ? '#6c757d' : '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {editMode ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>
      
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      
      {editMode ? (
        <form onSubmit={handleSubmit} style={{
          backgroundColor: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ced4da'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ced4da'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ced4da'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Specialization</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ced4da'
              }}
            />
          </div>
          
          <button
            type="submit"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Save Changes
          </button>
        </form>
      ) : (
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <strong>First Name:</strong> {doctorData.first_name}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Last Name:</strong> {doctorData.last_name}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Email:</strong> {doctorData.email}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Specialization:</strong> {doctorData.specialization}
          </div>
        </div>
      )}
    </div>
  );
};

// Component for Appointments Tab
const AppointmentsTab = ({ appointments = [], doctorId }) => {
  const safeAppointments = Array.isArray(appointments) ? appointments : [];

  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const filteredAppointments = safeAppointments.filter(appointment => {
    const matchesStatus = filter === 'all' || appointment.status === filter;
    const matchesDate = !dateFilter || 
      new Date(appointment.scheduled_time).toISOString().split('T')[0] === dateFilter;
    return matchesStatus && matchesDate;
  });

  const stats = {
    total: safeAppointments.length,
    completed: safeAppointments.filter(a => a.status === 'completed').length,
    cancelled: safeAppointments.filter(a => a.status === 'cancelled').length,
    upcoming: safeAppointments.filter(a => a.status === 'scheduled').length
  };

  const handleCompleteAppointment = async (appointmentId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/v1/appointments/${appointmentId}/complete`, {
        credentials: "include",
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        // Ensure we always have a string message to display
        const errorMessage = errorData.error || 'Failed to complete appointment';
        throw new Error(errorMessage);
      }
      
      // Refresh appointments after completion
      const updatedResponse = await fetch(`http://localhost:5000/api/v1/doctors/${doctorId}/appointments`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (!updatedResponse.ok) {
        const errorData = await updatedResponse.json();
        const errorMessage = errorData.error?.message || errorData.message || 'Failed to fetch updated appointments';
        throw new Error(errorMessage);
      }
      
      const updatedAppointments = await updatedResponse.json();
      return updatedAppointments;
    } catch (err) {
      console.error('Error completing appointment:', err);
      // Ensure we're always setting a string error message
      setError(err.message || 'An unknown error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading appointments...</div>;

  return (
    <div>
      {/* Error display - now safely handles string messages only */}
      {error && (
        <div style={{ 
          color: 'red', 
          backgroundColor: '#ffeeee',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <h2 style={{ marginBottom: '1.5rem' }}>My Appointments</h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: '#17a2b8',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>Total Patients</h3>
          <p style={{ fontSize: '1.5rem', margin: 0 }}>{stats.total}</p>
        </div>
        
        <div style={{
          backgroundColor: '#28a745',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>Attended</h3>
          <p style={{ fontSize: '1.5rem', margin: 0 }}>{stats.completed}</p>
        </div>
        
        <div style={{
          backgroundColor: '#dc3545',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>Cancelled</h3>
          <p style={{ fontSize: '1.5rem', margin: 0 }}>{stats.cancelled}</p>
        </div>
        
        <div style={{
          backgroundColor: '#ffc107',
          color: '#212529',
          padding: '1rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>Upcoming</h3>
          <p style={{ fontSize: '1.5rem', margin: 0 }}>{stats.upcoming}</p>
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem',
        alignItems: 'center'
      }}>
        <div>
          <label style={{ marginRight: '0.5rem' }}>Filter by status:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ced4da'
            }}
          >
            <option value="all">All</option>
            <option value="scheduled">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <div>
          <label style={{ marginRight: '0.5rem' }}>Filter by date:</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ced4da'
            }}
          />
        </div>
      </div>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Patient</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Date & Time</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Duration</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map(appointment => (
                <tr key={appointment.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '1rem' }}>{appointment.patient_id}</td>
                  <td style={{ padding: '1rem' }}>
                    {new Date(appointment.scheduled_time).toLocaleString()}
                  </td>
                  <td style={{ padding: '1rem' }}>{appointment.duration} mins</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      backgroundColor: 
                        appointment.status === 'completed' ? '#28a745' :
                        appointment.status === 'cancelled' ? '#dc3545' : '#ffc107',
                      color: appointment.status === 'cancelled' ? 'white' : '#212529'
                    }}>
                      {appointment.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {appointment.status === 'scheduled' && (
                      <button
                        onClick={async () => {
                          console.log(appointment.id)
                          const updatedAppointments = await handleCompleteAppointment(appointment.id);
                          if (updatedAppointments) {
                            // Update state with new appointments
                            window.location.reload();
                          }
                        }}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          marginRight: '0.5rem'
                        }}
                      >
                        Complete
                      </button>
                    )}
                    <button
                      onClick={() => {
                        // View appointment details
                      }}
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ padding: '1rem', textAlign: 'center' }}>
                  No appointments found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Component for Availability Tab
const AvailabilityTab = ({ availabilities, doctorId, setAvailabilities }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    day_of_week: 'Monday',
    start_time: '09:00',
    end_time: '17:00'
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/v1/availabilities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          ...formData,
          doctor_id: doctorId
        })
      });
      
      if (!response.ok) throw new Error('Failed to add availability');
      
      const newAvailability = await response.json();
      setAvailabilities([...availabilities, newAvailability]);
      setShowForm(false);
      setFormData({
        day_of_week: 'Monday',
        start_time: '09:00',
        end_time: '17:00'
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (availabilityId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/availabilities/${availabilityId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to delete availability');
      
      setAvailabilities(availabilities.filter(a => a.id !== availabilityId));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h2>My Availability</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: showForm ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showForm ? 'Cancel' : 'Add Availability'}
        </button>
      </div>
      
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      
      {showForm && (
        <form onSubmit={handleSubmit} style={{
          backgroundColor: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Day of Week</label>
            <select
              name="day_of_week"
              value={formData.day_of_week}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ced4da'
              }}
            >
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Start Time</label>
            <input
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ced4da'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>End Time</label>
            <input
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ced4da'
              }}
            />
          </div>
          
          <button
            type="submit"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Save Availability
          </button>
        </form>
      )}
      
      {availabilities.length > 0 ? (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Day</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Start Time</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>End Time</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {availabilities.map(availability => (
                <tr key={availability.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '1rem' }}>{availability.day_of_week}</td>
                  <td style={{ padding: '1rem' }}>{availability.start_time}</td>
                  <td style={{ padding: '1rem' }}>{availability.end_time}</td>
                  <td style={{ padding: '1rem' }}>
                    <button
                      onClick={() => handleDelete(availability.id)}
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '2rem',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#6c757d'
        }}>
          No availability slots added yet. Add your working hours to start accepting appointments.
        </div>
      )}
    </div>
  );
};

// Component for Exceptions Tab
const ExceptionsTab = ({ exceptions, doctorId, setExceptions }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    is_available: false
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/v1/exceptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          ...formData,
          doctor_id: doctorId
        })
      });
      
      if (!response.ok) throw new Error('Failed to add exception');
      
      const newException = await response.json();
      setExceptions([...exceptions, newException]);
      setShowForm(false);
      setFormData({
        date: '',
        is_available: false
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (exceptionId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/exceptions/${exceptionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to delete exception');
      
      setExceptions(exceptions.filter(e => e.id !== exceptionId));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h2>Schedule Exceptions</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: showForm ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showForm ? 'Cancel' : 'Add Exception'}
        </button>
      </div>
      
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      
      {showForm && (
        <form onSubmit={handleSubmit} style={{
          backgroundColor: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ced4da'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              name="is_available"
              checked={formData.is_available}
              onChange={handleChange}
              style={{
                marginRight: '0.5rem'
              }}
            />
            <label>Available on this date (uncheck to mark as unavailable)</label>
          </div>
          
          <button
            type="submit"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Save Exception
          </button>
        </form>
      )}
      
      {exceptions.length > 0 ? (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Date</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exceptions.map(exception => (
                <tr key={exception.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '1rem' }}>{exception.date}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      backgroundColor: exception.is_available ? '#28a745' : '#dc3545',
                      color: 'white'
                    }}>
                      {exception.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button
                      onClick={() => handleDelete(exception.id)}
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '2rem',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#6c757d'
        }}>
          No exceptions added yet. Add exceptions to modify your regular availability.
        </div>
      )}
    </div>
  );
};

// Component for Medical Records Tab
const MedicalRecordsTab = ({ records, doctorId }) => {
  const [selectedRecord, setSelectedRecord] = useState(null);

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Medical Records</h2>
      
      {selectedRecord ? (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h3>Record Details</h3>
            <button
              onClick={() => setSelectedRecord(null)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Back to List
            </button>
          </div>
          
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '8px'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Patient:</strong> {selectedRecord.patient_name}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Appointment Date:</strong> {new Date(selectedRecord.appointment_date).toLocaleString()}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Notes:</strong>
              <div style={{
                backgroundColor: 'white',
                padding: '1rem',
                borderRadius: '4px',
                marginTop: '0.5rem',
                border: '1px solid #ced4da'
              }}>
                {selectedRecord.notes}
              </div>
            </div>
            <div>
              <strong>Prescriptions:</strong>
              <div style={{
                backgroundColor: 'white',
                padding: '1rem',
                borderRadius: '4px',
                marginTop: '0.5rem',
                border: '1px solid #ced4da'
              }}>
                {selectedRecord.prescriptions || 'No prescriptions'}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {records.length > 0 ? (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Patient</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Appointment Date</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Notes Preview</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map(record => (
                    <tr key={record.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                      <td style={{ padding: '1rem' }}>{record.patient_name}</td>
                      <td style={{ padding: '1rem' }}>
                        {new Date(record.appointment_date).toLocaleString()}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {record.notes_preview || 'No notes'}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <button
                          onClick={() => setSelectedRecord(record)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#17a2b8',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '2rem',
              borderRadius: '8px',
              textAlign: 'center',
              color: '#6c757d'
            }}>
              No medical records found. Records will appear here after you complete appointments.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
