import React, { useState, useEffect } from 'react';
import PatientCard from './PatientCard';
import PatientForm from './PatientForm';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/patients', {
        credentials: "include",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }
      
      const data = await response.json();
      setPatients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePatient = async (patientData) => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/patients', {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(patientData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create patient');
      }
      
      await fetchPatients();
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdatePatient = async (patientData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/patients/${currentPatient.id}`, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(patientData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update patient');
      }
      
      await fetchPatients();
      setCurrentPatient(null);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeletePatient = async (patientId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/patients/${patientId}`, {
        method: 'DELETE',
        credentials: "include",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete patient');
      }
      
      await fetchPatients();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading patients...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Patients Management</h2>
        <button
          onClick={() => {
            setCurrentPatient(null);
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
          Add New Patient
        </button>
      </div>
      
      {showForm && (
        <PatientForm
          patient={currentPatient}
          onSubmit={currentPatient ? handleUpdatePatient : handleCreatePatient}
          onCancel={() => {
            setShowForm(false);
            setCurrentPatient(null);
          }}
        />
      )}
      
      {patients.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
          No patients found. Add a new patient to get started.
        </div>
      ) : (
        <div>
          {patients.map(patient => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onEdit={(patient) => {
                setCurrentPatient(patient);
                setShowForm(true);
              }}
              onDelete={handleDeletePatient}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientList;
