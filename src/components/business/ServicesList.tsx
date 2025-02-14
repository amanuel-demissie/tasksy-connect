
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { BusinessService } from "@/types/profile";

interface ServicesListProps {
  services: (BusinessService & { id?: string })[];
  newService: BusinessService;
  setNewService: (service: BusinessService) => void;
  addService: () => void;
  onDeleteService?: (index: number, serviceId?: string, isEditing?: boolean) => void;
  isEditing?: boolean;
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
 * @param {boolean} props.isEditing - Whether the component is in edit mode
 */
export default function ServicesList({
  services,
  newService,
  setNewService,
  addService,
  onDeleteService,
  isEditing = false
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

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value === '' ? 30 : Number(value); // Default to 30 minutes if empty
    if (!isNaN(numericValue) && numericValue >= 0) {
      setNewService({ ...newService, duration: numericValue });
    }
  };

  const handleDeleteService = (event: React.MouseEvent<HTMLButtonElement>, index: number, serviceId?: string) => {
    event.preventDefault();
    if (onDeleteService) {
      onDeleteService(index, serviceId, isEditing);
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
            onClick={(event) => handleDeleteService(event, index, service.id)}
          >
            <X className="h-4 w-4" />
          </Button>
          <p><strong>Name:</strong> {service.name}</p>
          <p><strong>Description:</strong> {service.description}</p>
          <p><strong>Price:</strong> ${service.price.toFixed(2)}</p>
          <p><strong>Duration:</strong> {service.duration}m</p>
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
        <Input
          type="number"
          placeholder="Duration in minutes (default: 30)"
          value={newService.duration || ''}
          onChange={handleDurationChange}
          min="0"
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
