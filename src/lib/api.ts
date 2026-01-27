import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

// API Base URL - adjust based on your backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<{ message?: string; errors?: any[] }>) => {
    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // Handle 401 - Unauthorized
    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // toast.error('Session expired. Please login again.');
      // Redirect to login will be handled by protected routes
      const currentPath = window.location.pathname
      if(currentPath !== '/doctor/login' && currentPath !== '/patient/login' && currentPath !== '/admin/login' && currentPath !== '/patient/register'){
        window.location.href = '/';
      }
      return Promise.reject(error);
    }

    // Handle validation errors (422)
    if (status === 422 && data.errors) {
      const errorMessages = data.errors.map((err: any) => err.msg || err.message).join(', ');
      toast.error(errorMessages || 'Validation error');
      return Promise.reject(error);
    }

    // Handle other errors
    const errorMessage = data?.message || error.message || 'An error occurred';
    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

export default api;

