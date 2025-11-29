import { useQuery } from '@tanstack/react-query';
import { doctorService } from '@/services/doctor.service';

export const useDoctorDashboard = () => {
  return useQuery({
    queryKey: ['doctor', 'dashboard'],
    queryFn: () => doctorService.getDashboard(),
    staleTime: 30000, // 30 seconds
    retry: 1,
  });
};

