import { useState } from "react";
import { BusinessService } from "@/types/profile";

/**
 * Custom hook for managing business services state and operations
 * 
 * This hook provides functionality to:
 * - Manage a list of business services
 * - Add new services to the list
 * - Track and update the current service being edited
 * 
 * @example
 * ```tsx
 * const {
 *   services,
 *   setServices,
 *   newService,
 *   setNewService,
 *   addService
 * } = useBusinessServices();
 * 
 * // Later in your component:
 * const handleAddService = () => {
 *   setNewService({ name: 'New Service', description: '', price: 0 });
 *   addService();
 * };
 * ```
 * 
 * @returns {Object} Hook methods and state
 * @returns {BusinessService[]} services - Array of current services
 * @returns {Function} setServices - Function to update services array
 * @returns {BusinessService} newService - Current service being edited
 * @returns {Function} setNewService - Function to update current service
 * @returns {Function} addService - Function to add new service to list
 */
export const useBusinessServices = () => {
  const [services, setServices] = useState<BusinessService[]>([]);
  const [newService, setNewService] = useState<BusinessService>({ 
    name: "", 
    description: "", 
    price: 0 
  });

  /**
   * Adds a new service to the services list if valid
   * Validates that the service has a name and positive price
   */
  const addService = () => {
    if (newService.name && newService.price > 0) {
      setServices([...services, newService]);
      setNewService({ name: "", description: "", price: 0 });
    }
  };

  return {
    services,
    setServices,
    newService,
    setNewService,
    addService
  };
};