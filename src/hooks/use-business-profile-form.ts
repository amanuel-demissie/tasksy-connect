import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ServiceCategory, BusinessProfileFormData } from "@/types/profile";
import { useBusinessProfileSubmit } from "./use-business-profile-submit";
import { useToast } from "./use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getImageUrl } from "@/utils/imageUtils";
import { useBusinessServices } from "./use-business-services";

interface BusinessProfileResponse {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  category: ServiceCategory;
  image_url: string | null;
  business_services: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    duration: number;
  }[];
}

export const useBusinessProfileForm = (profileId: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<BusinessProfileFormData>();
  
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>("beauty");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availability, setAvailability] = useState<any[]>([]);
  const [blockedDates, setBlockedDates] = useState<any[]>([]);

  const { submitProfile } = useBusinessProfileSubmit(() => {
    toast({
      title: "Success",
      description: "Business profile updated successfully",
    });
    navigate("/profile");
  });

  const businessServicesHook = useBusinessServices(profileId!);
  const { services, setServices } = businessServicesHook;

  const fetchProfile = async () => {
    if (!profileId) return;

    const { data: profile, error } = await supabase
      .from("business_profiles")
      .select(`
        *,
        business_services (
          id,
          name,
          description,
          price,
          duration
        )
      `)
      .eq("id", profileId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching business profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch business profile",
      });
      return;
    }

    if (!profile) {
      setNotFound(true);
      toast({
        variant: "destructive",
        title: "Not Found",
        description: "Business profile not found",
      });
      return;
    }

    const typedProfile = profile as BusinessProfileResponse;

    setValue("name", typedProfile.name);
    setValue("description", typedProfile.description || "");
    setValue("address", typedProfile.address || "");
    setSelectedCategory(typedProfile.category);
    setCurrentImageUrl(typedProfile.image_url);

    if (typedProfile.business_services) {
      setServices(typedProfile.business_services.map(service => ({
        id: service.id,
        name: service.name,
        description: service.description || "",
        price: Number(service.price),
        duration: service.duration
      })));
    }

    const { data: availabilityData } = await supabase
      .from("business_availability")
      .select("*")
      .eq("business_id", profileId);

    if (availabilityData) {
      const formattedAvailability = availabilityData.map(slot => ({
        dayOfWeek: slot.day_of_week,
        startTime: slot.start_time,
        endTime: slot.end_time,
        slotDuration: slot.slot_duration
      }));
      setAvailability(formattedAvailability);
    }

    const { data: blockedDatesData } = await supabase
      .from("business_blocked_dates")
      .select("*")
      .eq("business_id", profileId);

    if (blockedDatesData) {
      const formattedBlockedDates = blockedDatesData.map(date => ({
        date: new Date(date.blocked_date),
        reason: date.reason || undefined
      }));
      setBlockedDates(formattedBlockedDates);
    }
  };

  const onSubmit = async (data: BusinessProfileFormData) => {
    if (!profileId) return;

    try {
      setIsSubmitting(true);
      const formData = {
        ...data,
        category: selectedCategory
      };

      const imageToSubmit = imageFile || (currentImageUrl ? new URL(getImageUrl(currentImageUrl)) : null);
      
      const profileResult = await submitProfile(formData, imageToSubmit as File | null, services, profileId);
      
      if (profileResult) {
        if (availability.length > 0) {
          await supabase
            .from("business_availability")
            .delete()
            .eq("business_id", profileResult.id);

          const { error: availabilityError } = await supabase
            .from("business_availability")
            .insert(
              availability.map(slot => ({
                business_id: profileResult.id,
                day_of_week: slot.dayOfWeek,
                start_time: slot.startTime,
                end_time: slot.endTime,
                slot_duration: slot.slotDuration
              }))
            );

          if (availabilityError) {
            console.error("Error saving availability:", availabilityError);
          }
        }

        if (blockedDates.length > 0) {
          await supabase
            .from("business_blocked_dates")
            .delete()
            .eq("business_id", profileResult.id);

          const { error: blockedDatesError } = await supabase
            .from("business_blocked_dates")
            .insert(
              blockedDates.map(date => ({
                business_id: profileResult.id,
                blocked_date: date.date,
                reason: date.reason
              }))
            );

          if (blockedDatesError) {
            console.error("Error saving blocked dates:", blockedDatesError);
          }
        }
      }
    } catch (error) {
      console.error("Error updating business profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update business profile",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExit = () => {
    navigate("/profile");
  };

  return {
    register,
    errors,
    handleSubmit,
    onSubmit,
    selectedCategory,
    setSelectedCategory,
    imageFile,
    setImageFile,
    currentImageUrl,
    isSubmitting,
    notFound,
    handleExit,
    fetchProfile,
    setAvailability,
    setBlockedDates,
    availability,
    blockedDates,
    services,
    setServices,
    businessServicesHook,
  };
};
