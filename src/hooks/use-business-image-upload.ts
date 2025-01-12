import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

/**
 * Custom hook for handling business image uploads to Supabase storage
 * 
 * This hook provides functionality to:
 * - Upload business profile images to Supabase storage
 * - Track upload progress
 * - Generate and return public URLs for uploaded images
 * - Handle error cases and file validation
 * 
 * @returns {Object} Hook methods and state
 * @returns {Function} uploadBusinessImage - Function to handle image upload
 * @returns {number} uploadProgress - Current upload progress (0-100)
 * 
 * @example
 * ```tsx
 * const { uploadBusinessImage, uploadProgress } = useBusinessImageUpload();
 * 
 * // Later in your component:
 * const handleImageUpload = async (file: File) => {
 *   try {
 *     const imageUrl = await uploadBusinessImage(file, "My Business Name");
 *     console.log("Uploaded image URL:", imageUrl);
 *   } catch (error) {
 *     console.error("Upload failed:", error);
 *   }
 * };
 * ```
 */
export const useBusinessImageUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);

  /**
   * Uploads a business profile image to Supabase storage
   * 
   * @param {File} file - The image file to upload
   * @param {string} businessName - The name of the business (used for filename generation)
   * @returns {Promise<string|null>} Public URL of the uploaded image, or null if upload fails
   * @throws {Error} If upload fails or if file is invalid
   */
  const uploadBusinessImage = async (file: File, businessName: string) => {
    try {
      if (!file) return null;

      setUploadProgress(0);
      // Sanitize business name for use in filename
      const sanitizedName = businessName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      // Generate unique filename with timestamp
      const fileName = `business-profiles/${sanitizedName}-${Date.now()}.${file.name.split('.').pop()}`;
      
      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL for the uploaded file
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