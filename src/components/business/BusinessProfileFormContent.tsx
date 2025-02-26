import {
  BusinessDetailsSection,
  ImageUploadSection,
  ServicesSection,
  AvailabilitySection,
} from "@/components";
import {
  BusinessService,
  BusinessProfileFormData,
  ImageUploadProps,
  ServiceCategory,
} from "@/types/profile";

interface BusinessProfileFormContentProps {
  register: any;
  errors: any;
  selectedCategory: ServiceCategory;
  setSelectedCategory: (category: ServiceCategory) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  showCamera: boolean;
  setShowCamera: (show: boolean) => void;
  onCapturePhoto: () => Promise<void>;
  videoRef: React.RefObject<HTMLVideoElement>;
  currentImageUrl: string | null;
  services: BusinessService[];
  newService: string;
  setNewService: (service: string) => void;
  addService: () => void;
  deleteService: (index: number, serviceId?: string) => void;
  onAvailabilityChange: (availability: any[]) => void;
  onBlockedDatesChange: (blockedDates: any[]) => void;
  initialAvailability?: any[];
  initialBlockedDates?: any[];
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
  initialAvailability,
  initialBlockedDates,
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
        onAvailabilityChange={onAvailabilityChange}
        onBlockedDatesChange={onBlockedDatesChange}
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
        initialAvailability={initialAvailability}
        initialBlockedDates={initialBlockedDates}
      />
    </div>
  );
}
