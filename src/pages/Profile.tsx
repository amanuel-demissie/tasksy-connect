
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

/**
 * Interface for user profile data
 * @interface Profile
 */
interface Profile {
  /** User's email address */
  email: string | null;
  /** Account creation timestamp */
  created_at: string;
  /** User's chosen username */
  username: string | null;
  /** User's phone number */
  phone_number: string | null;
}

const Profile = () => {
  const { session } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [businessProfiles, setBusinessProfiles] = useState([]);
  const [freelancerProfiles, setFreelancerProfiles] = useState([]);
  
  /**
   * Fetches business profiles associated with the current user
   * @async
   */
  const fetchBusinessProfiles = async () => {
    if (!session?.user) return;
    
    try {
      const { data: businessData, error: businessError } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('owner_id', session.user.id);
      
      if (businessError) throw businessError;
      setBusinessProfiles(businessData || []);
    } catch (error) {
      console.error("Error fetching business profiles:", error);
      toast.error("Failed to load business profiles");
    }
  };

  /**
   * Fetches freelancer profiles associated with the current user
   * @async
   */
  const fetchFreelancerProfiles = async () => {
    if (!session?.user) return;
    
    try {
      const { data: freelancerData, error: freelancerError } = await supabase
        .from('freelancer_profiles')
        .select('*')
        .eq('owner_id', session.user.id);
      
      if (freelancerError) throw freelancerError;
      setFreelancerProfiles(freelancerData || []);
    } catch (error) {
      console.error("Error fetching freelancer profiles:", error);
      toast.error("Failed to load freelancer profiles");
    }
  };

  /**
   * Fetches the user's basic profile information
   * @async
   */
  const fetchUserProfile = async () => {
    if (!session?.user) return;
    
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('email, created_at, username, phone_number')
        .eq('id', session.user.id)
        .single();
      
      if (profileError) throw profileError;
      setProfile(profileData);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to load profile data");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchUserProfile(),
        fetchBusinessProfiles(),
        fetchFreelancerProfiles()
      ]);
    };

    fetchData();
  }, [session]);

  /**
   * Handles the successful deletion of a business profile
   * Refreshes the business profiles list
   * @async
   */
  const handleBusinessProfileDeleted = async () => {
    await fetchBusinessProfiles();
  };

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
          <UserBusinessProfiles 
            profiles={businessProfiles} 
            onProfileDeleted={handleBusinessProfileDeleted}
          />
          <UserFreelancerProfiles profiles={freelancerProfiles} />
        </div>

        <SignOutButton />
      </div>
    </div>
  );
};

export default Profile;
