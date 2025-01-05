import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { ImageUploadProps } from "@/types/profile";

export default function ImageUpload({
  imageFile,
  setImageFile,
  showCamera,
  setShowCamera,
  onCapturePhoto,
  videoRef
}: ImageUploadProps) {
  if (showCamera && videoRef && setShowCamera && onCapturePhoto) {
    return (
      <div className="space-y-2">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full rounded-lg"
        />
        <div className="flex gap-2">
          <Button 
            type="button" 
            onClick={onCapturePhoto}
            className="bg-accent text-white hover:bg-accent/90"
          >
            Capture Photo
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              setShowCamera(false);
              const stream = videoRef.current?.srcObject as MediaStream;
              stream?.getTracks().forEach(track => track.stop());
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="flex-1"
        />
        {setShowCamera && (
          <Button 
            type="button"
            variant="outline"
            onClick={() => setShowCamera(true)}
            className="flex items-center gap-2"
          >
            <Camera className="h-4 w-4" />
            Camera
          </Button>
        )}
      </div>
      {imageFile && (
        <div className="mt-2">
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            className="max-w-xs rounded-lg"
          />
        </div>
      )}
    </div>
  );
}