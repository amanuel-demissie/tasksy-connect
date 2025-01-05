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

export interface ImageUploadSectionProps extends ImageUploadProps {}

export interface BusinessService {
  name: string;
  description: string;
  price: number;
}

export interface BusinessProfileFormData {
  name: string;
  description: string;
  category: ServiceCategory;
  address: string;
  services: BusinessService[];
  image?: File;
}