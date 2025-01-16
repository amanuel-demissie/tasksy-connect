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

interface FreelancerProfileFormData {
  fullName: string;
  title: string;
  bio: string;
  category: ServiceCategory;
  hourlyRate: number;
  skills: string[];
  image?: File;
}

export default function FreelancerProfileForm({ onSuccess }: { onSuccess: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<FreelancerProfileFormData>();
  const { toast } = useToast();
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>("beauty");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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