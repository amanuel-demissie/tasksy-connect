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
          <Route
            path="/auth"
            element={session ? <Navigate to="/" replace /> : <Auth />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }
          />
          <Route
            path="/explore"
            element={
              <ProtectedRoute>
                <Explore />
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
        </Routes>
        {session && <Navigation />}
      </div>
    </BrowserRouter>
  );
};