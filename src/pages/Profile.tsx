import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Calendar, LogOut, User, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { UserBusinessProfiles } from "@/components/profile/UserBusinessProfiles";
import { UserFreelancerProfiles } from "@/components/profile/UserFreelancerProfiles";

interface Profile {
  email: string | null;
  created_at: string;
  username: string | null;
  phone_number: string | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [businessProfiles, setBusinessProfiles] = useState([]);
  const [freelancerProfiles, setFreelancerProfiles] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user) return;
      
      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('email, created_at, username, phone_number')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) throw profileError;
        
        setProfile(profileData);
        setUsername(profileData.username || "");
        setPhoneNumber(profileData.phone_number || "");

        // Fetch business profiles
        const { data: businessData, error: businessError } = await supabase
          .from('business_profiles')
          .select('*')
          .eq('owner_id', session.user.id);
        
        if (businessError) throw businessError;
        setBusinessProfiles(businessData);

        // Fetch freelancer profiles
        const { data: freelancerData, error: freelancerError } = await supabase
          .from('freelancer_profiles')
          .select('*')
          .eq('owner_id', session.user.id);
        
        if (freelancerError) throw freelancerError;
        setFreelancerProfiles(freelancerData);

      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load profile data");
      }
    };

    fetchData();
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
    
    if (profile) {
      setProfile({ ...profile, username });
    }
  };

  const handleUpdatePhoneNumber = async () => {
    if (!session?.user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ phone_number: phoneNumber })
      .eq('id', session.user.id);

    if (error) {
      toast.error("Failed to update phone number");
      return;
    }

    setIsEditingPhone(false);
    toast.success("Phone number updated successfully");
    
    if (profile) {
      setProfile({ ...profile, phone_number: phoneNumber });
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

        <Card className="bg-card">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center space-x-4">
              <User className="w-5 h-5 text-muted-foreground" />
              <div className="flex-grow">
                <p className="text-sm font-medium text-muted-foreground">Username</p>
                {isEditing ? (
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-background text-foreground"
                      placeholder="Enter username"
                    />
                    <Button 
                      onClick={handleUpdateUsername}
                      className="bg-accent hover:bg-accent/90"
                    >
                      Save
                    </Button>
                    <Button 
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <p className="text-foreground">{profile.username || 'No username set'}</p>
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

            <div className="flex items-center space-x-4">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-foreground">{profile.email || 'No email set'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <div className="flex-grow">
                <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                {isEditingPhone ? (
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="bg-background text-foreground"
                      placeholder="Enter phone number"
                      type="tel"
                    />
                    <Button 
                      onClick={handleUpdatePhoneNumber}
                      className="bg-accent hover:bg-accent/90"
                    >
                      Save
                    </Button>
                    <Button 
                      onClick={() => setIsEditingPhone(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <p className="text-foreground">{profile.phone_number || 'No phone number set'}</p>
                    <Button 
                      onClick={() => setIsEditingPhone(true)} 
                      variant="ghost" 
                      size="sm"
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                <p className="text-foreground">
                  {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <UserBusinessProfiles profiles={businessProfiles} />
          <UserFreelancerProfiles profiles={freelancerProfiles} />
        </div>

        <Button
          variant="default"
          className="w-full bg-accent hover:bg-accent/90"
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