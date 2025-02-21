
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { useCameraCapture } from "@/hooks/use-camera-capture";
import { useBusinessServices } from "@/hooks/use-business-services";
import { useBusinessProfileForm } from "@/hooks/use-business-profile-form";
import { BusinessProfileFormContent } from "./BusinessProfileFormContent";
import { NotFoundState } from "./NotFoundState";
import { supabase } from "@/integrations/supabase/client";

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
    const fetchData = async () => {
      await fetchProfile();
      await fetchServices();
      
      // Fetch availability
      const { data: availabilityData } = await supabase
        .from("business_availability")
        .select("*")
        .eq("business_id", id);
      
      if (availabilityData) {
        setAvailability(availabilityData.map(slot => ({
          dayOfWeek: slot.day_of_week,
          startTime: slot.start_time,
          endTime: slot.end_time,
          slotDuration: slot.slot_duration
        })));
      }

      // Fetch blocked dates
      const { data: blockedDatesData } = await supabase
        .from("business_blocked_dates")
        .select("*")
        .eq("business_id", id);
      
      if (blockedDatesData) {
        setBlockedDates(blockedDatesData.map(date => ({
          date: new Date(date.blocked_date),
          reason: date.reason
        })));
      }
    };

    fetchData();
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
