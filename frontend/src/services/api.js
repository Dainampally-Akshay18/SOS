import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token and request ID
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracking
    config.metadata = { startTime: new Date() };
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and logging
apiClient.interceptors.response.use(
  (response) => {
    // Log response time in development
    if (import.meta.env.DEV && response.config.metadata) {
      const duration = new Date() - response.config.metadata.startTime;
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`, {
        status: response.status,
        data: response.data
      });
    }

    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      console.error(`❌ API Error ${status}:`, data);

      // Handle authentication errors
      if (status === 401) {
        // Clear stored auth data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        // Redirect to login if not already there
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
      }

      // Handle forbidden access
      if (status === 403) {
        console.error('Access forbidden:', data.message);
      }

      // Handle server errors
      if (status >= 500) {
        console.error('Server error:', data.message);
      }

    } else if (error.request) {
      // Network error
      console.error('❌ Network error:', error.request);
    } else {
      // Something else happened
      console.error('❌ Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Helper function to extract error message
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Helper function to check if error is network related
export const isNetworkError = (error) => {
  return !error.response && error.request;
};

// Helper function to check if error is server error (5xx)
export const isServerError = (error) => {
  return error.response && error.response.status >= 500;
};

export default apiClient;
