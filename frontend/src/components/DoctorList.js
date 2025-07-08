import React, { useState, useEffect } from 'react';
import DoctorCard from './DoctorCard';
import DoctorForm from './DoctorForm';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/doctors', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      
      const data = await response.json();
      setDoctors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDoctor = async (doctorData) => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/doctors', {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(doctorData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create doctor');
      }
      
      await fetchDoctors();
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateDoctor = async (doctorData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/doctors/${currentDoctor.id}`, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(doctorData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update doctor');
      }
      
      await fetchDoctors();
      setCurrentDoctor(null);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/doctors/${doctorId}`, {
        method: 'DELETE',
        credentials: "include",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete doctor');
      }
      
      await fetchDoctors();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading doctors...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Doctors Management</h2>
        <button
          onClick={() => {
            setCurrentDoctor(null);
            setShowForm(true);
          }}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add New Doctor
        </button>
      </div>
      
      {showForm && (
        <DoctorForm
          doctor={currentDoctor}
          onSubmit={currentDoctor ? handleUpdateDoctor : handleCreateDoctor}
          onCancel={() => {
            setShowForm(false);
            setCurrentDoctor(null);
          }}
        />
      )}
      
      {doctors.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
          No doctors found. Add a new doctor to get started.
        </div>
      ) : (
        <div>
          {doctors.map(doctor => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onEdit={(doctor) => {
                setCurrentDoctor(doctor);
                setShowForm(true);
              }}
              onDelete={handleDeleteDoctor}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorList;