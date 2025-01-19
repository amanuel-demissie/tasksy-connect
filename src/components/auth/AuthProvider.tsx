import { createContext, useContext } from "react";
import { Session } from "@supabase/supabase-js";
import { useAuthState } from "@/hooks/useAuthState";

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
  const { session, loading } = useAuthState();

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