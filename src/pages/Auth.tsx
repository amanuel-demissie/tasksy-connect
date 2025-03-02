
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
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    /**
     * Sets up authentication state listener
     * Redirects user based on auth state changes
     */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          navigate("/");
        }
        if (event === 'SIGNED_OUT') {
          navigate("/auth");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

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
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
