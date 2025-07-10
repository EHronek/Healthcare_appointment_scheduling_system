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
    return apiRequest('GET', 'patients');
  },

  /**
   * Get patient by user ID
   * @param {string} userId - The user ID associated with the patient
   * @returns {Promise<Object>} Patient object
   */
  getPatientByUserId: async (userId) => {
    if (!userId) throw new Error('User ID is required');
    return apiRequest('GET', `patients/user/${userId}`);
  },

  /**
   * Get current patient profile (patient role required)
   * @returns {Promise<Object>} Patient object
   */
  getMyPatientProfile: async () => {
    return apiRequest('GET', 'patients/user/me');
  },

  /**
   * Get patient by ID
   * @param {string} patientId - The ID of the patient to retrieve
   * @returns {Promise<Object>} Patient object
   */
  getPatientById: async (patientId) => {
    if (!patientId) throw new Error('Patient ID is required');
    return apiRequest('GET', `patients/${patientId}`);
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

    return apiRequest('POST', 'patients', patientData);
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

    return apiRequest('PUT', `patients/${patientId}`, filteredData);
  },

  /**
   * Delete a patient
   * @param {string} patientId - The ID of the patient to delete
   * @returns {Promise<Object>} Confirmation message
   */
  deletePatient: async (patientId) => {
    if (!patientId) throw new Error('Patient ID is required');
    return apiRequest('DELETE', `patients/${patientId}`);
  },

  /**
   * Get all appointments for a patient
   * @param {string} patientId - The ID of the patient
   * @returns {Promise<Array>} Array of appointment objects
   */
  getPatientAppointments: async (patientId) => {
    if (!patientId) throw new Error('Patient ID is required');
    return apiRequest('GET', `patients/${patientId}/appointments`);
  }
};


// Export all services
export default {
  UserService,
  AuthService,
  PatientService,
  // You can add other services here later (AppointmentService, DoctorService, etc.)
};
