
/**
 * Custom hook for handling business image uploads to Supabase storage
 * 
 * This hook provides functionality for:
 * - Uploading images to the appropriate category folder
 * - Tracking upload progress
 * - Handling different input types (File, URL, string)
 * - Error handling and logging
 * 
 * @returns {Object} Hook methods and state
 */
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ServiceCategory } from '@/types/profile';

export const useBusinessImageUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);

  /**
   * Gets the appropriate storage folder path based on business category
   * @param {ServiceCategory} category - The business category
   * @returns {string} The folder path for the category
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
   * Uploads a business profile image to Supabase storage
   * 
   * @param {File | string | URL | null} fileOrUrl - The image file to upload or existing image URL
   * @param {string} businessName - The name of the business (used in filename)
   * @param {ServiceCategory} category - The business category
   * @returns {Promise<string | null>} The public URL of the uploaded image, or null if upload fails
   * @throws {Error} If upload fails or file is invalid
   */
  const uploadBusinessImage = async (
    fileOrUrl: File | string | URL | null,
    businessName: string,
    category: ServiceCategory
  ): Promise<string | null> => {
    try {
      if (!fileOrUrl) return null;

      if (typeof fileOrUrl === 'string') {
        console.log('Using existing image URL:', fileOrUrl);
        return fileOrUrl;
      }

      if (fileOrUrl instanceof URL) {
        console.log('Using existing image URL from URL object:', fileOrUrl.toString());
        return fileOrUrl.toString();
      }

      const file = fileOrUrl as File;
      setUploadProgress(0);
      console.log(`Uploading image for ${category} business...`);

      const sanitizedName = businessName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const categoryFolder = getCategoryFolder(category);
      const fileExtension = file.name.split('.').pop() || 'jpg';
      const fileName = `${categoryFolder}/${sanitizedName}-${Date.now()}.${fileExtension}`;
      
      console.log(`Uploading to path: ${fileName}`);

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
