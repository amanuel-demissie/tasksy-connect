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

export default function BusinessProfileForm({ onSuccess }: { onSuccess: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<BusinessProfileFormData>();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>("beauty");
  const [imageFile, setImageFile] = useState<File | null>(null);
  
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

  const onSubmit = async (data: BusinessProfileFormData) => {
    await submitProfile(data, imageFile, services);
  };

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