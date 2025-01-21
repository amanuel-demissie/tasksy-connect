import { useState } from "react";
import { BusinessService } from "@/types/profile";

export const useBusinessServices = () => {
  const [services, setServices] = useState<BusinessService[]>([]);
  const [newService, setNewService] = useState<BusinessService>({ 
    name: "", 
    description: "", 
    price: 0 
  });

  const addService = () => {
    if (newService.name && newService.price > 0) {
      setServices([...services, newService]);
      setNewService({ name: "", description: "", price: 0 });
    }
  };

  return {
    services,
    setServices, // Exposing setServices function
    newService,
    setNewService,
    addService
  };
};