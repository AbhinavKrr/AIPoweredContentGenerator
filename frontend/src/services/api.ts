import axios from 'axios';
import { getToken } from '../utils/token';

// Define the base URL for the API
const API_URL = '/'; // Use relative path for proxying to backend

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // You could redirect to login page or dispatch a logout action
      console.error('Authentication error');
    }
    return Promise.reject(error);
  }
);

export default api;