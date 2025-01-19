import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { handleAuthError, initializeSession } from "@/utils/authUtils";

/**
 * Custom hook for managing authentication state
 * @returns Object containing session state and loading state
 */
export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { session: currentSession, error: sessionError } = await initializeSession();
        
        if (sessionError) {
          console.error("Error getting session:", sessionError.message);
          const [shouldRedirect, message] = await handleAuthError(sessionError);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: message,
          });
          if (shouldRedirect && location.pathname !== '/auth') {
            navigate('/auth');
          }
          return;
        }

        if (currentSession) {
          console.log("Initial session found");
          setSession(currentSession);
          if (location.pathname === '/auth') {
            navigate('/');
          }
        } else {
          console.log("No initial session found");
          if (location.pathname !== '/auth') {
            navigate('/auth');
          }
        }
      } catch (err) {
        console.error("Unexpected error during auth initialization:", err);
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth state changed:", event);
      
      switch (event) {
        case 'SIGNED_OUT':
          console.log('User signed out, clearing session');
          setSession(null);
          if (location.pathname !== '/auth') {
            navigate('/auth');
          }
          break;
        
        case 'SIGNED_IN':
          console.log('User signed in, updating session');
          if (newSession) {
            setSession(newSession);
            if (location.pathname === '/auth') {
              navigate('/');
            }
          }
          break;
        
        case 'TOKEN_REFRESHED':
          console.log('Token refreshed, updating session');
          if (newSession) {
            setSession(newSession);
          } else {
            const [shouldRedirect, message] = await handleAuthError({ 
              message: 'refresh_token_not_found' 
            });
            toast({
              variant: "destructive",
              title: "Session Error",
              description: message,
            });
            if (shouldRedirect && location.pathname !== '/auth') {
              navigate('/auth');
            }
          }
          break;
        
        case 'USER_UPDATED':
          console.log('User updated, checking session');
          if (newSession) {
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
  }, [toast, navigate, location.pathname]);

  return { session, loading };
};