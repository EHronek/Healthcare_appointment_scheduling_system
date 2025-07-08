import React, { useState, useEffect } from 'react';
import UserCard from './UserCard';
import UserForm from './UserForm';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
      
      await fetchUsers();
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      
      await fetchUsers();
      setCurrentUser(null);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      await fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>User Management</h2>
        <button
          onClick={() => {
            setCurrentUser(null);
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
          Add New User
        </button>
      </div>
      
      {showForm && (
        <UserForm
          user={currentUser}
          onSubmit={currentUser ? handleUpdateUser : handleCreateUser}
          onCancel={() => {
            setShowForm(false);
            setCurrentUser(null);
          }}
        />
      )}
      
      {users.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
          No users found. Add a new user to get started.
        </div>
      ) : (
        <div>
          {users.map(user => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={(user) => {
                setCurrentUser(user);
                setShowForm(true);
              }}
              onDelete={handleDeleteUser}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;
