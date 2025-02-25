
/**
 * BusinessProfileFormContent Component
 * 
 * Renders the content sections of the business profile form.
 * This component is used by both the create and edit forms to maintain consistency
 * and reduce code duplication.
 * 
 * Features:
 * - Image upload with camera support
 * - Business details input
 * - Services management
 * - Availability scheduling
 * 
 * @component
 */
import { ServiceCategory } from "@/types/profile";
import ImageUploadSection from "@/components/business/ImageUploadSection";
import BusinessDetailsSection from "@/components/business/BusinessDetailsSection";
import ServicesSection from "@/components/business/ServicesSection";
import AvailabilitySection from "@/components/business/AvailabilitySection";

/**
 * Props for the BusinessProfileFormContent component
 * @interface BusinessProfileFormContentProps
 */
interface BusinessProfileFormContentProps {
  /** Form register function from react-hook-form */
  register: any;
  /** Form errors from react-hook-form */
  errors: any;
  /** Currently selected service category */
  selectedCategory: ServiceCategory;
  /** Function to update selected category */
  setSelectedCategory: (category: ServiceCategory) => void;
  /** Currently selected image file */
  imageFile: File | null;
  /** Function to update image file */
  setImageFile: (file: File | null) => void;
  /** Camera visibility state */
  showCamera: boolean;
  /** Function to toggle camera visibility */
  setShowCamera: (show: boolean) => void;
  /** Function to handle photo capture */
  onCapturePhoto: () => void;
  /** Reference to video element for camera capture */
  videoRef: React.RefObject<HTMLVideoElement>;
  /** Optional current image URL (for edit mode) */
  currentImageUrl?: string | null;
  /** Array of business services */
  services: any[];
  /** New service being added */
  newService: any;
  /** Function to update new service */
  setNewService: (service: any) => void;
  /** Function to add a new service */
  addService: () => void;
  /** Function to delete a service */
  deleteService: (index: number, serviceId?: string) => void;
  /** Function to update availability */
  onAvailabilityChange: (availability: any[]) => void;
  /** Function to update blocked dates */
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
