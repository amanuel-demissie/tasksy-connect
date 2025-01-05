import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const SignOutButton = () => {
  const navigate = useNavigate();

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