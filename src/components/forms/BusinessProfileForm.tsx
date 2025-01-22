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
import { Loader2 } from "lucide-react";

/**
 * BusinessProfileForm Component
 * 
 * A comprehensive form component for creating and managing business profiles.
 * This component integrates multiple features including image upload, business details,
 * and services management into a cohesive form interface.
 * 
 * Features:
 * - Image upload with camera capture functionality
 * - Business details input (name, description, category, address)
 * - Services management (add/delete/list business services)
 * - Loading state management during form submission
 * - Form validation using react-hook-form
 * 
 * The component uses several custom hooks:
 * - useBusinessProfileSubmit: Handles the profile creation logic
 * - useCameraCapture: Manages device camera functionality
 * - useBusinessServices: Manages the services state and operations
 * 
 * @component
 * @param {Object} props - Component props
 * @param {() => void} props.onSuccess - Callback function executed after successful profile creation
 * 
 * @example
 * ```tsx
 * <BusinessProfileForm onSuccess={() => {
 *   console.log('Profile created successfully');
 *   // Handle post-creation navigation or UI updates
 * }} />
 * ```
 */
export default function BusinessProfileForm({ onSuccess }: { onSuccess: () => void }) {
  // Form state management using react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm<BusinessProfileFormData>();
  
  // State management for form data and UI
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>("beauty");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    addService,
    deleteService 
  } = useBusinessServices();

  /**
   * Handles form submission
   * Processes the form data and creates a new business profile
   * 
   * @param {BusinessProfileFormData} data - Form data collected from inputs
   */
  const onSubmit = async (data: BusinessProfileFormData) => {
    try {
      setIsSubmitting(true);
      const formData = {
        ...data,
        category: selectedCategory
      };
      await submitProfile(formData, imageFile, services);
    } finally {
      setIsSubmitting(false);
    }
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
        onDeleteService={deleteService}
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
          'Create Business Profile'
        )}
      </Button>
    </form>
  );
}