/**
 * Profile Page Component
 * 
 * Main profile page that displays user information and associated profiles.
 * Fetches and displays user details, business profiles, and freelancer profiles.
 * Provides functionality to manage user information and view associated profiles.
 * 
 * @component
 * @example
 * ```tsx
 * <Profile />
 * ```
 */
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { UserDetailsSection } from "@/components/profile/UserDetailsSection";
import { UserBusinessProfiles } from "@/components/profile/UserBusinessProfiles";
import { UserFreelancerProfiles } from "@/components/profile/UserFreelancerProfiles";
import { SignOutButton } from "@/components/profile/SignOutButton";

interface Profile {
  email: string | null;
  created_at: string;
  username: string | null;
  phone_number: string | null;
}

const Profile = () => {
  const { session } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [businessProfiles, setBusinessProfiles] = useState([]);
  const [freelancerProfiles, setFreelancerProfiles] = useState([]);
  
  useEffect(() => {
    /**
     * Fetches all profile-related data from Supabase
     * Includes user profile, business profiles, and freelancer profiles
     */
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

  // Show loading state while profile data is being fetched
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
        <ProfileHeader session={session} />
        <UserDetailsSection profile={profile} setProfile={setProfile} />
        
        <div className="space-y-8">
          <UserBusinessProfiles profiles={businessProfiles} />
          <UserFreelancerProfiles profiles={freelancerProfiles} />
        </div>

        <SignOutButton />
      </div>
    </div>
  );
};

export default Profile;