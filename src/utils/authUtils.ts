
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/**
 * Handles authentication errors by clearing the session and showing appropriate messages
 * @param error - The error object from Supabase auth
 * @returns A tuple containing [shouldRedirect: boolean, errorMessage: string]
 */
export const handleAuthError = async (error: any): Promise<[boolean, string]> => {
  // Clear the session from storage
  await supabase.auth.signOut();
  
  if (error.message.includes('refresh_token_not_found') || 
      error.message.includes('Invalid Refresh Token')) {
    return [true, "Your session has expired. Please sign in again."];
  }
  
  return [true, "There was a problem with your session. Please sign in again."];
};

/**
 * Initializes the authentication session
 * @returns The current session if available
 */
export const initializeSession = async (): Promise<{
  session: Session | null;
  error: any;
}> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  } catch (error) {
    console.error("Error initializing session:", error);
    return { session: null, error };
  }
};
