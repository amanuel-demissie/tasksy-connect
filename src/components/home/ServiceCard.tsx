import { Card, CardContent } from "@/components/ui/card";
import { getImageUrl } from "@/utils/imageUtils";
import { useNavigate } from "react-router-dom";
import { Clock, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const displayName = service.profiles.username || service.profiles.email || "Service Provider";
  
  // Generate random delivery time and distance for demo purposes (like DoorDash)
  const randomDeliveryTime = Math.floor(Math.random() * 20) + 15; // 15-35 min
  const randomDistance = (Math.random() * 3 + 0.5).toFixed(1); // 0.5-3.5 miles
  
  return (
    <Card 
      className="flex-shrink-0 w-72 overflow-hidden transition-all duration-300 
        hover:shadow-lg hover:shadow-accent/20 hover:translate-y-[-4px] cursor-pointer 
        bg-[#1A1F2C]/90 backdrop-blur-sm border border-accent/10 rounded-xl"
      onClick={() => navigate(`/business-profile/${service.id}`)}
    >
      {/* Image section */}
      <div className="relative">
        <div className="aspect-[16/9] overflow-hidden">
          <img 
            src={getImageUrl(service.image_url)} 
            alt={service.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>
        
        {/* Absolute positioned badges */}
        <div className="absolute top-2 left-2">
          <Badge className="bg-accent/90 text-white text-xs font-medium px-2 py-0.5">
            Popular
          </Badge>
        </div>
        
        {service.ratings && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-[#1A1F2C]/80 backdrop-blur-sm 
            rounded-full px-2 py-0.5 border border-accent/20 text-sm font-bold shadow-md">
            <span className="text-white">{service.ratings.toFixed(1)}</span>
            <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
          </div>
        )}
      </div>
      
      {/* Content section */}
      <CardContent className="p-3.5">
        {/* Business name and quick info */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-xl font-bold text-white truncate max-w-[180px] leading-tight mb-0.5">
              <span className="relative inline-block">
                {service.name}
                <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-accent/80 rounded-full"></span>
              </span>
            </h3>
            <div className="min-w-[32px] h-8 rounded-full overflow-hidden border border-accent/20 flex-shrink-0">
              <img 
                src={getImageUrl(service.image_url) || "/placeholder.svg"}
                alt={displayName}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>
          </div>
          
          {/* Service provider */}
          <p className="text-sm font-medium text-gray-300 -mt-1">
            {displayName}
          </p>
          
          {/* Address and metrics row */}
          <div className="flex items-center text-gray-400 text-sm gap-3">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{randomDistance} mi</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{randomDeliveryTime} min</span>
            </div>
          </div>
          
          {/* Description - Line clamp reduced to 1 line */}
          <p className="text-sm text-gray-400 line-clamp-1 mt-0.5">
            {service.description || "No description available"}
          </p>
          
          {/* Action button */}
          <div className="pt-2 mt-2 border-t border-accent/10 flex justify-between items-center">
            <span className="text-sm text-gray-400">
              {randomDeliveryTime} min
            </span>
            <span className="text-sm font-medium text-accent hover:underline">
              Book Now →
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
