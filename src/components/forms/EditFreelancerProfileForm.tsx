import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import ImageUploadSection from "@/components/freelancer/ImageUploadSection";
import FreelancerDetailsSection from "@/components/freelancer/FreelancerDetailsSection";
import SkillsSection from "@/components/freelancer/SkillsSection";
import { useFreelancerProfile } from "@/hooks/use-freelancer-profile";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ServiceCategory } from "@/types/profile";
import { useForm } from "react-hook-form";

interface EditFreelancerProfileFormProps {
  profileId: string;
  initialData: {
    full_name: string;
    title: string;
    bio: string | null;
    category: ServiceCategory;
    hourly_rate: number | null;
    image_url: string | null;
  };
  initialSkills: string[];
  onSuccess: () => void;
  onClose: () => void;
}

export default function EditFreelancerProfileForm({ 
  profileId, 
  initialData, 
  initialSkills,
  onSuccess,
  onClose 
}: EditFreelancerProfileFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skills, setSkills] = useState<string[]>(initialSkills);
  const [newSkill, setNewSkill] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>(initialData.category);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullName: initialData.full_name,
      title: initialData.title,
      bio: initialData.bio || "",
      hourlyRate: initialData.hourly_rate || undefined,
    }
  });

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const onSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);

      let imageUrl = initialData.image_url;
      if (imageFile) {
        const sanitizedName = formData.fullName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `freelancer-profiles/${sanitizedName}-${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("business_profile_images")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;
        imageUrl = uploadData.path;
      }

      // Update freelancer profile
      const { error: profileError } = await supabase
        .from("freelancer_profiles")
        .update({
          full_name: formData.fullName,
          title: formData.title,
          bio: formData.bio,
          category: selectedCategory,
          hourly_rate: formData.hourlyRate,
          image_url: imageUrl,
        })
        .eq('id', profileId);

      if (profileError) throw profileError;

      // Handle skills update
      if (skills.length > 0) {
        // First, remove all existing skills
        const { error: deleteError } = await supabase
          .from("freelancer_skills")
          .delete()
          .eq('freelancer_id', profileId);

        if (deleteError) throw deleteError;

        // Then add new skills
        const { data: skillsData, error: skillsError } = await supabase
          .from("skills")
          .upsert(
            skills.map(skill => ({ name: skill })),
            { onConflict: "name" }
          )
          .select();

        if (skillsError) throw skillsError;

        // Link skills to freelancer
        const { error: linkError } = await supabase
          .from("freelancer_skills")
          .insert(
            skillsData.map(skill => ({
              freelancer_id: profileId,
              skill_id: skill.id,
            }))
          );

        if (linkError) throw linkError;
      }

      toast({
        title: "Success",
        description: "Freelancer profile updated successfully",
      });
      onSuccess();
    } catch (error) {
      console.error("Error updating freelancer profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update freelancer profile",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative pt-8">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute -top-2 right-0"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
        <ImageUploadSection
          imageFile={imageFile}
          setImageFile={setImageFile}
          showCamera={showCamera}
          setShowCamera={setShowCamera}
          videoRef={videoRef}
          currentImageUrl={initialData.image_url}
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
          onRemoveSkill={removeSkill}
        />

        <Button 
          type="submit"
          className="w-full bg-accent text-white hover:bg-accent/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating Profile...
            </>
          ) : (
            'Update Freelancer Profile'
          )}
        </Button>
      </form>
    </div>
  );
}