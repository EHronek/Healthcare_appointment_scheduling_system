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

// Export all services
export default {
  UserService,
  AuthService,
  // You can add other services here later (AppointmentService, DoctorService, etc.)
};
