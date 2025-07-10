
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'patient' | 'doctor' | 'admin';
  phone?: string;
  date_joined: string;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  switchRole: (role: 'patient' | 'doctor' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo purposes
const mockUsers = {
  patient: {
    id: 1,
    email: 'patient@demo.com',
    first_name: 'John',
    last_name: 'Doe',
    role: 'patient' as const,
    phone: '+1-555-0123',
    date_joined: '2024-01-15',
    is_active: true,
  },
  doctor: {
    id: 2,
    email: 'doctor@demo.com',
    first_name: 'Dr. Sarah',
    last_name: 'Johnson',
    role: 'doctor' as const,
    phone: '+1-555-0124',
    date_joined: '2023-06-10',
    is_active: true,
  },
  admin: {
    id: 3,
    email: 'admin@demo.com',
    first_name: 'Admin',
    last_name: 'User',
    role: 'admin' as const,
    phone: '+1-555-0125',
    date_joined: '2023-01-01',
    is_active: true,
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUsers.patient);

  const login = (email: string, password: string) => {
    // Mock login - in real app, this would call API
    console.log('Login attempt:', email, password);
    setUser(mockUsers.patient);
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: 'patient' | 'doctor' | 'admin') => {
    setUser(mockUsers[role]);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
