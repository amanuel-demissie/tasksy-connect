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
    // Remove any non-numeric characters except decimal point
    const value = e.target.value.replace(/[^\d.]/g, '');
    setNewService({ ...newService, price: parseFloat(value) || 0 });
  };

  return (
    <div className="space-y-4">
      {services.map((service, index) => (
        <div key={index} className="p-4 border rounded">
          <p><strong>Name:</strong> {service.name}</p>
          <p><strong>Description:</strong> {service.description}</p>
          <p><strong>Price:</strong> ${service.price}</p>
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
          placeholder="Enter price (e.g. $50.00)"
          value={newService.price || ''}
          onChange={handlePriceChange}
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