import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import Messages from "@/pages/Messages";
import Appointments from "@/pages/Appointments";
import Explore from "@/pages/Explore";
import BusinessProfile from "@/pages/BusinessProfile";
import FreelancerProfile from "@/pages/FreelancerProfile";
import EditBusinessProfileForm from "@/components/forms/EditBusinessProfileForm";

/**
 * AppRoutes Component
 * 
 * Defines the routing configuration for the application.
 * Handles protected and public routes.
 * 
 * @component
 * @returns {JSX.Element} Application routes configuration
 */
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <Appointments />
          </ProtectedRoute>
        }
      />
      <Route path="/explore" element={<Explore />} />
      <Route 
        path="/business-profile/:id" 
        element={<BusinessProfile />} 
      />
      <Route 
        path="/business-profile/:id/edit" 
        element={
          <ProtectedRoute>
            <EditBusinessProfileForm />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/freelancer-profile/:id" 
        element={<FreelancerProfile />} 
      />
    </Routes>
  );
};

export default AppRoutes;