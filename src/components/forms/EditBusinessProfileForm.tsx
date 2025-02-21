
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { useCameraCapture } from "@/hooks/use-camera-capture";
import { useBusinessServices } from "@/hooks/use-business-services";
import { useBusinessProfileForm } from "@/hooks/use-business-profile-form";
import { BusinessProfileFormContent } from "./BusinessProfileFormContent";
import { NotFoundState } from "./NotFoundState";

/**
 * EditBusinessProfileForm Component
 * 
 * Main container component for editing business profiles.
 * Handles the overall form state and layout.
 * 
 * @component
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
    setBlockedDates
  } = useBusinessProfileForm(id!);

  const { 
    showCamera, 
    setShowCamera, 
    videoRef, 
    capturePhoto 
  } = useCameraCapture();

  const { 
    services, 
    newService, 
    setNewService, 
    addService,
    deleteService,
    fetchServices
  } = useBusinessServices(id!);

  useEffect(() => {
    fetchProfile();
    fetchServices();
  }, [id]);

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
    addService(services.length, undefined, true);
  };

  const handleAvailabilityChange = (availability: any[]) => {
    setAvailability(availability);
  };

  const handleBlockedDatesChange = (blockedDates: any[]) => {
    setBlockedDates(blockedDates);
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
          services={services}
          newService={newService}
          setNewService={setNewService}
          addService={handleServiceAdd}
          deleteService={handleServiceDelete}
          onAvailabilityChange={handleAvailabilityChange}
          onBlockedDatesChange={handleBlockedDatesChange}
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
