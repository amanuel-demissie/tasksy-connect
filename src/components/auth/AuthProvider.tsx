import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Context for managing authentication state throughout the application
 * Provides the current session object to child components
 */
const AuthContext = createContext<{ session: Session | null }>({ session: null });

/**
 * Custom hook to access the authentication context
 * @returns The current authentication session
 */
export const useAuth = () => useContext(AuthContext);

/**
 * Authentication Provider component that manages user sessions
 * 
 * This component:
 * 1. Initializes and maintains the authentication state
 * 2. Handles session retrieval and management
 * 3. Provides real-time auth state updates through Supabase subscription
 * 4. Shows loading state while initializing
 * 
 * @param children - Child components that will have access to auth context
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Track the current authentication session
  const [session, setSession] = useState<Session | null>(null);
  // Loading state for initial auth check
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    /**
     * Initialize authentication state and set up session
     * Handles error cases and updates session state
     */
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error.message);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "There was a problem with your session. Please sign in again.",
          });
          setSession(null);
          await supabase.auth.signOut();
        } else {
          setSession(currentSession);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    /**
     * Set up real-time subscription to auth state changes
     * Updates session state when auth events occur (sign in, sign out, token refresh)
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      console.log("Auth state changed:", _event);
      if (_event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }
      setSession(newSession);
      setLoading(false);
    });

    // Cleanup subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  // Show loading state while initializing auth
  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ session }}>
      {children}
    </AuthContext.Provider>
  );
};