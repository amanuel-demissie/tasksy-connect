import { Card, CardContent } from "@/components/ui/card";

interface ServiceCardProps {
  service: {
    id: number;
    name: string;
    rating: string;
    reviews: number;
    image: string;
    provider: string;
    service: string;
    address: string;
  };
}

const ServiceCard = ({ service }: ServiceCardProps) => (
  <Card className="flex-shrink-0 w-72 bg-[#1A1F2C] backdrop-blur-sm border-gray-100 ">
    <div className="relative">
      <img 
        src={service.image} 
        alt={service.name}
        className="w-full h-40 object-cover rounded-t-lg"
      />
      <div className="absolute top-4 right-4 bg-[#1A1F2C] border-2 border-gray-100 backdrop-blur-sm rounded-full px-3 py-1">
        <span className="text-lg font-bold">{service.rating}</span>
        <span className="text-sm text-neutral-600"> ({service.reviews})</span>
      </div>
    </div>
    <CardContent className="p-3 space-y-2">
      <div className="flex items-center space-x-3">
        <img 
          src="/placeholder.svg"
          alt={service.provider}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h3 className="font-medium text-neutral-900">{service.provider}</h3>
          <p className="text-sm text-neutral-600">{service.service}</p>
        </div>
      </div>
      <div className="space-y-1">
        <h4 className="text-base font-semibold text-neutral-900">{service.name}</h4>
        <p className="text-sm text-neutral-600">{service.address}</p>
      </div>
    </CardContent>
  </Card>
);

export default ServiceCard;