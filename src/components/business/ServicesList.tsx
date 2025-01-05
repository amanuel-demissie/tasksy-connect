import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BusinessService {
  name: string;
  description: string;
  price: number;
}

interface ServicesListProps {
  services: BusinessService[];
  newService: BusinessService;
  setNewService: (service: BusinessService) => void;
  addService: () => void;
}

export default function ServicesList({
  services,
  newService,
  setNewService,
  addService
}: ServicesListProps) {
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
      {services.map((service, index) => (
        <div key={index} className="p-4 border rounded">
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