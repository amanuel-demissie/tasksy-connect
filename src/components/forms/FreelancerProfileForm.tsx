import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ImageUploadSection from "@/components/freelancer/ImageUploadSection";
import FreelancerDetailsSection from "@/components/freelancer/FreelancerDetailsSection";
import SkillsSection from "@/components/freelancer/SkillsSection";
import { useFreelancerProfile } from "@/hooks/use-freelancer-profile";

/**
 * FreelancerProfileForm Component
 * 
 * A comprehensive form component for creating and managing freelancer profiles.
 * Handles image upload, basic information collection, skills management,
 * and profile data persistence in Supabase.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {Function} props.onSuccess - Callback function executed after successful profile creation
 * @returns {JSX.Element} Rendered freelancer profile form
 */
export default function FreelancerProfileForm({ onSuccess }: { onSuccess: () => void }) {
  const {
    register,
    errors,
    handleSubmit,
    onSubmit,
    isSubmitting,
    skills,
    newSkill,
    setNewSkill,
    addSkill,
    selectedCategory,
    setSelectedCategory,
    imageFile,
    setImageFile,
  } = useFreelancerProfile(onSuccess);

  // State and refs for camera functionality
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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