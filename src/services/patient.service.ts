import api from '@/lib/api';

export interface PatientDashboard {
  totalReports: number;
  lastReportDate: string;
  riskAlerts: number;
  quickActions: string[];
}

export interface PatientDashboardResponse {
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
  dashboard: PatientDashboard;
}

interface ApiResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
  dashboard: PatientDashboard;
}

export const patientService = {
  // Get patient dashboard
  getDashboard: async (): Promise<PatientDashboardResponse> => {
    const response = await api.get<ApiResponse>('/patient/dashboard');
    // Extract user and dashboard from response
    return {
      user: response.data.user,
      dashboard: response.data.dashboard
    };
  },
};

