
/**
 * @file EditBusinessProfileForm.tsx
 * @description Form component for editing an existing business profile.
 */

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { useCameraCapture } from "@/hooks/use-camera-capture";
import { useBusinessServices } from "@/hooks/use-business-services";
import { useBusinessProfileForm } from "@/hooks/use-business-profile-form";
import { BusinessProfileFormContent } from "@/components/business/BusinessProfileFormContent";
import { NotFoundState } from "./NotFoundState";

/**
 * EditBusinessProfileForm Component
 * 
 * @component
 * @description
 * Provides a form interface for editing an existing business profile.
 * Handles loading existing profile data, image management, services,
 * availability, and form submission. Uses several custom hooks for
 * managing different aspects of the form state and operations.
 * 
 * Key features:
 * - Loads and displays existing profile data
 * - Handles image upload and camera capture
 * - Manages services list
 * - Handles availability settings
 * - Provides form validation
 * - Handles profile updates
 * - Manages employees
 * 
 * @returns {JSX.Element} Rendered edit form
 */
export default function EditBusinessProfileForm() {
  const { id } = useParams();
  const {
    register,
    errors,
    handleSubmit,
    onSubmit,
    selectedCategory,
    setSelectedCategory,
    imageFile,
    setImageFile,
    currentImageUrl,
    isSubmitting,
    notFound,
    handleExit,
    fetchProfile,
    setAvailability,
    setBlockedDates,
    availability,
    blockedDates,
    services: formServices,
    setServices: setFormServices,
  } = useBusinessProfileForm(id!);

  const { 
    showCamera, 
    setShowCamera, 
    videoRef, 
    capturePhoto 
  } = useCameraCapture();

  const { 
    services: hookServices,
    newService, 
    setNewService, 
    addService,
    deleteService,
    fetchServices
  } = useBusinessServices(id!);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      await fetchProfile();
      await fetchServices();
    };

    fetchData();
  }, [id]);

  // Synchronize services between hooks
  useEffect(() => {
    console.log("Synchronizing services from useBusinessServices to form:", hookServices);
    setFormServices(hookServices);
  }, [hookServices, setFormServices]);

  const handleCameraCapture = async () => {
    try {
      const file = await capturePhoto();
      setImageFile(file);
    } catch (error) {
      console.error("Error capturing photo:", error);
    }
  };

  const handleServiceDelete = (index: number, serviceId?: string) => {
    deleteService(index, serviceId, true);
  };

  const handleServiceAdd = () => {
    addService(formServices.length, undefined, true);
  };

  const handleAvailabilityChange = (newAvailability: any[]) => {
    setAvailability(newAvailability);
  };

  const handleBlockedDatesChange = (newBlockedDates: any[]) => {
    setBlockedDates(newBlockedDates);
  };

  if (notFound) {
    return <NotFoundState onExit={handleExit} />;
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
        <BusinessProfileFormContent
          register={register}
          errors={errors}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          imageFile={imageFile}
          setImageFile={setImageFile}
          showCamera={showCamera}
          setShowCamera={setShowCamera}
          onCapturePhoto={handleCameraCapture}
          videoRef={videoRef}
          currentImageUrl={currentImageUrl}
          services={formServices}
          newService={newService}
          setNewService={setNewService}
          addService={handleServiceAdd}
          deleteService={handleServiceDelete}
          onAvailabilityChange={handleAvailabilityChange}
          onBlockedDatesChange={handleBlockedDatesChange}
          initialAvailability={availability}
          initialBlockedDates={blockedDates}
          businessId={id}
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
