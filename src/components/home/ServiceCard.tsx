
import { Card, CardContent } from "@/components/ui/card";
import { getImageUrl } from "@/utils/imageUtils";
import { useNavigate } from "react-router-dom";

interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    description: string | null;
    image_url: string | null;
    address: string | null;
    ratings: number | null;
    profiles: {
      username: string | null;
      email: string | null;
    };
  };
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="flex-shrink-0 w-72 bg-[#1A1F2C] backdrop-blur-sm border-gray-100 cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={() => navigate(`/business-profile/${service.id}`)}
    >
      <div className="relative">
        <img 
          src={getImageUrl(service.image_url)} 
          alt={service.name}
          className="w-full h-40 object-cover rounded-t-lg"
        />
        <div className="absolute top-4 right-4 bg-[#1A1F2C] border-2 border-gray-100 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-lg font-bold">{service.ratings || "New"}</span>
          <span className="text-sm text-neutral-600"> ({service.ratings ? "★" : ""})</span>
        </div>
      </div>
      <CardContent className="p-3 space-y-2">
        <div className="flex items-center space-x-3">
          <img 
            src="/placeholder.svg"
            alt={service.profiles.username || service.profiles.email}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-medium text-neutral-900">
              {service.profiles.username || service.profiles.email}
            </h3>
            <p className="text-sm text-neutral-600">{service.description || "Service Provider"}</p>
          </div>
        </div>
        <div className="space-y-1">
          <h4 className="text-base font-semibold text-neutral-900">{service.name}</h4>
          <p className="text-sm text-neutral-600">{service.address || "Location not specified"}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
