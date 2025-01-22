import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/**
 * Custom hook for managing authentication state
 * 
 * This hook provides functionality to:
 * - Track the current authentication session
 * - Handle session changes
 * - Manage loading state during authentication
 * 
 * @example
 * ```tsx
 * const { session, loading } = useAuthState();
 * 
 * if (loading) {
 *   return <div>Loading...</div>;
 * }
 * 
 * return session ? <AuthenticatedApp /> : <LoginScreen />;
 * ```
 * 
 * @returns {Object} Hook state
 * @returns {Session | null} session - Current authentication session
 * @returns {boolean} loading - Whether authentication state is being loaded
 */
export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, []);

  return { session, loading };
};