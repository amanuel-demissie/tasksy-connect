
/**
 * Custom hook for managing freelancer profile form state and submission
 * 
 * Handles form state, validation, image upload, skills management,
 * and profile submission to Supabase.
 * 
 * @param {Function} onSuccess - Callback function executed after successful profile creation
 * @returns {Object} Form state and handlers
 */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ServiceCategory } from "@/types/profile";

/**
 * Interface for freelancer profile form data
 * @interface FreelancerProfileFormData
 */
interface FreelancerProfileFormData {
  /** Freelancer's full name */
  fullName: string;
  /** Professional title */
  title: string;
  /** Professional bio/description */
  bio: string;
  /** Service category */
  category: ServiceCategory;
  /** Hourly rate in currency units */
  hourlyRate: number;
  /** Array of skills */
  skills: string[];
  /** Optional profile image */
  image?: File;
}

export const useFreelancerProfile = (onSuccess: () => void) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FreelancerProfileFormData>();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>("beauty");
  const [imageFile, setImageFile] = useState<File | null>(null);

  /**
   * Handles form submission and profile creation
   * @param {FreelancerProfileFormData} data - Form data containing profile information
   */
  const onSubmit = async (data: FreelancerProfileFormData) => {
    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let imageUrl = null;
      if (imageFile) {
        const sanitizedName = data.fullName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `freelancer-profiles/${sanitizedName}-${Date.now()}.${fileExt}`;

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
   * Only adds if the skill is not empty and not already in the list
   */
  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  /**
   * Removes a skill from the skills list
   * @param {number} index - Index of the skill to remove
   */
  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  return {
    register,
    errors,
    handleSubmit,
    onSubmit,
    isSubmitting,
    skills,
    newSkill,
    setNewSkill,
    addSkill,
    removeSkill,
    selectedCategory,
    setSelectedCategory,
    imageFile,
    setImageFile,
  };
};
