import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import DemoNavigation from "@/components/DemoNavigation";
import LandingPage from "./pages/public/LandingPage";
import LoginPage from "./pages/public/LoginPage";
import OtpVerificationPage from "./pages/public/OtpVerificationPage";
import GoogleAuthCallback from "./pages/public/GoogleAuthCallback";
import PatientDashboardPage from "./pages/patient/PatientDashboardPage";
import FindDoctorPage from "./pages/patient/FindDoctorPage";
import BookAppointmentPage from "./pages/patient/BookAppointmentPage";
import AppointmentsHistoryPage from "./pages/patient/AppointmentsHistoryPage";
import PatientProfilePage from "./pages/patient/PatientProfilePage";
import DoctorDashboardPage from "./pages/doctor/DoctorDashboardPage";
import DoctorSchedulePage from "./pages/doctor/DoctorSchedulePage";
import SymptomaticAnalysisPage from "./pages/patient/SymptomaticAnalysisPage";
import DoctorConsultationPage from "./pages/doctor/DoctorConsultationPage";
import InventoryManagementPage from "./pages/pharmacy/InventoryManagementPage";
import MedicineApprovalRequestPage from "./pages/patient/MedicineApprovalRequestPage";
import MedicineApprovalDashboard from "./pages/doctor/MedicineApprovalDashboard";
import VitalsMetricsPage from "./pages/patient/VitalsMetricsPage";
import DailyMedsPage from "./pages/patient/DailyMedsPage";
import MedicalReportAnalyzerPage from "./pages/patient/MedicalReportAnalyzerPage";
import MedsAvailabilityPage from "./pages/patient/MedsAvailabilityPage";
import NotFound from "./pages/NotFound";
import "./lib/i18n";

const queryClient = new QueryClient();

const App = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  // Debug logging
  console.log('🏠 App render - Auth state:', { isAuthenticated, isLoading, user });

  if (isLoading) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            <span className="text-rural-lg text-muted-foreground">Loading Sehat Saathi...</span>
          </div>
        </div>
    );
  }

  return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <Toaster />
            <Sonner />
            <DemoNavigation />
            
            <Routes>
              {/* Public Routes - DEMO MODE: No redirects */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/otp-verification" element={<OtpVerificationPage />} />
              <Route path="/auth/callback" element={<GoogleAuthCallback />} />
              
              {/* Protected Patient Routes */}
              <Route path="/patient/dashboard" element={<ProtectedRoute allowedRoles={['patient']}><PatientDashboardPage /></ProtectedRoute>} />
              <Route path="/patient/find-doctor" element={<ProtectedRoute allowedRoles={['patient']}><FindDoctorPage /></ProtectedRoute>} />
              <Route path="/patient/book-appointment" element={<ProtectedRoute allowedRoles={['patient']}><BookAppointmentPage /></ProtectedRoute>} />
              <Route path="/patient/appointments" element={<ProtectedRoute allowedRoles={['patient']}><AppointmentsHistoryPage /></ProtectedRoute>} />
              <Route path="/patient/profile" element={<ProtectedRoute allowedRoles={['patient']}><PatientProfilePage /></ProtectedRoute>} />
              <Route path="/patient/symptomatic-analysis" element={<ProtectedRoute allowedRoles={['patient']}><SymptomaticAnalysisPage /></ProtectedRoute>} />
              <Route path="/patient/medicine-approval" element={<MedicineApprovalRequestPage />} />
              <Route path="/patient/vitals" element={<VitalsMetricsPage />} />
              <Route path="/patient/daily-meds" element={<DailyMedsPage />} />
              <Route path="/patient/report-analyzer" element={<MedicalReportAnalyzerPage />} />
              <Route path="/patient/meds-availability" element={<MedsAvailabilityPage />} />
              
              {/* Doctor Routes - DEMO MODE: No protection */}
              <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
              <Route path="/doctor/schedule" element={<DoctorSchedulePage />} />
              <Route path="/doctor/consultation" element={<DoctorConsultationPage />} />
              <Route path="/doctor/medicine-approval" element={<MedicineApprovalDashboard />} />
              
              {/* Pharmacy Routes - DEMO MODE: No protection */}
              <Route path="/pharmacy/inventory" element={<InventoryManagementPage />} />
              
              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
  );
};

export default App;