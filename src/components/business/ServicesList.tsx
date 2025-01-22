import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { BusinessService } from "@/types/profile";

interface ServicesListProps {
  services: (BusinessService & { id?: string })[];
  newService: BusinessService;
  setNewService: (service: BusinessService) => void;
  addService: () => void;
  onDeleteService?: (index: number, serviceId?: string) => void;
}

/**
 * ServicesList Component
 * 
 * Displays a list of business services and provides UI for adding/deleting services
 * 
 * @component
 * @param {Object} props - Component props
 * @param {BusinessService[]} props.services - Array of services to display
 * @param {BusinessService} props.newService - New service being created
 * @param {Function} props.setNewService - Function to update new service
 * @param {Function} props.addService - Function to add a new service
 * @param {Function} props.onDeleteService - Function to handle service deletion
 */
export default function ServicesList({
  services,
  newService,
  setNewService,
  addService,
  onDeleteService
}: ServicesListProps) {
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      const numericValue = value === '' ? 0 : Number(value);
      if (!isNaN(numericValue)) {
        setNewService({ ...newService, price: numericValue });
      }
    }
  };

  return (
    <div className="space-y-4">
      {services.map((service, index) => (
        <div key={index} className="p-4 border rounded relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={() => onDeleteService?.(index, service.id)}
          >
            <X className="h-4 w-4" />
          </Button>
          <p><strong>Name:</strong> {service.name}</p>
          <p><strong>Description:</strong> {service.description}</p>
          <p><strong>Price:</strong> ${service.price.toFixed(2)}</p>
        </div>
      ))}

      <div className="space-y-2">
        <Input
          placeholder="Service name"
          value={newService.name}
          onChange={(e) => setNewService({ ...newService, name: e.target.value })}
        />
        <Input
          placeholder="Service description"
          value={newService.description}
          onChange={(e) => setNewService({ ...newService, description: e.target.value })}
        />
        <Input
          type="text"
          inputMode="decimal"
          placeholder="Enter price (e.g. $30.48)"
          value={newService.price || ''}
          onChange={handlePriceChange}
          pattern="^\d*\.?\d{0,2}$"
        />
        <Button 
          type="button" 
          onClick={addService}
          className="bg-accent text-white hover:bg-accent/90"
        >
          Add Service
        </Button>
      </div>
    </div>
  );
}