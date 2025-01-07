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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize auth state and set up session
    const initializeAuth = async () => {
      try {
        // Get the current session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error.message);
          // Clear session and show error toast
          setSession(null);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "There was a problem with your session. Please sign in again.",
          });
          
          // Attempt to sign out to clean up any invalid session data
          await supabase.auth.signOut();
        } else {
          setSession(currentSession);
        }
      } catch (err) {
        console.error("Unexpected error during auth initialization:", err);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    // Call initialization
    initializeAuth();

    // Set up real-time subscription to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing session');
        setSession(null);
      } else if (event === 'SIGNED_IN') {
        console.log('User signed in, updating session');
        setSession(newSession);
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
        setSession(newSession);
      }
      
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  // Show loading state while initializing
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