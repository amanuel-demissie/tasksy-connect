import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  session: Session | null;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
});

/**
 * Custom hook to access auth context
 * @returns AuthContextType
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * AuthProvider component that manages authentication state
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