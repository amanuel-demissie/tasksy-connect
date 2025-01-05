import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AuthContext = createContext<{ session: Session | null }>({ session: null });
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const createProfileIfNeeded = async (userId: string) => {
    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select()
        .eq('id', userId)
        .single();

      if (!existingProfile) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({ id: userId });

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error ensuring profile exists:', error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error.message);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "There was a problem with your session. Please sign in again.",
          });
          setSession(null);
          await supabase.auth.signOut();
        } else {
          if (currentSession?.user) {
            await createProfileIfNeeded(currentSession.user.id);
          }
          setSession(currentSession);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      console.log("Auth state changed:", _event);
      if (_event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }
      if (_event === 'SIGNED_IN' && newSession?.user) {
        await createProfileIfNeeded(newSession.user.id);
      }
      setSession(newSession);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ session }}>
      {children}
    </AuthContext.Provider>
  );
};