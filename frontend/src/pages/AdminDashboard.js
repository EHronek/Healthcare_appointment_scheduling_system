import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import DoctorList from '../components/DoctorList';
import PatientList from '../components/PatientList';
import UserList from '../components/UserList';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('doctors');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'doctors':
        return <DoctorList />;
      case 'patients':
        return <PatientList />;
      case 'users':
        return <UserList />;
      default:
        return <DoctorList />;
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>
      
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {renderTabContent()}
    </div>
  );
};

export default AdminDashboard;
