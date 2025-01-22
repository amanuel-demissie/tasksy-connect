import { supabase } from "@/integrations/supabase/client";
import { BusinessProfileFormData } from "@/types/profile";
import { useToast } from "@/hooks/use-toast";
import { useBusinessImageUpload } from "./use-business-image-upload";

/**
 * Custom hook for handling business profile submission and updates
 * 
 * This hook manages:
 * - Creating and updating business profiles in Supabase
 * - Handling image uploads for business profiles
 * - Managing associated business services
 * - Error handling and success notifications
 * 
 * @example
 * ```tsx
 * const { submitProfile } = useBusinessProfileSubmit(() => {
 *   console.log('Profile submitted successfully');
 * });
 * 
 * // Later in your component:
 * const handleSubmit = async (data: BusinessProfileFormData) => {
 *   await submitProfile(data, imageFile, services);
 * };
 * ```
 * 
 * @param {Function} onSuccess - Callback function executed after successful profile submission
 * @returns {Object} Hook methods
 * @returns {Function} submitProfile - Function to handle profile submission
 */
export const useBusinessProfileSubmit = (onSuccess: () => void) => {
  const { toast } = useToast();
  const { uploadBusinessImage } = useBusinessImageUpload();

  /**
   * Submits or updates a business profile with associated services
   * @param {BusinessProfileFormData} data - Form data for the business profile
   * @param {File | null} imageFile - Optional image file to upload
   * @param {Array} services - Array of services associated with the business
   * @param {string} [businessId] - Optional business ID for updates
   * @throws {Error} If profile creation/update fails
   */
  const submitProfile = async (
    data: BusinessProfileFormData, 
    imageFile: File | null, 
    services: any[],
    businessId?: string
  ) => {
    try {
      console.log(businessId ? "Updating" : "Creating", "business profile...");
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      console.log("Authenticated user:", user.id);

      let imageUrl = null;
      if (imageFile) {
        console.log("Uploading image...");
        imageUrl = await uploadBusinessImage(imageFile, data.name, data.category);
        console.log("Image uploaded successfully, public URL:", imageUrl);
      }

      const profileData = {
        owner_id: user.id,
        name: data.name,
        description: data.description,
        category: data.category,
        address: data.address,
        ...(imageFile && { image_url: imageUrl }),
      };

      let profile;
      if (businessId) {
        const { data: updatedProfile, error: profileError } = await supabase
          .from("business_profiles")
          .update(profileData)
          .eq('id', businessId)
          .select()
          .single();

        if (profileError) throw profileError;
        profile = updatedProfile;
        console.log("Business profile updated successfully:", profile);
      } else {
        const { data: newProfile, error: profileError } = await supabase
          .from("business_profiles")
          .insert(profileData)
          .select()
          .single();

        if (profileError) throw profileError;
        profile = newProfile;
        console.log("Business profile created successfully:", profile);
      }
      
      if (services.length > 0) {
        if (businessId) {
          // Delete existing services
          const { error: deleteError } = await supabase
            .from("business_services")
            .delete()
            .eq('business_id', businessId);

          if (deleteError) throw deleteError;
        }

        console.log("Creating services:", services);
        const { error: servicesError } = await supabase
          .from("business_services")
          .insert(
            services.map(service => ({
              business_id: profile.id,
              name: service.name,
              description: service.description,
              price: service.price,
            }))
          );

        if (servicesError) throw servicesError;
        console.log("Services created successfully");
      }

      toast({
        title: "Success",
        description: businessId ? "Business profile updated successfully" : "Business profile created successfully",
      });
      onSuccess();
    } catch (error) {
      console.error("Final error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: businessId ? "Failed to update business profile" : "Failed to create business profile",
      });
      throw error;
    }
  };

  return { submitProfile };
};