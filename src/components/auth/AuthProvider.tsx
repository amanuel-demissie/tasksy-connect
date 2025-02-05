
import { createContext, useContext } from "react";
import { Session } from "@supabase/supabase-js";
import { useAuthState } from "@/hooks/useAuthState";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

/**
 * Context for sharing authentication state throughout the application
 */
interface AuthContextType {
  session: Session | null;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
});

/**
 * Hook for accessing authentication context
 * @throws Error if used outside of AuthProvider
 * @returns AuthContextType containing the current session
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * Provider component for authentication state
 * Manages user sessions and authentication flow
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { session, loading, error } = useAuthState();

  // Handle authentication errors
  if (error) {
    if (error.message.includes('refresh_token_not_found')) {
      // Handle expired sessions
      toast.error("Your session has expired. Please sign in again.");
      navigate("/auth");
      return null;
    }
    
    // Handle other authentication errors
    toast.error("Authentication error. Please try signing in again.");
    navigate("/auth");
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ session }}>
      {children}
    </AuthContext.Provider>
  );
};
