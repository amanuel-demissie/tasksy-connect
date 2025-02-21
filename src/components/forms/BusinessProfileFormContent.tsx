
import { ServiceCategory } from "@/types/profile";
import ImageUploadSection from "@/components/business/ImageUploadSection";
import BusinessDetailsSection from "@/components/business/BusinessDetailsSection";
import ServicesSection from "@/components/business/ServicesSection";
import AvailabilitySection from "@/components/business/AvailabilitySection";

interface BusinessProfileFormContentProps {
  register: any;
  errors: any;
  selectedCategory: ServiceCategory;
  setSelectedCategory: (category: ServiceCategory) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  showCamera: boolean;
  setShowCamera: (show: boolean) => void;
  onCapturePhoto: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  currentImageUrl?: string | null;
  services: any[];
  newService: any;
  setNewService: (service: any) => void;
  addService: () => void;
  deleteService: (index: number, serviceId?: string) => void;
  onAvailabilityChange: (availability: any[]) => void;
  onBlockedDatesChange: (blockedDates: any[]) => void;
}

export function BusinessProfileFormContent({
  register,
  errors,
  selectedCategory,
  setSelectedCategory,
  imageFile,
  setImageFile,
  showCamera,
  setShowCamera,
  onCapturePhoto,
  videoRef,
  currentImageUrl,
  services,
  newService,
  setNewService,
  addService,
  deleteService,
  onAvailabilityChange,
  onBlockedDatesChange,
}: BusinessProfileFormContentProps) {
  return (
    <div className="space-y-6">
      <ImageUploadSection
        imageFile={imageFile}
        setImageFile={setImageFile}
        showCamera={showCamera}
        setShowCamera={setShowCamera}
        onCapturePhoto={onCapturePhoto}
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
        onDeleteService={deleteService}
      />

      <AvailabilitySection
        onAvailabilityChange={onAvailabilityChange}
        onBlockedDatesChange={onBlockedDatesChange}
      />
    </div>
  );
}
