import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useBusinessImageUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadBusinessImage = async (file: File, businessName: string) => {
    try {
      if (!file) return null;

      setUploadProgress(0);
      const sanitizedName = businessName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const fileName = `business-profiles/${sanitizedName}-${Date.now()}.${file.name.split('.').pop()}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      setUploadProgress(100);
      return urlData.publicUrl;
    } catch (error) {
      console.error("Image upload error:", error);
      throw error;
    }
  };

  return {
    uploadBusinessImage,
    uploadProgress
  };
};