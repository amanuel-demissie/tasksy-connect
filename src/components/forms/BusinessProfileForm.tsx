import { useState } from "react";
import { useForm } from "react-hook-form";
import { ServiceCategory, BusinessProfileFormData } from "@/types/profile";
import ImageUploadSection from "@/components/business/ImageUploadSection";
import BusinessDetailsSection from "@/components/business/BusinessDetailsSection";
import ServicesSection from "@/components/business/ServicesSection";
import { Button } from "@/components/ui/button";
import { useBusinessProfileSubmit } from "@/hooks/use-business-profile-submit";
import { useCameraCapture } from "@/hooks/use-camera-capture";
import { useBusinessServices } from "@/hooks/use-business-services";

/**
 * BusinessProfileForm Component
 * 
 * A comprehensive form component for creating and managing business profiles.
 * This component handles:
 * - Basic business information (name, description, category, address)
 * - Profile image upload (including camera capture functionality)
 * - Services management (adding and listing business services)
 * 
 * The form integrates with Supabase for data persistence and storage management.
 * It uses react-hook-form for form state management and validation.
 * 
 * @component
 * @example
 * ```tsx
 * <BusinessProfileForm onSuccess={() => console.log('Profile created!')} />
 * ```
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSuccess - Callback function called after successful profile creation
 */
export default function BusinessProfileForm({ onSuccess }: { onSuccess: () => void }) {
  // Form state management using react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm<BusinessProfileFormData>();
  
  // State for managing the selected business category
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>("beauty");
  
  // State for managing the profile image file
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Custom hooks for business profile functionality
  const { submitProfile } = useBusinessProfileSubmit(onSuccess);
  const { 
    showCamera, 
    setShowCamera, 
    videoRef, 
    startCamera, 
    capturePhoto, 
    stopCamera 
  } = useCameraCapture();
  const { 
    services, 
    newService, 
    setNewService, 
    addService 
  } = useBusinessServices();

  /**
   * Handles form submission
   * Processes the form data and uploads it to Supabase
   * 
   * @param {BusinessProfileFormData} data - Form data from react-hook-form
   */
  const onSubmit = async (data: BusinessProfileFormData) => {
    await submitProfile(data, imageFile, services);
  };

  /**
   * Handles photo capture from device camera
   * Processes the captured photo and updates the image file state
   */
  const handleCameraCapture = async () => {
    try {
      const file = await capturePhoto();
      setImageFile(file);
    } catch (error) {
      console.error("Error capturing photo:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <ImageUploadSection
        imageFile={imageFile}
        setImageFile={setImageFile}
        showCamera={showCamera}
        setShowCamera={setShowCamera}
        onCapturePhoto={handleCameraCapture}
        videoRef={videoRef}
      />

      <BusinessDetailsSection
        register={register}
        errors={errors}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <ServicesSection
        services={services}
        newService={newService}
        setNewService={setNewService}
        addService={addService}
      />

      <Button 
        type="submit"
        className="w-full bg-accent text-white hover:bg-accent/90"
      >
        Create Business Profile
      </Button>
    </form>
  );
}