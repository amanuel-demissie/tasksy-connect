import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../auth/AuthProvider";

/**
 * SignOutButton Component
 * 
 * A button component that handles user sign-out functionality.
 * Matches the styling of the BusinessProfileForm buttons for visual consistency.
 * 
 * Features:
 * - Handles sign-out process with proper error handling
 * - Shows toast messages for success/failure states
 * - Redirects to auth page after sign-out
 * - Maintains consistent styling with other form buttons
 * 
 * @component
 */
export const SignOutButton = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  /**
   * Handles the sign-out process
   * Attempts to sign out the user and redirects to auth page
   * Shows appropriate toast messages for success/failure
   */
  const handleSignOut = async () => {
    try {
      // First check if we have a session
      if (!session) {
        console.log("No active session found, redirecting to auth page");
        navigate("/auth");
        return;
      }

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        // If we get a session_not_found error, we should still redirect to auth
        if (error.message.includes("session_not_found")) {
          console.log("Session not found, but proceeding with local sign out");
          navigate("/auth");
          return;
        }
        
        // For other errors, show the error message
        console.error("Sign out error:", error);
        toast.error("Error signing out: " + error.message);
        return;
      }

      // Success case
      navigate("/auth");
      toast.success("Signed out successfully");
      
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
      toast.error("An unexpected error occurred while signing out");
      // Still redirect to auth page in case of errors
      navigate("/auth");
    }
  };

  return (
    <Button 
      onClick={handleSignOut}
      className="w-full bg-accent text-white hover:bg-accent/90"
    >
      Sign Out
    </Button>
  );
};