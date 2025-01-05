import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Interface representing a business service with its details
 */
interface BusinessService {
  name: string;
  description: string;
  price: number;
}

/**
 * Props for the ServicesList component
 */
interface ServicesListProps {
  /** Array of existing services */
  services: BusinessService[];
  /** New service being created */
  newService: BusinessService;
  /** Function to update the new service state */
  setNewService: (service: BusinessService) => void;
  /** Function to add the new service to the list */
  addService: () => void;
}

/**
 * Component for managing a list of business services
 * 
 * Features:
 * 1. Displays existing services
 * 2. Provides form inputs for adding new services
 * 3. Handles price input validation
 * 4. Manages service creation
 */
export default function ServicesList({
  services,
  newService,
  setNewService,
  addService
}: ServicesListProps) {
  /**
   * Handles price input changes with validation
   * Ensures only valid decimal numbers with up to 2 decimal places are accepted
   */
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty input or valid decimal number with up to 2 decimal places
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      const numericValue = value === '' ? 0 : Number(value);
      if (!isNaN(numericValue)) {
        setNewService({ ...newService, price: numericValue });
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Display existing services */}
      {services.map((service, index) => (
        <div key={index} className="p-4 border rounded">
          <p><strong>Name:</strong> {service.name}</p>
          <p><strong>Description:</strong> {service.description}</p>
          <p><strong>Price:</strong> ${service.price.toFixed(2)}</p>
        </div>
      ))}

      {/* Form for adding new services */}
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