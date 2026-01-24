import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["adminDashboard"],
    queryFn: async () => {
      const response = await api.get("/admin/dashboard");
      return response.data;
    },
  });
};

export const useDoctors = (page = 1, limit = 10, search = "") => {
  return useQuery({
    queryKey: ["doctors", page, limit, search],
    queryFn: async () => {
      const response = await api.get(`/admin/doctors?page=${page}&limit=${limit}&search=${search}`);
      return response.data;
    },
  });
};

export const useAddDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (doctorData: any) => {
      const response = await api.post("/admin/doctors", doctorData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      toast.success("Doctor added successfully");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to add doctor";
      toast.error(message);
    }
  });
};

export const useDoctorActivity = (doctorId: string, page = 1) => {
  return useQuery({
    queryKey: ["doctorActivity", doctorId, page],
    queryFn: async () => {
      const response = await api.get(`/admin/doctors/${doctorId}/activity?page=${page}`);
      return response.data;
    },
    enabled: !!doctorId,
  });
};

export const useAdminPatients = (page = 1, limit = 10, search = "") => {
  return useQuery({
    queryKey: ["adminPatients", page, limit, search],
    queryFn: async () => {
      const response = await api.get(`/admin/patients?page=${page}&limit=${limit}&search=${search}`);
      return response.data;
    },
  });
};
