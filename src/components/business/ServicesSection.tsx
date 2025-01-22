import { Label } from "@/components/ui/label";
import ServicesList from "./ServicesList";
import { BusinessService } from "@/types/profile";

interface ServicesSectionProps {
  services: BusinessService[];
  newService: BusinessService;
  setNewService: (service: BusinessService) => void;
  addService: () => void;
  onDeleteService?: (index: number) => void;
}

export default function ServicesSection({
  services,
  newService,
  setNewService,
  addService,
  onDeleteService
}: ServicesSectionProps) {
  return (
    <div className="space-y-4">
      <Label>Services</Label>
      <ServicesList
        services={services}
        newService={newService}
        setNewService={setNewService}
        addService={addService}
        onDeleteService={onDeleteService}
      />
    </div>
  );
}