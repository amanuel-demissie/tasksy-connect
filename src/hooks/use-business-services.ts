import { useState } from "react";
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
    price: 0 
  });
  const { toast } = useToast();

  /**
   * Adds a new service to the list
   * If businessId is provided, also persists to database
   */
  const addService = () => {
    if (newService.name && newService.price > 0) {
      setServices([...services, newService]);
      setNewService({ name: "", description: "", price: 0 });
    }
  };

  /**
   * Deletes a service from the list and database if applicable
   * @param {number} index - Index of service to delete
   * @param {string} serviceId - Database ID of service to delete
   */
  const deleteService = async (index: number, serviceId?: string) => {
    try {
      // If we have a businessId and serviceId, delete from database
      if (businessId && serviceId) {
        const { error } = await supabase
          .from("business_services")
          .delete()
          .eq('id', serviceId)
          .eq('business_id', businessId);

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
      
      toast({
        title: "Success",
        description: "Service deleted successfully",
      });
    } catch (error) {
      console.error("Error in deleteService:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete service. Please try again.",
      });
    }
  };

  return {
    services,
    setServices,
    newService,
    setNewService,
    addService,
    deleteService
  };
};