import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/shared/ImageUpload";
import { ImageUploadSectionProps } from "@/types/profile";

/**
 * Component for handling image upload in the business profile form
 * 
 * @component
 * @param {ImageUploadSectionProps} props - Component props
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