
// Mock data structure matching backend models

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'patient' | 'doctor' | 'admin';
  phone?: string;
  date_joined: string;
  is_active: boolean;
}

export interface Patient {
  id: number;
  user: number;
  insurance_number: string;
  insurance_provider: string;
}

export interface Doctor {
  id: number;
  user: number;
  specialization: string;
  license_number: string;
}

export interface Appointment {
  id: number;
  patient: number;
  doctor: number;
  appointment_date: string;
  appointment_time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  created_at: string;
}

export interface Availability {
  id: number;
  doctor: number;
  day_of_week: number; // 0=Monday, 6=Sunday
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface Exception {
  id: number;
  doctor: number;
  date: string;
  is_available: boolean;
  reason?: string;
}

export interface MedicalRecord {
  id: number;
  patient: number;
  doctor: number;
  appointment?: number;
  diagnosis: string;
  notes: string;
  prescriptions: string;
  date_created: string;
}

// Mock data
export const mockUsers: User[] = [
  {
    id: 1,
    email: 'john.doe@email.com',
    first_name: 'John',
    last_name: 'Doe',
    role: 'patient',
    phone: '+1-555-0123',
    date_joined: '2024-01-15',
    is_active: true,
  },
  {
    id: 2,
    email: 'sarah.johnson@hospital.com',
    first_name: 'Dr. Sarah',
    last_name: 'Johnson',
    role: 'doctor',
    phone: '+1-555-0124',
    date_joined: '2023-06-10',
    is_active: true,
  },
  {
    id: 3,
    email: 'admin@hospital.com',
    first_name: 'Admin',
    last_name: 'User',
    role: 'admin',
    phone: '+1-555-0125',
    date_joined: '2023-01-01',
    is_active: true,
  },
  {
    id: 4,
    email: 'mike.brown@hospital.com',
    first_name: 'Dr. Mike',
    last_name: 'Brown',
    role: 'doctor',
    phone: '+1-555-0126',
    date_joined: '2023-08-15',
    is_active: true,
  },
  {
    id: 5,
    email: 'jane.smith@email.com',
    first_name: 'Jane',
    last_name: 'Smith',
    role: 'patient',
    phone: '+1-555-0127',
    date_joined: '2024-02-01',
    is_active: true,
  },
];

export const mockPatients: Patient[] = [
  {
    id: 1,
    user: 1,
    insurance_number: 'INS-123456789',
    insurance_provider: 'Blue Cross Blue Shield',
  },
  {
    id: 2,
    user: 5,
    insurance_number: 'INS-987654321',
    insurance_provider: 'Aetna Health',
  },
];

export const mockDoctors: Doctor[] = [
  {
    id: 1,
    user: 2,
    specialization: 'Cardiology',
    license_number: 'MD-12345',
  },
  {
    id: 2,
    user: 4,
    specialization: 'Dermatology',
    license_number: 'MD-67890',
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: 1,
    patient: 1,
    doctor: 1,
    appointment_date: '2024-07-15',
    appointment_time: '10:00',
    duration: 30,
    status: 'scheduled',
    notes: 'Regular checkup',
    created_at: '2024-07-08',
  },
  {
    id: 2,
    patient: 1,
    doctor: 1,
    appointment_date: '2024-06-20',
    appointment_time: '14:30',
    duration: 45,
    status: 'completed',
    notes: 'Follow-up consultation',
    created_at: '2024-06-15',
  },
  {
    id: 3,
    patient: 2,
    doctor: 2,
    appointment_date: '2024-07-12',
    appointment_time: '09:00',
    duration: 30,
    status: 'scheduled',
    created_at: '2024-07-05',
  },
];

export const mockAvailability: Availability[] = [
  {
    id: 1,
    doctor: 1,
    day_of_week: 1, // Monday
    start_time: '09:00',
    end_time: '17:00',
    is_available: true,
  },
  {
    id: 2,
    doctor: 1,
    day_of_week: 2, // Tuesday
    start_time: '09:00',
    end_time: '17:00',
    is_available: true,
  },
  {
    id: 3,
    doctor: 1,
    day_of_week: 3, // Wednesday
    start_time: '09:00',
    end_time: '17:00',
    is_available: true,
  },
  {
    id: 4,
    doctor: 2,
    day_of_week: 1, // Monday
    start_time: '10:00',
    end_time: '16:00',
    is_available: true,
  },
  {
    id: 5,
    doctor: 2,
    day_of_week: 4, // Thursday
    start_time: '10:00',
    end_time: '16:00',
    is_available: true,
  },
];

export const mockExceptions: Exception[] = [
  {
    id: 1,
    doctor: 1,
    date: '2024-07-20',
    is_available: false,
    reason: 'Medical conference',
  },
  {
    id: 2,
    doctor: 2,
    date: '2024-07-18',
    is_available: false,
    reason: 'Personal leave',
  },
];

export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: 1,
    patient: 1,
    doctor: 1,
    appointment: 2,
    diagnosis: 'Hypertension',
    notes: 'Patient presents with elevated blood pressure. Recommend lifestyle changes and medication.',
    prescriptions: 'Lisinopril 10mg daily, follow-up in 3 months',
    date_created: '2024-06-20',
  },
  {
    id: 2,
    patient: 2,
    doctor: 2,
    diagnosis: 'Acne',
    notes: 'Moderate acne on face and back. Prescribed topical treatment.',
    prescriptions: 'Tretinoin cream 0.025%, apply nightly',
    date_created: '2024-06-15',
  },
];
