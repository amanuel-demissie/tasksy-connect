import { Label } from "@/components/ui/label";
import ServicesList from "./ServicesList";
import { BusinessService } from "@/types/profile";

interface ServicesSectionProps {
  services: BusinessService[];
  newService: BusinessService;
  setNewService: (service: BusinessService) => void;
  addService: () => void;
}

/**
 * Component for managing business services in the profile form
 * 
 * @component
 * @param {ServicesSectionProps} props - Component props
 * @returns {JSX.Element} Rendered services section
 */
export default function ServicesSection({
  services,
  newService,
  setNewService,
  addService
}: ServicesSectionProps) {
  return (
    <div className="space-y-4">
      <Label>Services</Label>
      <ServicesList
        services={services}
        newService={newService}
        setNewService={setNewService}
        addService={addService}
      />
    </div>
  );
}