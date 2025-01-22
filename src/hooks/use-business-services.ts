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

  const deleteService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
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