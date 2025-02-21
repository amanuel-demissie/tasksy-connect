
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ServiceCategory, BusinessProfileFormData } from "@/types/profile";
import { useBusinessProfileSubmit } from "./use-business-profile-submit";
import { useToast } from "./use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getImageUrl } from "@/utils/imageUtils";
import { useBusinessServices } from "./use-business-services";

/**
 * Custom hook for managing business profile form state and operations
 * 
 * This hook centralizes the form logic including:
 * - Form state management
 * - Profile data fetching
 * - Image handling
 * - Form submission
 * - Navigation
 * 
 * @param {string} profileId - The ID of the business profile being edited
 * @returns {Object} Form state and handlers
 */
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

  const { services, setServices } = useBusinessServices(profileId!);

  /**
   * Fetches the business profile data from Supabase
   * Sets form values and services if profile is found
   */
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
          price
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

    // Set form values
    setValue("name", profile.name);
    setValue("description", profile.description || "");
    setValue("address", profile.address || "");
    setSelectedCategory(profile.category as ServiceCategory);
    setCurrentImageUrl(profile.image_url);

    // Set services with their IDs
    if (profile.business_services) {
      setServices(profile.business_services.map(service => ({
        id: service.id,
        name: service.name,
        description: service.description || "",
        price: Number(service.price)
      })));
    }

    // Fetch availability
    const { data: availabilityData } = await supabase
      .from("business_availability")
      .select("*")
      .eq("business_id", profileId);

    if (availabilityData) {
      setAvailability(availabilityData);
    }

    // Fetch blocked dates
    const { data: blockedDatesData } = await supabase
      .from("business_blocked_dates")
      .select("*")
      .eq("business_id", profileId);

    if (blockedDatesData) {
      setBlockedDates(blockedDatesData);
    }
  };

  /**
   * Handles form submission
   * Updates the business profile with new data
   * @param {BusinessProfileFormData} data - Form data to submit
   */
  const onSubmit = async (data: BusinessProfileFormData) => {
    if (!profileId) return;

    try {
      setIsSubmitting(true);
      const formData = {
        ...data,
        category: selectedCategory
      };

      const imageToSubmit = imageFile || (currentImageUrl ? new URL(getImageUrl(currentImageUrl)) : null);
      
      // Submit profile and get the ID
      const profileResult = await submitProfile(formData, imageToSubmit as File | null, services, profileId);
      
      if (profileResult?.id) {
        // Handle availability
        if (availability.length > 0) {
          // Delete existing availability
          await supabase
            .from("business_availability")
            .delete()
            .eq("business_id", profileResult.id);

          // Insert new availability
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

        // Handle blocked dates
        if (blockedDates.length > 0) {
          // Delete existing blocked dates
          await supabase
            .from("business_blocked_dates")
            .delete()
            .eq("business_id", profileResult.id);

          // Insert new blocked dates
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

  /**
   * Handles exiting the form
   * Navigates back to the profile page
   */
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
  };
};
