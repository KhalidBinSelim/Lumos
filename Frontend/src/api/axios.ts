import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor - attach JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`📤 API Request [${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`, {
        data: config.data,
        headers: config.headers,
      });
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Success [${response.config.method?.toUpperCase()}] ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    // Enhanced error logging
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      responseData: error.response?.data,
      requestData: error.config?.data,
    });

    // Network error (backend not reachable)
    if (!error.response) {
      console.error('Network Error - Backend may not be running or CORS issue');
      return Promise.reject({
        message: 'Cannot connect to server. Please make sure the backend is running on http://localhost:5000',
        status: 0,
        data: null,
        isNetworkError: true,
      });
    }

    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Extract error message from response
    const message = error.response?.data?.message || error.message || 'An error occurred';
    
    return Promise.reject({
      message,
      status: error.response?.status,
      data: error.response?.data,
      isNetworkError: false,
    });
  }
);

export default api;

