import React from 'react';

const UserCard = ({ user, onEdit, onDelete }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>
          {user.name} ({user.role})
        </h3>
        <p style={{ margin: '0.25rem 0', color: '#6c757d' }}>
          <strong>Email:</strong> {user.email}
        </p>
        <p style={{ margin: '0.25rem 0', color: '#6c757d' }}>
          <strong>ID:</strong> {user.id}
        </p>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => onEdit(user)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(user.id)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default UserCard;
