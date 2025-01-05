import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ServiceCategory } from "@/types/profile";
import ImageUploadSection from "@/components/freelancer/ImageUploadSection";
import FreelancerDetailsSection from "@/components/freelancer/FreelancerDetailsSection";
import SkillsSection from "@/components/freelancer/SkillsSection";

/**
 * Interface for freelancer profile form data
 */
interface FreelancerProfileFormData {
  fullName: string;
  title: string;
  bio: string;
  category: ServiceCategory;
  hourlyRate: number;
  skills: string[];
  image?: File;
}

/**
 * Form component for creating a freelancer profile
 * 
 * This component handles:
 * 1. Profile image upload and camera capture
 * 2. Basic freelancer information collection
 * 3. Skills management
 * 4. Form submission and data persistence
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Function} props.onSuccess - Callback function called after successful profile creation
 * @returns {JSX.Element} Rendered freelancer profile form
 */
export default function FreelancerProfileForm({ onSuccess }: { onSuccess: () => void }) {
  // Form state management using react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm<FreelancerProfileFormData>();
  const { toast } = useToast();

  // State for managing skills
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  // State for managing category selection
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>("beauty");

  // State and refs for image upload and camera functionality
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  /**
   * Handles form submission
   * Creates freelancer profile and associated skills in Supabase
   * 
   * @param {FreelancerProfileFormData} data - Form data
   */
  const onSubmit = async (data: FreelancerProfileFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let imageUrl = null;
      if (imageFile) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(`freelancer-profiles/${Date.now()}-${imageFile.name}`, imageFile);

        if (uploadError) throw uploadError;
        imageUrl = uploadData.path;
      }

      const { data: profile, error: profileError } = await supabase
        .from("freelancer_profiles")
        .insert({
          owner_id: user.id,
          full_name: data.fullName,
          title: data.title,
          bio: data.bio,
          category: selectedCategory,
          hourly_rate: data.hourlyRate,
          image_url: imageUrl,
        })
        .select()
        .single();

      if (profileError) throw profileError;

      if (skills.length > 0) {
        const { data: skillsData, error: skillsError } = await supabase
          .from("skills")
          .upsert(
            skills.map(skill => ({ name: skill })),
            { onConflict: "name" }
          )
          .select();

        if (skillsError) throw skillsError;

        const { error: linkError } = await supabase
          .from("freelancer_skills")
          .insert(
            skillsData.map(skill => ({
              freelancer_id: profile.id,
              skill_id: skill.id,
            }))
          );

        if (linkError) throw linkError;
      }

      toast({
        title: "Success",
        description: "Freelancer profile created successfully",
      });
      onSuccess();
    } catch (error) {
      console.error("Error creating freelancer profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create freelancer profile",
      });
    }
  };

  /**
   * Adds a new skill to the skills list
   * Validates that the skill is not empty and not already in the list
   */
  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <ImageUploadSection
        imageFile={imageFile}
        setImageFile={setImageFile}
        showCamera={showCamera}
        setShowCamera={setShowCamera}
        videoRef={videoRef}
      />

      <FreelancerDetailsSection
        register={register}
        errors={errors}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <SkillsSection
        skills={skills}
        newSkill={newSkill}
        setNewSkill={setNewSkill}
        addSkill={addSkill}
      />

      <Button 
        type="submit"
        className="w-full bg-accent text-white hover:bg-accent/90"
      >
        Create Freelancer Profile
      </Button>
    </form>
  );
}