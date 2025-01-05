import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/shared/ImageUpload";
import { ImageUploadSectionProps } from "@/types/profile";

/**
 * Component for handling image upload in the freelancer profile form
 * 
 * This component:
 * 1. Displays an image upload interface
 * 2. Handles file selection and preview
 * 3. Optionally supports camera capture on compatible devices
 * 
 * @component
 * @param {ImageUploadSectionProps} props - Component properties including image handling functions
 * @returns {JSX.Element} Rendered image upload section
 */
export default function ImageUploadSection({
  imageFile,
  setImageFile,
  showCamera,
  setShowCamera,
  onCapturePhoto,
  videoRef
}: ImageUploadSectionProps) {
  return (
    <div className="space-y-2">
      <Label>Profile Image</Label>
      <ImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        showCamera={showCamera}
        setShowCamera={setShowCamera}
        onCapturePhoto={onCapturePhoto}
        videoRef={videoRef}
      />
    </div>
  );
}