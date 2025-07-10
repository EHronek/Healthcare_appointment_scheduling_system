
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Navigation } from "./components/Navigation";
import Index from "./pages/Index";
import PatientDashboard from "./pages/patient/PatientDashboard";
import BookAppointment from "./pages/patient/BookAppointment";
import PatientMedicalRecords from "./pages/patient/PatientMedicalRecords";
import PatientProfile from "./pages/patient/PatientProfile";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAvailability from "./pages/doctor/DoctorAvailability";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorMedicalRecords from "./pages/doctor/DoctorMedicalRecords";
import DoctorExceptions from "./pages/doctor/DoctorExceptions";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDoctors from "./pages/admin/AdminDoctors";
import AdminPatients from "./pages/admin/AdminPatients";
import AdminAppointments from "./pages/admin/AdminAppointments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="container mx-auto px-4 py-6">
              <Routes>
                <Route path="/" element={<Index />} />
                
                {/* Patient Routes */}
                <Route path="/patient/dashboard" element={<PatientDashboard />} />
                <Route path="/patient/book-appointment" element={<BookAppointment />} />
                <Route path="/patient/medical-records" element={<PatientMedicalRecords />} />
                <Route path="/patient/profile" element={<PatientProfile />} />
                
                {/* Doctor Routes */}
                <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
                <Route path="/doctor/availability" element={<DoctorAvailability />} />
                <Route path="/doctor/appointments" element={<DoctorAppointments />} />
                <Route path="/doctor/medical-records" element={<DoctorMedicalRecords />} />
                <Route path="/doctor/exceptions" element={<DoctorExceptions />} />
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/doctors" element={<AdminDoctors />} />
                <Route path="/admin/patients" element={<AdminPatients />} />
                <Route path="/admin/appointments" element={<AdminAppointments />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
