
/**
 * Custom hook for handling business profile submission
 * 
 * Manages the submission of business profile data to Supabase, including:
 * - Profile information persistence
 * - Image upload handling
 * - Services creation/update
 * - Error handling and success notifications
 * 
 * @param {Function} onSuccess - Callback function to execute after successful submission
 * @returns {Object} Object containing submission handler
 */
import { supabase } from "@/integrations/supabase/client";
import { BusinessProfileFormData } from "@/types/profile";
import { useToast } from "@/hooks/use-toast";
import { useBusinessImageUpload } from "./use-business-image-upload";

/**
 * Interface for the business profile result
 * @interface BusinessProfileResult
 */
interface BusinessProfileResult {
  /** Unique identifier for the business profile */
  id: string;
  /** Additional dynamic properties */
  [key: string]: any;
}

export const useBusinessProfileSubmit = (onSuccess: () => void) => {
  const { toast } = useToast();
  const { uploadBusinessImage } = useBusinessImageUpload();

  /**
   * Submits or updates a business profile
   * 
   * @param {BusinessProfileFormData} data - Form data containing profile information
   * @param {File | null} imageFile - Image file to upload (if any)
   * @param {Array} services - Array of services to associate with the profile
   * @param {string} [businessId] - Optional business ID for updates
   * @returns {Promise<BusinessProfileResult | null>} Created/updated profile or null if submission fails
   */
  const submitProfile = async (
    data: BusinessProfileFormData, 
    imageFile: File | null, 
    services: any[],
    businessId?: string
  ): Promise<BusinessProfileResult | null> => {
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
              duration: service.duration
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
      return profile;
    } catch (error) {
      console.error("Final error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: businessId ? "Failed to update business profile" : "Failed to create business profile",
      });
      return null;
    }
  };

  return { submitProfile };
};
