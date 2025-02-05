
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { handleAuthError } from "@/utils/authUtils";
import { useNavigate } from "react-router-dom";

/**
 * Custom hook for managing authentication state
 * 
 * This hook provides functionality to:
 * - Track the current authentication session
 * - Handle session changes
 * - Manage loading state during authentication
 * - Handle authentication errors
 * 
 * @returns {Object} Hook state
 * @returns {Session | null} session - Current authentication session
 * @returns {boolean} loading - Whether authentication state is being loaded
 * @returns {Error | null} error - Any authentication error that occurred
 */
export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        handleAuthError(error).then(([shouldRedirect, errorMessage]) => {
          setError(new Error(errorMessage));
          if (shouldRedirect) {
            navigate("/auth");
          }
        });
      } else {
        setSession(session);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
      // Reset error when auth state changes successfully
      setError(null);
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, [navigate]);

  return { session, loading, error };
};
