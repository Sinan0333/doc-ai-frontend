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
import ReportComparison from "./pages/patient/ReportComparison";
import History from "./pages/patient/History";
import Profile from "./pages/patient/Profile";
import DoctorLogin from "./pages/doctor/DoctorLogin";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import PatientList from "./pages/doctor/PatientList";
import PatientHistory from "./pages/doctor/PatientHistory";
import ReviewRequests from "./pages/doctor/ReviewRequests";
import ReviewReport from "./pages/doctor/ReviewReport";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DoctorList from "./pages/admin/DoctorList";
import AdminPatientList from "./pages/admin/PatientList";
import AdminPatientHistory from "./pages/admin/AdminPatientHistory";
import AdminSettings from "./pages/admin/AdminSettings";
import DoctorActivity from "./pages/admin/DoctorActivity";
import { UnProtectedRoute } from "./components/UnProtectedRoute";

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
            <Route
              path="/patient/register"
              element={
                <UnProtectedRoute>
                  <PatientRegister />
                </UnProtectedRoute>
              }
            />
            <Route
              path="/patient/login"
              element={
                <UnProtectedRoute>
                  <PatientLogin />
                </UnProtectedRoute>
              }
            />
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
              path="/patient/comparison" 
              element={
                <ProtectedRoute requiredRole="patient">
                  <ReportComparison />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/patient/profile" 
              element={
                <ProtectedRoute requiredRole="patient">
                  <Profile />
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
            <Route
              path="/doctor/patients"
              element={
                <ProtectedRoute requiredRole="doctor">
                  <PatientList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/patients/:patientId/history"
              element={
                <ProtectedRoute requiredRole="doctor">
                  <PatientHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/review-requests"
              element={
                <ProtectedRoute requiredRole="doctor">
                  <ReviewRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/review-requests/:reportId/review"
              element={
                <ProtectedRoute requiredRole="doctor">
                  <ReviewReport />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/doctors"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DoctorList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/doctors/:doctorId/activity"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DoctorActivity />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/patients"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPatientList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/patients/:patientId/history"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPatientHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminSettings />
                </ProtectedRoute>
              }
            />

            {/* Redirect /patient and /doctor to their login pages */}
            <Route
              path="/patient"
              element={<Navigate to="/patient/login" replace />}
            />
            <Route
              path="/doctor"
              element={<Navigate to="/doctor/login" replace />}
            />
            <Route
              path="/admin"
              element={<Navigate to="/admin/login" replace />}
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
