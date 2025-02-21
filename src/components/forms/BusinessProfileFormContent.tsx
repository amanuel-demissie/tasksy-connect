
import ImageUploadSection from "@/components/business/ImageUploadSection";
import BusinessDetailsSection from "@/components/business/BusinessDetailsSection";
import ServicesSection from "@/components/business/ServicesSection";
import { ServiceCategory, BusinessService } from "@/types/profile";

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
  currentImageUrl: string | null;
  services: BusinessService[];
  newService: BusinessService;
  setNewService: (service: BusinessService) => void;
  addService: () => void;
  deleteService: (index: number, serviceId?: string) => void;
  onAvailabilityChange: (availability: any[]) => void;
  onBlockedDatesChange: (blockedDates: any[]) => void;
}

/**
 * BusinessProfileFormContent Component
 * 
 * Renders the main content sections of the business profile form:
 * - Image upload
 * - Business details
 * - Services
 * 
 * @component
 */
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
  onBlockedDatesChange
}: BusinessProfileFormContentProps) {
  return (
    <>
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
        addService={() => addService()}
        onDeleteService={deleteService}
      />
    </>
  );
}
