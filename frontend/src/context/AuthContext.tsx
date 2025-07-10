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
  login: (email: string, password: string) => Promise<boolean>;
  signup: (first_name: string, last_name: string, email: string, password: string, role: 'patient' | 'doctor' | 'admin') => Promise<boolean>;
  logout: () => void;
  switchRole: (role: 'patient' | 'doctor' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: User[] = [
  {
    id: 1,
    email: 'patient@demo.com',
    first_name: 'John',
    last_name: 'Doe',
    role: 'patient',
    phone: '+1-555-0123',
    date_joined: '2024-01-15',
    is_active: true,
  },
  {
    id: 2,
    email: 'doctor@demo.com',
    first_name: 'Dr. Sarah',
    last_name: 'Johnson',
    role: 'doctor',
    phone: '+1-555-0124',
    date_joined: '2023-06-10',
    is_active: true,
  },
  {
    id: 3,
    email: 'admin@demo.com',
    first_name: 'Admin',
    last_name: 'User',
    role: 'admin',
    phone: '+1-555-0125',
    date_joined: '2023-01-01',
    is_active: true,
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login: find user by email (ignore password check for demo)
    const foundUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const signup = async (
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    role: 'patient' | 'doctor' | 'admin'
  ): Promise<boolean> => {
    // Mock signup: check if email exists
    const exists = mockUsers.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return false;

    // Create new user (mock id auto-increment)
    const newUser: User = {
      id: mockUsers.length + 1,
      email,
      first_name,
      last_name,
      role,
      date_joined: new Date().toISOString().split('T')[0],
      is_active: true,
    };

    mockUsers.push(newUser);
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: 'patient' | 'doctor' | 'admin') => {
    const foundUser = mockUsers.find((u) => u.role === role);
    if (foundUser) {
      setUser(foundUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
