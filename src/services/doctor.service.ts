import api from '@/lib/api';

export interface RecentPatient {
  id: string;
  name: string;
  lastReport: string;
}

export interface DoctorDashboard {
  totalPatients: number;
  pendingReports: number;
  abnormalCases: number;
  recentPatients: RecentPatient[];
  monthlyStats: any[];
  diagnosticStats: any[];
  priorityAlerts: any[];
}

export interface DoctorDashboardResponse {
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
  dashboard: DoctorDashboard;
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
  dashboard: DoctorDashboard;
}

export const doctorService = {
  // Get doctor dashboard
  getDashboard: async (): Promise<DoctorDashboardResponse> => {
    const response = await api.get<ApiResponse>('/doctor/dashboard');
    // Extract user and dashboard from response
    return {
      user: response.data.user,
      dashboard: response.data.dashboard
    };
  },

  // Get pending review count
  getPendingReviewCount: async (): Promise<number> => {
    const response = await api.get<{ success: boolean; count: number }>('/doctor/review-requests/count');
    return response.data.count;
  },
};

