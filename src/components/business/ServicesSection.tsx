import { Label } from "@/components/ui/label";
import ServicesList from "./ServicesList";
import { BusinessService } from "@/types/profile";

/**
 * Props interface for ServicesSection component
 */
interface ServicesSectionProps {
  /** Array of business services to display */
  services: BusinessService[];
  /** New service being created */
  newService: BusinessService;
  /** Function to update the new service state */
  setNewService: (service: BusinessService) => void;
  /** Function to add a new service */
  addService: () => void;
  /** Optional function to handle service deletion */
  onDeleteService?: (index: number) => void;
}

/**
 * ServicesSection Component
 * 
 * Renders a section for managing business services, including:
 * - List of existing services
 * - Form to add new services
 * - Functionality to delete services
 * 
 * This component acts as a container for the ServicesList component,
 * providing a consistent layout and labeling for the services section.
 * 
 * @component
 * @example
 * ```tsx
 * <ServicesSection
 *   services={services}
 *   newService={newService}
 *   setNewService={setNewService}
 *   addService={handleAddService}
 *   onDeleteService={handleDeleteService}
 * />
 * ```
 */
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