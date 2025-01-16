import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ServiceCategory } from "@/types/profile";
import ImageUploadSection from "@/components/freelancer/ImageUploadSection";
import FreelancerDetailsSection from "@/components/freelancer/FreelancerDetailsSection";
import SkillsSection from "@/components/freelancer/SkillsSection";
import { Loader2 } from "lucide-react";

/**
 * Interface defining the structure of the freelancer profile form data
 * @interface
 * @property {string} fullName - The full name of the freelancer
 * @property {string} title - Professional title or role
 * @property {string} bio - Detailed description of experience and background
 * @property {ServiceCategory} category - Type of service provided
 * @property {number} hourlyRate - Hourly rate for services
 * @property {string[]} skills - Array of skills possessed by the freelancer
 * @property {File} [image] - Optional profile image file
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
 * FreelancerProfileForm Component
 * 
 * A comprehensive form component for creating and managing freelancer profiles.
 * Handles image upload, basic information collection, skills management,
 * and profile data persistence in Supabase.
 * 
 * Features:
 * - Profile image upload with camera capture option
 * - Basic freelancer information collection
 * - Dynamic skills management
 * - Form validation and error handling
 * - Loading state management during submission
 * - Supabase integration for data persistence
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Function} props.onSuccess - Callback function executed after successful profile creation
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

  // State for managing form submission loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handles form submission
   * Creates freelancer profile and associated skills in Supabase
   * 
   * Process:
   * 1. Uploads profile image to Supabase storage if provided
   * 2. Creates freelancer profile record
   * 3. Creates and links skills to the profile
   * 4. Handles success/error notifications
   * 
   * @param {FreelancerProfileFormData} data - Form data containing profile information
   */
  const onSubmit = async (data: FreelancerProfileFormData) => {
    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let imageUrl = null;
      if (imageFile) {
        // Generate a sanitized filename
        const sanitizedName = data.fullName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `freelancer-profiles/${sanitizedName}-${Date.now()}.${fileExt}`;

        // Upload to business_profile_images bucket instead of avatars
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("business_profile_images")
          .upload(fileName, imageFile);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Adds a new skill to the skills list
   * Validates that the skill is not empty and not already in the list
   * Prevents duplicate skills and maintains the skills state
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
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Profile...
          </>
        ) : (
          'Create Freelancer Profile'
        )}
      </Button>
    </form>
  );
}