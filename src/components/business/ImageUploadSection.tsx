import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/shared/ImageUpload";
import { ImageUploadSectionProps } from "@/types/profile";

export default function ImageUploadSection({
  imageFile,
  setImageFile,
  showCamera,
  setShowCamera,
  onCapturePhoto,
  videoRef,
  currentImageUrl
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
        currentImageUrl={currentImageUrl}
      />
    </div>
  );
}