import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ServiceCategory } from '@/types/profile';

/**
 * Custom hook for handling business image uploads to Supabase storage
 * 
 * This hook provides functionality to:
 * - Upload business profile images to Supabase storage in category-specific folders
 * - Track upload progress
 * - Generate and return public URLs for uploaded images
 * - Handle error cases and file validation
 * 
 * @returns {Object} Hook methods and state
 * @returns {Function} uploadBusinessImage - Function to handle image upload
 * @returns {number} uploadProgress - Current upload progress (0-100)
 */
export const useBusinessImageUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);

  /**
   * Gets the appropriate folder path based on business category
   */
  const getCategoryFolder = (category: ServiceCategory): string => {
    switch (category) {
      case 'beauty':
        return 'beauty_profiles';
      case 'home':
        return 'home_services_profiles';
      case 'professional':
        return 'professional_profiles';
      case 'dining':
        return 'dining_profiles';
      default:
        return 'other_profiles';
    }
  };

  /**
   * Uploads a business profile image to Supabase storage in the appropriate category folder
   */
  const uploadBusinessImage = async (file: File, businessName: string, category: ServiceCategory) => {
    try {
      if (!file) return null;

      setUploadProgress(0);
      console.log(`Uploading image for ${category} business...`);

      // Sanitize business name for use in filename
      const sanitizedName = businessName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      // Get the appropriate folder based on category
      const categoryFolder = getCategoryFolder(category);
      
      // Generate unique filename with timestamp and category path
      const fileName = `${categoryFolder}/${sanitizedName}-${Date.now()}.${file.name.split('.').pop()}`;
      
      console.log(`Uploading to path: ${fileName}`);

      // Upload file to Supabase storage in the business_profile_images bucket
      const { error: uploadError } = await supabase.storage
        .from("business_profile_images")
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      // Get public URL in a separate call
      const { data: { publicUrl } } = supabase.storage
        .from("business_profile_images")
        .getPublicUrl(fileName);

      setUploadProgress(100);
      console.log("Upload successful, public URL:", publicUrl);
      return publicUrl;

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