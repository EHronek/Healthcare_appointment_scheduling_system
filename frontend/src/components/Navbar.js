import React from 'react';

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <div style={{
      display: 'flex',
      backgroundColor: '#2c3e50',
      padding: '1rem',
      color: 'white',
      marginBottom: '2rem'
    }}>
      <div 
        style={{
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          borderBottom: activeTab === 'doctors' ? '3px solid #3498db' : 'none'
        }}
        onClick={() => setActiveTab('doctors')}
      >
        Doctors
      </div>
      <div 
        style={{
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          borderBottom: activeTab === 'patients' ? '3px solid #3498db' : 'none'
        }}
        onClick={() => setActiveTab('patients')}
      >
        Patients
      </div>
      <div 
        style={{
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          borderBottom: activeTab === 'users' ? '3px solid #3498db' : 'none'
        }}
        onClick={() => setActiveTab('users')}
      >
        Users
      </div>
    </div>
  );
};

export default Navbar;
