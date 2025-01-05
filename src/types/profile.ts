import { Database } from "@/integrations/supabase/types";

export type ServiceCategory = Database["public"]["Enums"]["service_category"];

export interface ImageUploadProps {
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  showCamera?: boolean;
  setShowCamera?: (show: boolean) => void;
  onCapturePhoto?: () => void;
  videoRef?: React.RefObject<HTMLVideoElement>;
}