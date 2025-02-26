
/**
 * @file BusinessProfileFormContent.tsx
 * @description Main component for rendering business profile form content.
 * This component is used in both create and edit forms to maintain consistency.
 */

import { ServiceCategory } from "@/types/profile";
import ImageUploadSection from "@/components/business/ImageUploadSection";
import BusinessDetailsSection from "@/components/business/BusinessDetailsSection";
import ServicesSection from "@/components/business/ServicesSection";
import AvailabilitySection from "@/components/business/AvailabilitySection";

/**
 * @interface TimeSlot
 * @description Represents a time slot for business availability
 */
interface TimeSlot {
  /** Day of the week (0-6, where 0 is Sunday) */
  dayOfWeek: number;
  /** Start time in HH:mm format */
  startTime: string;
  /** End time in HH:mm format */
  endTime: string;
  /** Duration of each slot in minutes */
  slotDuration: number;
}

/**
 * @interface BlockedDate
 * @description Represents a blocked date in the business calendar
 */
interface BlockedDate {
  /** The blocked date */
  date: Date;
  /** Optional reason for blocking the date */
  reason?: string;
}

/**
 * @interface BusinessProfileFormContentProps
 * @description Props for the BusinessProfileFormContent component
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
  onAvailabilityChange: (availability: TimeSlot[]) => void;
  /** Function to update blocked dates */
  onBlockedDatesChange: (blockedDates: BlockedDate[]) => void;
  /** Initial availability data */
  initialAvailability?: TimeSlot[];
  /** Initial blocked dates data */
  initialBlockedDates?: BlockedDate[];
}

/**
 * BusinessProfileFormContent Component
 * 
 * @component
 * @description
 * Renders the main content sections of the business profile form.
 * This component is used by both the create and edit forms to maintain
 * consistency and reduce code duplication. It handles:
 * - Image upload and camera capture
 * - Business details input
 * - Services management
 * - Availability scheduling
 * 
 * @param {BusinessProfileFormContentProps} props - Component props
 * @returns {JSX.Element} Rendered form content
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
