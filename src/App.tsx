import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PatientRegister from "./pages/patient/PatientRegister";
import PatientLogin from "./pages/patient/PatientLogin";
import PatientDashboard from "./pages/patient/PatientDashboard";
import UploadReport from "./pages/patient/UploadReport";
import History from "./pages/patient/History";
import DoctorLogin from "./pages/doctor/DoctorLogin";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Patient Routes */}
            <Route path="/patient/register" element={<PatientRegister />} />
            <Route path="/patient/login" element={<PatientLogin />} />
            <Route 
              path="/patient/dashboard" 
              element={
                <ProtectedRoute requiredRole="patient">
                  <PatientDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patient/upload" 
              element={
                <ProtectedRoute requiredRole="patient">
                  <UploadReport />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/patient/history" 
              element={
                <ProtectedRoute requiredRole="patient">
                  <History />
                </ProtectedRoute>
              } 
            />
            
            {/* Doctor Routes */}
            <Route path="/doctor/login" element={<DoctorLogin />} />
            <Route 
              path="/doctor/dashboard" 
              element={
                <ProtectedRoute requiredRole="doctor">
                  <DoctorDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect /patient and /doctor to their login pages */}
            <Route path="/patient" element={<Navigate to="/patient/login" replace />} />
            <Route path="/doctor" element={<Navigate to="/doctor/login" replace />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
