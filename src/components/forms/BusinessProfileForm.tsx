import { useState } from "react";
import { useForm } from "react-hook-form";
import { ServiceCategory, BusinessProfileFormData } from "@/types/profile";
import ImageUploadSection from "@/components/business/ImageUploadSection";
import BusinessDetailsSection from "@/components/business/BusinessDetailsSection";
import ServicesSection from "@/components/business/ServicesSection";
import AvailabilitySection from "@/components/business/AvailabilitySection";
import { Button } from "@/components/ui/button";
import { useBusinessProfileSubmit } from "@/hooks/use-business-profile-submit";
import { useCameraCapture } from "@/hooks/use-camera-capture";
import { useBusinessServices } from "@/hooks/use-business-services";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function BusinessProfileForm({ onSuccess }: { onSuccess: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<BusinessProfileFormData>();
  
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>("beauty");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availability, setAvailability] = useState<any[]>([]);
  const [blockedDates, setBlockedDates] = useState<any[]>([]);
  
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

  const onSubmit = async (data: BusinessProfileFormData) => {
    try {
      setIsSubmitting(true);
      const formData = {
        ...data,
        category: selectedCategory
      };

      const profileResult = await submitProfile(formData, imageFile, services);

      if (profileResult) {
        if (availability.length > 0) {
          const { error: availabilityError } = await supabase
            .from("business_availability")
            .insert(
              availability.map(slot => ({
                business_id: profileResult.id,
                day_of_week: slot.dayOfWeek,
                start_time: slot.startTime,
                end_time: slot.endTime,
                slot_duration: slot.slotDuration
              }))
            );

          if (availabilityError) {
            console.error("Error saving availability:", availabilityError);
          }
        }

        if (blockedDates.length > 0) {
          const { error: blockedDatesError } = await supabase
            .from("business_blocked_dates")
            .insert(
              blockedDates.map(date => ({
                business_id: profileResult.id,
                blocked_date: date.date,
                reason: date.reason
              }))
            );

          if (blockedDatesError) {
            console.error("Error saving blocked dates:", blockedDatesError);
          }
        }
      }
    } catch (error) {
      console.error("Error creating business profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const file = await capturePhoto();
      setImageFile(file);
    } catch (error) {
      console.error("Error capturing photo:", error);
    }
  };

  const handleServiceDelete = (index: number, serviceId?: string) => {
    deleteService(index, serviceId, false);
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
        addService={() => addService(services.length, undefined, false)}
        onDeleteService={handleServiceDelete}
      />

      <AvailabilitySection
        onAvailabilityChange={setAvailability}
        onBlockedDatesChange={setBlockedDates}
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
