import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/'

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Automatically attach token if available
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handler
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const errorMessage = error.response?.data?.error || error.message;
    console.error('API Error:', errorMessage);
    return Promise.reject(errorMessage);
  }
);

// Helper function to handle API requests
const apiRequest = async (method, endpoint, data = null, params = null) => {
  try {
    const response = await axiosInstance({
      method,
      url: endpoint,
      data,
      params
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


// AUTHENTICATION SERVICES
const AuthService = {
  /**
   * Login user with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} Response with tokens and user info
   */
  login: async (email, password) => {
    if (!email || !password) {
      throw new Error('Missing email or password');
    }
    
    const response = await apiRequest('POST', 'login-user', { email, password });
    
    // Store tokens in localStorage upon successful login
    if (response.access_token && response.refresh_token) {
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('refreshToken', response.refresh_token);
    }
    
    return response;
  },

  /**
   * Logout user by removing tokens from storage
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },

  /**
   * Get current authentication status
   * @returns {boolean} True if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};




// USER SERVICES
const UserService = {
  /**
   * Get all users (admin only)
   * @returns {Promise<Array>} Array of user objects
   */
  getAllUsers: async () => {
    return apiRequest('GET', 'api/v1/users');
  },

  /**
   * Get current user's profile
   * @returns {Promise<Object>} User object
   */
  getMyProfile: async () => {
    return apiRequest('GET', 'api/v1/users/me');
  },

  /**
   * Get user by ID
   * @param {string} userId - The ID of the user to retrieve
   * @returns {Promise<Object>} User object
   */
  getUserById: async (userId) => {
    return apiRequest('GET', `api/v1/users/${userId}`);
  },

  /**
   * Create a new user (admin only)
   * @param {Object} userData - User data to create
   * @param {string} userData.name - User's name
   * @param {string} userData.email - User's email
   * @param {string} userData.password - User's password
   * @param {string} userData.role - User's role (admin/doctor/patient)
   * @returns {Promise<Object>} Created user object
   */
  createUser: async (userData) => {
    const requiredFields = ['name', 'email', 'password', 'role'];
    const missingFields = requiredFields.filter(field => !userData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    if (!['admin', 'doctor', 'patient'].includes(userData.role)) {
      throw new Error('Invalid role. Must be admin, doctor, or patient');
    }
    
    return apiRequest('POST', 'api/v1/users', userData);
  },

  /**
   * Update a user
   * @param {string} userId - The ID of the user to update
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Object>} Updated user object
   */
  updateUser: async (userId, updateData) => {
    const allowedFields = ['name', 'email', 'password', 'role'];
    const filteredData = Object.keys(updateData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {});
    
    return apiRequest('PUT', `api/v1/users/${userId}`, filteredData);
  },

  /**
   * Delete a user
   * @param {string} userId - The ID of the user to delete
   * @returns {Promise<Object>} Confirmation message
   */
  deleteUser: async (userId) => {
    return apiRequest('DELETE', `api/v1/users/${userId}`);
  }
};


// PATIENT SERVICES
const PatientService = {
  /**
   * Get all patients (admin only)
   * @returns {Promise<Array>} Array of patient objects
   */
  getAllPatients: async () => {
    return apiRequest('GET', 'api/v1/patients');
  },

  /**
   * Get patient by user ID
   * @param {string} userId - The user ID associated with the patient
   * @returns {Promise<Object>} Patient object
   */
  getPatientByUserId: async (userId) => {
    if (!userId) throw new Error('User ID is required');
    return apiRequest('GET', `api/v1/patients/user/${userId}`);
  },

  /**
   * Get current patient profile (patient role required)
   * @returns {Promise<Object>} Patient object
   */
  getMyPatientProfile: async () => {
    return apiRequest('GET', 'api/v1/patients/user/me');
  },

  /**
   * Get patient by ID
   * @param {string} patientId - The ID of the patient to retrieve
   * @returns {Promise<Object>} Patient object
   */
  getPatientById: async (patientId) => {
    if (!patientId) throw new Error('Patient ID is required');
    return apiRequest('GET', `api/v1/patients/${patientId}`);
  },

  /**
   * Create a new patient
   * @param {Object} patientData - Patient data to create
   * @param {string} patientData.first_name - Patient's first name
   * @param {string} patientData.last_name - Patient's last name
   * @param {string} patientData.email - Patient's email
   * @param {string} patientData.phone_number - Patient's phone number
   * @param {string} patientData.insurance_number - Patient's insurance number
   * @param {string} patientData.insurance_provider - Patient's insurance provider
   * @returns {Promise<Object>} Created patient object
   */
  createPatient: async (patientData) => {
    const requiredFields = [
      'first_name', 
      'last_name', 
      'email', 
      'phone_number', 
      'insurance_number'
    ];
    
    const missingFields = requiredFields.filter(field => !patientData[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(patientData.email)) {
      throw new Error('Invalid email format');
    }

    return apiRequest('POST', 'api/v1/patients', patientData);
  },

  /**
   * Update a patient
   * @param {string} patientId - The ID of the patient to update
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Object>} Updated patient object
   */
  updatePatient: async (patientId, updateData) => {
    if (!patientId) throw new Error('Patient ID is required');
    
    const allowedFields = [
      'first_name',
      'last_name',
      'email',
      'phone_number',
      'insurance_number',
      'insurance_provider'
    ];
    
    const filteredData = Object.keys(updateData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {});

    return apiRequest('PUT', `api/v1/patients/${patientId}`, filteredData);
  },

  /**
   * Delete a patient
   * @param {string} patientId - The ID of the patient to delete
   * @returns {Promise<Object>} Confirmation message
   */
  deletePatient: async (patientId) => {
    if (!patientId) throw new Error('Patient ID is required');
    return apiRequest('DELETE', `api/v1/patients/${patientId}`);
  },

  /**
   * Get all appointments for a patient
   * @param {string} patientId - The ID of the patient
   * @returns {Promise<Array>} Array of appointment objects
   */
  getPatientAppointments: async (patientId) => {
    if (!patientId) throw new Error('Patient ID is required');
    return apiRequest('GET', `api/v1/patients/${patientId}/appointments`);
  }
};


// DOCTOR SERVICES
const DoctorService = {
  /**
   * Get all doctors (admin only)
   * @returns {Promise<Array>} Array of doctor objects
   */
  getAllDoctors: async () => {
    return apiRequest('GET', 'api/v1/doctors');
  },

  /**
   * Get doctor by ID
   * @param {string} doctorId - The ID of the doctor to retrieve
   * @returns {Promise<Object>} Doctor object
   */
  getDoctorById: async (doctorId) => {
    if (!doctorId) throw new Error('Doctor ID is required');
    return apiRequest('GET', `api/v1/doctors/${doctorId}`);
  },

  /**
   * Get doctor by user ID
   * @param {string} userId - The user ID associated with the doctor
   * @returns {Promise<Object>} Doctor object
   */
  getDoctorByUserId: async (userId) => {
    if (!userId) throw new Error('User ID is required');
    return apiRequest('GET', `api/v1/doctors/user/${userId}`);
  },

  /**
   * Get current doctor profile (doctor role required)
   * @returns {Promise<Object>} Doctor object
   */
  getMyDoctorProfile: async () => {
    return apiRequest('GET', 'api/v1/doctors/user/me');
  },

  /**
   * Create a new doctor (admin only)
   * @param {Object} doctorData - Doctor data to create
   * @param {string} doctorData.first_name - Doctor's first name
   * @param {string} doctorData.last_name - Doctor's last name
   * @param {string} doctorData.email - Doctor's email
   * @param {string} doctorData.specialization - Doctor's specialization
   * @param {string} doctorData.user_id - Associated user ID
   * @returns {Promise<Object>} Created doctor object
   */
  createDoctor: async (doctorData) => {
    const requiredFields = [
      'first_name',
      'last_name',
      'email',
      'specialization',
      'user_id'
    ];
    
    const missingFields = requiredFields.filter(field => !doctorData[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(doctorData.email)) {
      throw new Error('Invalid email format');
    }

    return apiRequest('POST', 'api/v1/doctors', doctorData);
  },

  /**
   * Update a doctor
   * @param {string} doctorId - The ID of the doctor to update
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Object>} Updated doctor object
   */
  updateDoctor: async (doctorId, updateData) => {
    if (!doctorId) throw new Error('Doctor ID is required');
    
    const allowedFields = [
      'first_name',
      'last_name',
      'email',
      'specialization',
      'user_id'
    ];
    
    const filteredData = Object.keys(updateData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {});

    return apiRequest('PUT', `api/v1/doctors/${doctorId}`, filteredData);
  },

  /**
   * Delete a doctor (admin only)
   * @param {string} doctorId - The ID of the doctor to delete
   * @returns {Promise<Object>} Confirmation message
   */
  deleteDoctor: async (doctorId) => {
    if (!doctorId) throw new Error('Doctor ID is required');
    return apiRequest('DELETE', `api/v1/doctors/${doctorId}`);
  },

  /**
   * Get doctor availabilities
   * @param {string} doctorId - The ID of the doctor
   * @returns {Promise<Array>} Array of availability objects
   */
  getDoctorAvailabilities: async (doctorId) => {
    if (!doctorId) throw new Error('Doctor ID is required');
    return apiRequest('GET', `api/v1/doctors/${doctorId}/availabilities`);
  },

  /**
   * Get doctor appointments
   * @param {string} doctorId - The ID of the doctor
   * @returns {Promise<Array>} Array of appointment objects
   */
  getDoctorAppointments: async (doctorId) => {
    if (!doctorId) throw new Error('Doctor ID is required');
    return apiRequest('GET', `api/v1/doctors/${doctorId}/appointments`);
  },

  /**
   * Get doctor exceptions
   * @param {string} doctorId - The ID of the doctor
   * @returns {Promise<Array>} Array of exception objects
   */
  getDoctorExceptions: async (doctorId) => {
    if (!doctorId) throw new Error('Doctor ID is required');
    return apiRequest('GET', `api/v1/doctors/${doctorId}/exceptions`);
  },

  /**
   * Get doctor medical records
   * @param {string} doctorId - The ID of the doctor
   * @returns {Promise<Array>} Array of medical record objects
   */
  getDoctorMedicalRecords: async (doctorId) => {
    if (!doctorId) throw new Error('Doctor ID is required');
    return apiRequest('GET', `api/v1/doctors/${doctorId}/medical_records`);
  }
};




// APPOINTMENT SERVICES
const AppointmentService = {
  /**
   * Create a new appointment (patient role required)
   * @param {Object} appointmentData - Appointment data
   * @param {string} appointmentData.doctor_id - Doctor ID
   * @param {string} appointmentData.scheduled_time - ISO 8601 datetime string
   * @param {number} appointmentData.duration - Duration in minutes
   * @returns {Promise<Object>} Created appointment
   */
  createAppointment: async (appointmentData) => {
    const requiredFields = ['doctor_id', 'scheduled_time', 'duration'];
    const missingFields = requiredFields.filter(field => !appointmentData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    try {
      // Validate datetime format
      new Date(appointmentData.scheduled_time);
    } catch (e) {
      throw new Error('Invalid date format. Use ISO 8601 format');
    }

    if (typeof appointmentData.duration !== 'number' || appointmentData.duration <= 0) {
      throw new Error('Duration must be a positive number');
    }

    return apiRequest('POST', 'api/v1/appointments', appointmentData);
  },

  /**
   * Get appointment by ID
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise<Object>} Appointment details
   */
  getAppointment: async (appointmentId) => {
    if (!appointmentId) throw new Error('Appointment ID is required');
    return apiRequest('GET', `api/v1/appointments/${appointmentId}`);
  },

  /**
   * Get all appointments (filtered by current user role)
   * @returns {Promise<Array>} List of appointments
   */
  getAppointments: async () => {
    return apiRequest('GET', 'api/v1/appointments');
  },

  /**
   * Cancel an appointment
   * @param {string} appointmentId - Appointment ID to cancel
   * @returns {Promise<Object>} Confirmation message
   */
  cancelAppointment: async (appointmentId) => {
    if (!appointmentId) throw new Error('Appointment ID is required');
    return apiRequest('PUT', `api/v1/appointments/${appointmentId}/cancel`);
  },

  /**
   * Complete an appointment (doctor role required)
   * @param {string} appointmentId - Appointment ID to complete
   * @returns {Promise<Object>} Confirmation message
   */
  completeAppointment: async (appointmentId) => {
    if (!appointmentId) throw new Error('Appointment ID is required');
    return apiRequest('PUT', `api/v1/appointments/${appointmentId}/complete`);
  },

  /**
   * Get available time slots for a doctor
   * @param {string} doctorId - Doctor ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise<Array>} Available time slots
   */
  getAvailableSlots: async (doctorId, date) => {
    if (!doctorId || !date) {
      throw new Error('Doctor ID and date are required');
    }
    return apiRequest('GET', 'api/v1/appointments/available_slots', null, { doctor_id: doctorId, date });
  }
};

// EXCEPTION SERVICES
const ExceptionService = {
  /**
   * Get all exceptions
   * @returns {Promise<Array>} List of exceptions
   */
  getAllExceptions: async () => {
    return apiRequest('GET', 'api/v1/exceptions');
  },

  /**
   * Get exception by ID
   * @param {string} exceptionId - Exception ID
   * @returns {Promise<Object>} Exception details
   */
  getException: async (exceptionId) => {
    if (!exceptionId) throw new Error('Exception ID is required');
    return apiRequest('GET', `api/v1/exceptions/${exceptionId}`);
  },

  /**
   * Create a new exception (admin/doctor role required)
   * @param {Object} exceptionData - Exception data
   * @param {string} exceptionData.doctor_id - Doctor ID
   * @param {string} exceptionData.date - Date in YYYY-MM-DD format
   * @param {boolean} exceptionData.is_available - Availability status
   * @returns {Promise<Object>} Created exception
   */
  createException: async (exceptionData) => {
    const requiredFields = ['doctor_id', 'date', 'is_available'];
    const missingFields = requiredFields.filter(field => !exceptionData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    return apiRequest('POST', 'api/v1/exceptions', exceptionData);
  },

  /**
   * Update an exception (admin/doctor role required)
   * @param {string} exceptionId - Exception ID to update
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Object>} Updated exception
   */
  updateException: async (exceptionId, updateData) => {
    if (!exceptionId) throw new Error('Exception ID is required');
    return apiRequest('PUT', `api/v1/exceptions/${exceptionId}`, updateData);
  },

  /**
   * Delete an exception (admin/doctor role required)
   * @param {string} exceptionId - Exception ID to delete
   * @returns {Promise<Object>} Confirmation message
   */
  deleteException: async (exceptionId) => {
    if (!exceptionId) throw new Error('Exception ID is required');
    return apiRequest('DELETE', `api/v1/exceptions/${exceptionId}`);
  }
};

// AVAILABILITY SERVICES
const AvailabilityService = {
  /**
   * Get all availabilities
   * @returns {Promise<Array>} List of availabilities
   */
  getAllAvailabilities: async () => {
    return apiRequest('GET', 'api/v1/availabilities');
  },

  /**
   * Get availability by ID
   * @param {string} availabilityId - Availability ID
   * @returns {Promise<Object>} Availability details
   */
  getAvailability: async (availabilityId) => {
    if (!availabilityId) throw new Error('Availability ID is required');
    return apiRequest('GET', `api/v1/availabilities/${availabilityId}`);
  },

  /**
   * Create new availability (admin/doctor role required)
   * @param {Object} availabilityData - Availability data
   * @param {string} availabilityData.doctor_id - Doctor ID
   * @param {string} availabilityData.day_of_week - Day of week (e.g., "Monday")
   * @param {string} availabilityData.start_time - Start time in HH:MM:SS format
   * @param {string} availabilityData.end_time - End time in HH:MM:SS format
   * @returns {Promise<Object>} Created availability
   */
  createAvailability: async (availabilityData) => {
    const requiredFields = ['doctor_id', 'day_of_week', 'start_time', 'end_time'];
    const missingFields = requiredFields.filter(field => !availabilityData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    return apiRequest('POST', 'api/v1/availabilities', availabilityData);
  },

  /**
   * Update availability (admin/doctor role required)
   * @param {string} availabilityId - Availability ID to update
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Object>} Updated availability
   */
  updateAvailability: async (availabilityId, updateData) => {
    if (!availabilityId) throw new Error('Availability ID is required');
    return apiRequest('PUT', `api/v1/availabilities/${availabilityId}`, updateData);
  },

  /**
   * Delete availability (admin/doctor role required)
   * @param {string} availabilityId - Availability ID to delete
   * @returns {Promise<Object>} Confirmation message
   */
  deleteAvailability: async (availabilityId) => {
    if (!availabilityId) throw new Error('Availability ID is required');
    return apiRequest('DELETE', `api/v1/availabilities/${availabilityId}`);
  }
};

// MEDICAL RECORD SERVICES
const MedicalRecordService = {
  /**
   * Create medical record (doctor/admin role required)
   * @param {Object} recordData - Medical record data
   * @param {string} recordData.appointment_id - Appointment ID
   * @param {string} recordData.patient_id - Patient ID
   * @param {string} recordData.notes - Doctor's notes
   * @param {string} [recordData.prescriptions] - Prescriptions (optional)
   * @returns {Promise<Object>} Created medical record
   */
  createMedicalRecord: async (recordData) => {
    const requiredFields = ['appointment_id', 'patient_id', 'notes'];
    const missingFields = requiredFields.filter(field => !recordData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    return apiRequest('POST', 'api/v1/medical-records', recordData);
  },

  /**
   * Get medical record by ID
   * @param {string} recordId - Medical record ID
   * @returns {Promise<Object>} Medical record details
   */
  getMedicalRecord: async (recordId) => {
    if (!recordId) throw new Error('Record ID is required');
    return apiRequest('GET', `api/v1/medical-records/${recordId}`);
  },

  /**
   * Update medical record (doctor role required)
   * @param {string} recordId - Record ID to update
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Object>} Updated medical record
   */
  updateMedicalRecord: async (recordId, updateData) => {
    if (!recordId) throw new Error('Record ID is required');
    return apiRequest('PUT', `api/v1/medical-record/${recordId}`, updateData);
  },

  /**
   * Delete medical record (admin role required)
   * @param {string} recordId - Record ID to delete
   * @returns {Promise<Object>} Confirmation message
   */
  deleteMedicalRecord: async (recordId) => {
    if (!recordId) throw new Error('Record ID is required');
    return apiRequest('DELETE', `api/v1/medical-records/${recordId}`);
  },

  /**
   * Get medical records for a patient
   * @param {string} patientId - Patient ID
   * @returns {Promise<Array>} List of medical records
   */
  getPatientRecords: async (patientId) => {
    if (!patientId) throw new Error('Patient ID is required');
    return apiRequest('GET', `api/v1/medical-records/patient/${patientId}`);
  },

  /**
   * Get medical record for an appointment
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise<Object>} Medical record details
   */
  getAppointmentRecord: async (appointmentId) => {
    if (!appointmentId) throw new Error('Appointment ID is required');
    return apiRequest('GET', `api/v1/medical-records/appointments/${appointmentId}`);
  }
};



// Export all services
export default {
  UserService,
  AuthService,
  PatientService,
  DoctorService,
  AppointmentService,
  ExceptionService,
  AvailabilityService,
  MedicalRecordService,
  // You can add other services here later (AppointmentService, DoctorService, etc.)
};
