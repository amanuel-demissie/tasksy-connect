import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import EditFreelancerProfileForm from '@/components/forms/EditFreelancerProfileForm';
import { useToast } from "@/hooks/use-toast";

const FreelancerProfile = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<any>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch profile data
        const { data: profile, error: profileError } = await supabase
          .from('freelancer_profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (profileError) throw profileError;

        // Fetch skills
        const { data: skillsData, error: skillsError } = await supabase
          .from('freelancer_skills')
          .select('skills(name)')
          .eq('freelancer_id', id);

        if (skillsError) throw skillsError;

        setProfileData(profile);
        setSkills(skillsData.map(s => s.skills.name));
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load freelancer profile",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  const handleSuccess = () => {
    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profileData) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Edit Freelancer Profile</h1>
      <EditFreelancerProfileForm
        profileId={id!}
        initialData={profileData}
        initialSkills={skills}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default FreelancerProfile;