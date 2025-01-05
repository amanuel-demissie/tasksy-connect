/**
 * SignOutButton Component
 * 
 * A button component that handles user sign-out functionality.
 * Uses Supabase auth signOut method and provides feedback via toast notifications.
 * Redirects to the auth page after successful sign-out.
 * 
 * @component
 * @example
 * ```tsx
 * <SignOutButton />
 * ```
 */
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const SignOutButton = () => {
  const navigate = useNavigate();

  /**
   * Handles the sign-out process
   * Attempts to sign out the user and navigates to the auth page on success
   * Displays appropriate toast notifications for success/failure
   */
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  return (
    <Button
      variant="default"
      className="w-full bg-accent hover:bg-accent/90"
      onClick={handleSignOut}
    >
      <LogOut className="w-4 h-4 mr-2" />
      Sign Out
    </Button>
  );
};