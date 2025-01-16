import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  session: Session | null;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error.message);
          await handleAuthError(error);
          return;
        }

        if (currentSession?.refresh_token) {
          console.log("Setting session with refresh token");
          setSession(currentSession);
        } else {
          console.log("No refresh token found, clearing session");
          await handleAuthError({ message: 'refresh_token_not_found' });
        }
      } catch (err) {
        console.error("Unexpected error during auth initialization:", err);
        await handleAuthError(err);
      } finally {
        setLoading(false);
      }
    };

    const handleAuthError = async (error: any) => {
      console.log("Handling auth error:", error.message);
      setSession(null);
      
      // Clear the session from storage
      await supabase.auth.signOut();
      
      if (error.message.includes('refresh_token_not_found')) {
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Your session has expired. Please sign in again.",
        });
        navigate('/auth');
      } else {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "There was a problem with your session. Please sign in again.",
        });
        navigate('/auth');
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth state changed:", event);
      
      switch (event) {
        case 'SIGNED_OUT':
          console.log('User signed out, clearing session');
          setSession(null);
          navigate('/auth');
          break;
        
        case 'SIGNED_IN':
          console.log('User signed in, updating session');
          if (newSession?.refresh_token) {
            setSession(newSession);
            navigate('/');
          }
          break;
        
        case 'TOKEN_REFRESHED':
          console.log('Token refreshed, updating session');
          if (newSession?.refresh_token) {
            setSession(newSession);
          } else {
            await handleAuthError({ message: 'refresh_token_not_found' });
          }
          break;
        
        case 'USER_UPDATED':
          console.log('User updated, checking session');
          if (newSession?.refresh_token) {
            setSession(newSession);
          }
          break;
      }
      
      setLoading(false);
    });

    // Initialize auth
    initializeAuth();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [toast, navigate]);

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