import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService, RegisterData, LoginData } from '@/services/auth.service';
import { toast } from 'sonner';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Get current user from localStorage or API
  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (!storedUser || !token) {
        return null;
      }

      try {
        // Optionally verify token with backend
        const userData = JSON.parse(storedUser);
        return userData;
      } catch {
        return null;
      }
    },
    staleTime: Infinity,
    retry: false,
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      queryClient.setQueryData(['auth', 'user'], data.user);
      toast.success('Registration successful!');
      navigate('/patient/dashboard');
    },
    onError: (error: any) => {
      // Error is already handled by axios interceptor
      console.error('Registration error:', error);
    },
  });

  // Patient login mutation
  const loginPatientMutation = useMutation({
    mutationFn: (data: LoginData) => authService.loginPatient(data),
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      queryClient.setQueryData(['auth', 'user'], data.user);
      toast.success('Login successful!');
      navigate('/patient/dashboard');
    },
    onError: (error: any) => {
      // Error is already handled by axios interceptor
      console.error('Login error:', error);
    },
  });

  // Doctor login mutation
  const loginDoctorMutation = useMutation({
    mutationFn: (data: LoginData) => authService.loginDoctor(data),
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      queryClient.setQueryData(['auth', 'user'], data.user);
      toast.success('Login successful!');
      navigate('/doctor/dashboard');
    },
    onError: (error: any) => {
      // Error is already handled by axios interceptor
      console.error('Login error:', error);
    },
  });

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    queryClient.setQueryData(['auth', 'user'], null);
    queryClient.clear();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user,
    register: registerMutation.mutate,
    loginPatient: loginPatientMutation.mutate,
    loginDoctor: loginDoctorMutation.mutate,
    logout,
    isRegistering: registerMutation.isPending,
    isLoggingInPatient: loginPatientMutation.isPending,
    isLoggingInDoctor: loginDoctorMutation.isPending,
  };
};

