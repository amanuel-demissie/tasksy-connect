import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import Navigation from "./Navigation";
import Index from "@/pages/Index";
import Explore from "@/pages/Explore";
import Appointments from "@/pages/Appointments";
import Profile from "@/pages/Profile";
import Messages from "@/pages/Messages";
import Auth from "@/pages/Auth";
import { useAuth } from "./auth/AuthProvider";

export const AppRoutes = () => {
  const { session } = useAuth();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-secondary">
        <Routes>
          {/* Auth route */}
          <Route
            path="/auth"
            element={session ? <Navigate to="/" replace /> : <Auth />}
          />
          
          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div className="pb-16">
                  <Index />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/explore"
            element={
              <ProtectedRoute>
                <div className="pb-16">
                  <Explore />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <div className="pb-16">
                  <Appointments />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <div className="pb-16">
                  <Profile />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <div className="pb-16">
                  <Messages />
                </div>
              </ProtectedRoute>
            }
          />

          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {session && <Navigation />}
      </div>
    </BrowserRouter>
  );
};