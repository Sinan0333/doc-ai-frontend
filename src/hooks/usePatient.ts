import { useQuery } from '@tanstack/react-query';
import { patientService } from '@/services/patient.service';

export const usePatientDashboard = () => {
  return useQuery({
    queryKey: ['patient', 'dashboard'],
    queryFn: () => patientService.getDashboard(),
    staleTime: 30000, // 30 seconds
    retry: 1,
  });
};

