import api from '@/lib/api';

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  address?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  phone?: string;
  gender?: string;
  age?: number;
  address?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  user?: User;
  token?: string;
}

export const authService = {
  // Register patient
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    // Handle both old and new response formats
    if (response.data.user && response.data.token) {
      return { user: response.data.user, token: response.data.token };
    }
    return response.data as AuthResponse;
  },

  // Patient login
  loginPatient: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/patient-login', data);
    // Handle both old and new response formats
    if (response.data.user && response.data.token) {
      return { user: response.data.user, token: response.data.token };
    }
    return response.data as AuthResponse;
  },

  // Doctor login
  loginDoctor: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/doctor-login', data);
    // Handle both old and new response formats
    if (response.data.user && response.data.token) {
      return { user: response.data.user, token: response.data.token };
    }
    return response.data as AuthResponse;
  },

  // Admin login
  loginAdmin: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/admin-login', data);
    if (response.data.user && response.data.token) {
      return { user: response.data.user, token: response.data.token };
    }
    return response.data as AuthResponse;
  },

  // Get current user (for session restore)
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data || response.data as unknown as User;
  },
};

