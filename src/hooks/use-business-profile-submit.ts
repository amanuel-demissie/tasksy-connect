import { supabase } from "@/integrations/supabase/client";
import { BusinessProfileFormData } from "@/types/profile";
import { useToast } from "@/hooks/use-toast";
import { useBusinessImageUpload } from "./use-business-image-upload";

export const useBusinessProfileSubmit = (onSuccess: () => void) => {
  const { toast } = useToast();
  const { uploadBusinessImage } = useBusinessImageUpload();

  const submitProfile = async (data: BusinessProfileFormData, imageFile: File | null, services: any[]) => {
    try {
      console.log("Starting business profile creation...");
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      console.log("Authenticated user:", user.id);

      let imageUrl = null;
      if (imageFile) {
        console.log("Uploading image...");
        imageUrl = await uploadBusinessImage(imageFile, data.name);
        console.log("Image uploaded successfully, public URL:", imageUrl);
      }

      console.log("Creating business profile with data:", {
        owner_id: user.id,
        name: data.name,
        description: data.description,
        category: data.category,
        address: data.address,
        image_url: imageUrl,
      });

      const { data: profile, error: profileError } = await supabase
        .from("business_profiles")
        .insert({
          owner_id: user.id,
          name: data.name,
          description: data.description,
          category: data.category,
          address: data.address,
          image_url: imageUrl,
        })
        .select()
        .single();

      if (profileError) {
        console.error("Error creating business profile:", profileError);
        throw profileError;
      }
      
      console.log("Business profile created successfully:", profile);

      if (services.length > 0) {
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

        if (servicesError) {
          console.error("Error creating services:", servicesError);
          throw servicesError;
        }
        console.log("Services created successfully");
      }

      toast({
        title: "Success",
        description: "Business profile created successfully",
      });
      onSuccess();
    } catch (error) {
      console.error("Final error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create business profile",
      });
      throw error;
    }
  };

  return { submitProfile };
};