import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Calendar, LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";

interface Profile {
  email: string;
  created_at: string;
  username: string | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('email, created_at, username')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
        return;
      }
      
      setProfile(data);
      setUsername(data.username || "");
    };

    fetchProfile();
  }, [session]);

  const handleUpdateUsername = async () => {
    if (!session?.user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ username })
      .eq('id', session.user.id);

    if (error) {
      toast.error("Failed to update username");
      return;
    }

    setIsEditing(false);
    toast.success("Username updated successfully");
    
    // Update local profile state
    if (profile) {
      setProfile({ ...profile, username });
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-primary">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary pb-20">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Profile header with avatar */}
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={session?.user?.user_metadata?.avatar_url} />
            <AvatarFallback>
              {session?.user?.email?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-semibold text-primary">
            Profile
          </h1>
        </div>

        {/* Profile information card */}
        <Card className="bg-neutral-100">
          <CardContent className="p-6 space-y-6">
            {/* Username section */}
            <div className="flex items-center space-x-4">
              <User className="w-5 h-5 text-neutral-500" />
              <div className="flex-grow">
                <p className="text-sm font-medium text-neutral-500">Username</p>
                {isEditing ? (
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-white text-neutral-900"
                      placeholder="Enter username"
                    />
                    <Button onClick={handleUpdateUsername} variant="default">Save</Button>
                    <Button onClick={() => setIsEditing(false)} variant="outline">Cancel</Button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <p className="text-neutral-900">{profile.username || 'No username set'}</p>
                    <Button 
                      onClick={() => setIsEditing(true)} 
                      variant="ghost" 
                      size="sm"
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Email information */}
            <div className="flex items-center space-x-4">
              <Mail className="w-5 h-5 text-neutral-500" />
              <div>
                <p className="text-sm font-medium text-neutral-500">Email</p>
                <p className="text-neutral-900">{profile.email}</p>
              </div>
            </div>
            
            {/* Member since information */}
            <div className="flex items-center space-x-4">
              <Calendar className="w-5 h-5 text-neutral-500" />
              <div>
                <p className="text-sm font-medium text-neutral-500">Member Since</p>
                <p className="text-neutral-900">
                  {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sign out button */}
        <Button
          variant="outline"
          className="w-full bg-white text-neutral-900 hover:bg-neutral-100"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Profile;