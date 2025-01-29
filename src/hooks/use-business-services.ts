import { useEffect, useState } from "react";
import { BusinessService } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Custom hook for managing business services
 * Handles CRUD operations for services including database persistence
 *
 * @returns {Object} Hook methods and state
 * @returns {BusinessService[]} services - Array of current services
 * @returns {Function} setServices - Function to update services state
 * @returns {BusinessService} newService - Current new service being created
 * @returns {Function} setNewService - Function to update new service state
 * @returns {Function} addService - Function to add a new service
 * @returns {Function} deleteService - Function to delete a service
 */
export const useBusinessServices = (businessId?: string) => {
  const [services, setServices] = useState<BusinessService[]>([]);
  const [newService, setNewService] = useState<BusinessService>({
    name: "",
    description: "",
    price: 0,
  });
  const { toast } = useToast();

  //fetch services from database and set services state
  const fetchServices = async () => {
    if (!businessId) return;
    const { data: profile, error } = await supabase
      .from("business_profiles")
      .select(
        `
        *,
        business_services (
          id,
          name,
          description,
          price
        )
      `
      )
      .eq("id", businessId)
      .maybeSingle();


      if(profile.business_services) {
        setServices(profile.business_services.map(service => ({
          id: service.id,
          name: service.name,
          description: service.description || "",
          price: Number(service.price)
        })));
      }

  };

  //just for debugging
  if (services.length > 0) {
    console.log("services from useBusinessServices", services);
  } else {
    console.log("no services from useBusinessServices");
  }

  /**
   * Adds a new service to the list
   * If businessId is provided, also persists to database
   */
  const addService = async(
    index: number,
    serviceId?: string,
    isEditing: boolean = false
  ) => {
    try {
      if (newService.name && newService.price > 0) {
        // If we're in edit mode and have a businessId, add to database
        if (isEditing && businessId) {
          const { data, error } = await supabase
            .from("business_services")
            .insert({
              business_id: businessId,
              name: newService.name,
              description: newService.description,
              price: newService.price,
            })
            .select()
            .single();

          if (error) {
            console.error("Error adding service:", error);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to add service. Please try again.",
            });
            return;
          }

          // Update local state with the database response
          setServices([...services, {
            //id: data.id,
            name: data.name,
            description: data.description,
            price: Number(data.price)
          }]);
        } else {
          // If not editing, just update local state
          setServices([...services, newService]);
        }

        // Reset the new service form
        setNewService({ name: "", description: "", price: 0 });

        // Show success toast only in edit mode
        if (isEditing) {
          toast({
            title: "Success",
            description: "Service added successfully",
          });
        }
      }
    } catch (error) {
      console.error("Error in addService:", error);
      if (isEditing) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add service. Please try again.",
        });
      }
    }
  };

  /**
   * Deletes a service from the list and database if applicable
   * @param {number} index - Index of service to delete
   * @param {string} serviceId - Database ID of service to delete
   * @param {boolean} isEditing - Whether we're in edit mode
   */
  const deleteService = async (
    index: number,
    serviceId?: string,
    isEditing: boolean = false
  ) => {
    try {
      // Only attempt database deletion if we're in edit mode and have both businessId and serviceId
      if (isEditing && businessId && serviceId) {
        const { error } = await supabase
          .from("business_services")
          .delete()
          .eq("id", serviceId)
          .eq("business_id", businessId);

        if (error) {
          console.error("Error deleting service:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete service. Please try again.",
          });
          return;
        }
      }

      // Update local state
      setServices(services.filter((_, i) => i !== index));

      // Only show toast in edit mode when deleting from database
      if (isEditing) {
        toast({
          title: "Success",
          description: "Service deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error in deleteService:", error);
      if (isEditing) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete service. Please try again.",
        });
      }
    }
  };

  return {
    services,
    setServices,
    newService,
    setNewService,
    addService,
    deleteService,
    fetchServices
  };
};
