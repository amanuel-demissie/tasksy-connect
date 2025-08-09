
/**
 * @file use-business-services.ts
 * @description Custom hook for managing business services
 */

import { useEffect, useState } from "react";
import { BusinessService } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * useBusinessServices Hook
 * 
 * @description
 * Custom hook that provides functionality for managing business services.
 * Handles CRUD operations for services, including:
 * - Fetching services from the database
 * - Adding new services
 * - Updating existing services
 * - Deleting services
 * - State management for services
 * - Error handling and notifications
 * 
 * @param {string} [businessId] - Optional business ID for fetching existing services
 * @returns {Object} Service management methods and state
 */
export const useBusinessServices = (businessId?: string) => {
  const [services, setServices] = useState<BusinessService[]>([]);
  const [newService, setNewService] = useState<BusinessService>({
    name: "",
    description: "",
    price: 0,
    duration: 30, // Default duration in minutes
  });
  const { toast } = useToast();

  /**
   * Fetches services from the database and updates state
   * @async
   */
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
          price,
          duration
        )
      `
      )
      .eq("id", businessId)
      .maybeSingle();

    if (profile?.business_services) {
      setServices(profile.business_services.map(service => ({
        id: service.id,
        name: service.name,
        description: service.description || "",
        price: Number(service.price),
        duration: service.duration || 30
      })));
    }
  };

  // Debug logging
  

  /**
   * Adds a new service to the list and optionally persists to database
   * @param {number} index - Index where to add the service
   * @param {string} [serviceId] - Optional service ID for updates
   * @param {boolean} [isEditing] - Whether we're in edit mode
   */
  const addService = async(
    index: number,
    serviceId?: string,
    isEditing: boolean = false
  ) => {
    try {
      console.log("addService called with:", { index, serviceId, isEditing, businessId });
      
      if (newService.name && newService.price > 0) {
        console.log("Service validation passed with newService:", newService);
        
        if (isEditing && businessId) {
          console.log("Attempting database insertion with businessId:", businessId);
          
          const { data, error } = await supabase
            .from("business_services")
            .insert({
              business_id: businessId,
              name: newService.name,
              description: newService.description,
              price: newService.price,
              duration: newService.duration
            })
            .select()
            .single();

          console.log("Database response:", { data, error });

          if (error) {
            console.error("Error adding service:", error);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to add service. Please try again.",
            });
            return;
          }

          setServices([...services, {
            id: data.id,
            name: data.name,
            description: data.description,
            price: Number(data.price),
            duration: data.duration || 30
          }]);
          
          console.log("Updated services state with DB data");
        } else {
          console.log("Not in editing mode or no businessId, updating local state only");
          setServices([...services, newService]);
        }

        setNewService({ 
          name: "", 
          description: "", 
          price: 0,
          duration: 30 
        });

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
   * Deletes a service from the list and optionally from database
   * @param {number} index - Index of service to delete
   * @param {string} [serviceId] - Optional service ID for database deletion
   * @param {boolean} [isEditing] - Whether we're in edit mode
   */
  const deleteService = async (
    index: number,
    serviceId?: string,
    isEditing: boolean = false
  ) => {
    try {
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

      setServices(services.filter((_, i) => i !== index));

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
