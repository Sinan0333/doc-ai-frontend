import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

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
