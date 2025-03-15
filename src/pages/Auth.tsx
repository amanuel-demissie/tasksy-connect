
/**
 * Authentication Page Component
 * 
 * Handles user authentication using Supabase Auth UI.
 * Provides sign-in and sign-up functionality with a clean interface.
 * Automatically redirects authenticated users to the home page.
 * 
 * @component
 * @example
 * ```tsx
 * <AuthPage />
 * ```
 */
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for redirect parameters in URL (from email confirmation)
    const handleEmailConfirmation = async () => {
      const searchParams = new URLSearchParams(location.search);
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const type = searchParams.get('type');

      if (type === 'recovery' || type === 'signup' || accessToken) {
        setLoading(true);
        try {
          // If there are tokens in the URL, set the session with them
          if (accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            
            if (error) throw error;
            
            toast({
              title: type === 'recovery' ? "Password Updated" : "Email Confirmed",
              description: type === 'recovery' 
                ? "Your password has been updated successfully." 
                : "Your email has been confirmed. You are now signed in.",
              variant: "default",
            });
            
            navigate("/");
          }
        } catch (error) {
          console.error("Error during email confirmation:", error);
          toast({
            title: "Authentication Error",
            description: "There was a problem with your authentication. Please try signing in again.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    handleEmailConfirmation();
    
    /**
     * Sets up authentication state listener
     * Redirects user based on auth state changes
     */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          toast({
            title: "Welcome back!",
            description: "You are now signed in.",
          });
          navigate("/");
        }
        if (event === 'SIGNED_OUT') {
          navigate("/auth");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, location.search, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex flex-col items-center justify-center px-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-foreground">Verifying your account...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">Welcome to Connect</h2>
          <p className="mt-2 text-neutral-400">Sign in or create an account</p>
        </div>
        <div className="bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-sm border border-border">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#8989DE',
                    brandAccent: '#7676d9',
                    inputBackground: 'transparent',
                    inputText: 'white',
                    inputPlaceholder: 'gray',
                  },
                },
              },
              className: {
                container: 'text-foreground',
                label: 'text-foreground',
                button: 'bg-primary hover:bg-primary/90 text-primary-foreground',
                input: 'bg-background border-input',
              },
            }}
            providers={[]}
            redirectTo={window.location.origin + "/auth"}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
