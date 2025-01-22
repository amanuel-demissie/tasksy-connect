import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { ServiceCategory, BusinessProfileFormData } from "@/types/profile";
import ImageUploadSection from "@/components/business/ImageUploadSection";
import BusinessDetailsSection from "@/components/business/BusinessDetailsSection";
import ServicesSection from "@/components/business/ServicesSection";
import { Button } from "@/components/ui/button";
import { useBusinessProfileSubmit } from "@/hooks/use-business-profile-submit";
import { useCameraCapture } from "@/hooks/use-camera-capture";
import { useBusinessServices } from "@/hooks/use-business-services";
import { Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getImageUrl } from "@/utils/imageUtils";

/**
 * EditBusinessProfileForm Component
 * 
 * A comprehensive form component for editing existing business profiles.
 * This component handles the complete lifecycle of editing a business profile including:
 * - Fetching existing profile data
 * - Image management (upload/update)
 * - Business details editing
 * - Services management
 * - Form validation and submission
 * - Error handling and user feedback
 * 
 * The component uses several custom hooks for different functionalities:
 * - useForm: For form state and validation
 * - useBusinessProfileSubmit: For profile update logic
 * - useCameraCapture: For handling camera functionality
 * - useBusinessServices: For managing services state
 * 
 * @component
 * @example
 * ```tsx
 * <EditBusinessProfileForm />
 * ```
 */
export default function EditBusinessProfileForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<BusinessProfileFormData>();
  
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>("beauty");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  
  const { submitProfile } = useBusinessProfileSubmit(() => {
    toast({
      title: "Success",
      description: "Business profile updated successfully",
    });
    navigate("/profile");
  });

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
    setServices,
    newService, 
    setNewService, 
    addService 
  } = useBusinessServices();

  /**
   * Fetches the business profile data when the component mounts
   * or when the profile ID changes.
   * 
   * This effect:
   * 1. Validates the presence of an ID
   * 2. Fetches profile data from Supabase
   * 3. Handles error cases and notFound states
   * 4. Populates the form with existing data
   */
  useEffect(() => {
    const fetchBusinessProfile = async () => {
      if (!id) return;

      const { data: profile, error } = await supabase
        .from("business_profiles")
        .select(`
          *,
          business_services (
            id,
            name,
            description,
            price
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching business profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch business profile",
        });
        return;
      }

      if (!profile) {
        setNotFound(true);
        toast({
          variant: "destructive",
          title: "Not Found",
          description: "Business profile not found",
        });
        return;
      }

      setValue("name", profile.name);
      setValue("description", profile.description || "");
      setValue("address", profile.address || "");
      setSelectedCategory(profile.category as ServiceCategory);
      setCurrentImageUrl(profile.image_url);
      setServices(profile.business_services || []);
    };

    fetchBusinessProfile();
  }, [id, setValue, toast]);

  /**
   * Handles form submission for updating the business profile
   * 
   * @param {BusinessProfileFormData} data - The form data to be submitted
   * @returns {Promise<void>}
   */
  const onSubmit = async (data: BusinessProfileFormData) => {
    if (!id) return;

    try {
      setIsSubmitting(true);
      const formData = {
        ...data,
        category: selectedCategory
      };

      // If no new image is uploaded, pass the current image URL
      const imageToSubmit = imageFile || (currentImageUrl ? new URL(getImageUrl(currentImageUrl)) : null);
      
      await submitProfile(formData, imageToSubmit as File | null, services, id);
    } catch (error) {
      console.error("Error updating business profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update business profile",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles photo capture from the device camera
   * Processes the captured photo and updates the image file state
   * 
   * @returns {Promise<void>}
   */
  const handleCameraCapture = async () => {
    try {
      const file = await capturePhoto();
      setImageFile(file);
    } catch (error) {
      console.error("Error capturing photo:", error);
    }
  };

  /**
   * Handles navigation back to the profile page
   */
  const handleExit = () => {
    navigate("/profile");
  };

  if (notFound) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Business Profile Not Found</h2>
        <p className="text-gray-600 mb-4">The business profile you're looking for doesn't exist or has been deleted.</p>
        <Button onClick={handleExit}>Return to Profile</Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 z-10"
        onClick={handleExit}
        aria-label="Exit form"
      >
        <X className="h-4 w-4" />
      </Button>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <ImageUploadSection
          imageFile={imageFile}
          setImageFile={setImageFile}
          showCamera={showCamera}
          setShowCamera={setShowCamera}
          onCapturePhoto={handleCameraCapture}
          videoRef={videoRef}
          currentImageUrl={currentImageUrl}
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
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating Profile...
            </>
          ) : (
            'Update Business Profile'
          )}
        </Button>
      </form>
    </div>
  );
}