
import { Card, CardContent } from "@/components/ui/card";
import { getImageUrl } from "@/utils/imageUtils";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

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
  
  return (
    <Card 
      className="flex-shrink-0 w-72 overflow-hidden transition-all duration-300 
        hover:shadow-lg hover:shadow-accent/20 hover:translate-y-[-4px] cursor-pointer 
        bg-[#1A1F2C]/90 backdrop-blur-sm border border-accent/10"
      onClick={() => navigate(`/business-profile/${service.id}`)}
    >
      {/* Image section with rating badge */}
      <div className="relative h-48">
        <img 
          src={getImageUrl(service.image_url)} 
          alt={service.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1F2C] via-transparent to-transparent opacity-80" />
        
        {/* Rating badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#1A1F2C]/80 backdrop-blur-sm 
            rounded-full px-3 py-1 border border-accent/20">
          <span className="text-lg font-bold text-white">
            {service.ratings?.toFixed(1) || "New"}
          </span>
          {service.ratings && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />}
        </div>
      </div>
      
      {/* Content section */}
      <CardContent className="p-4 space-y-3">
        {/* Service provider info with hover card */}
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="h-10 w-10 rounded-full overflow-hidden bg-accent/10 flex items-center justify-center">
                <img 
                  src={getImageUrl(service.image_url) || "/placeholder.svg"}
                  alt={displayName}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
              <div>
                <h3 className="font-medium text-white truncate max-w-[180px]">
                  {displayName}
                </h3>
                <p className="text-xs text-neutral-400 truncate max-w-[180px]">
                  {service.address || "Location not specified"}
                </p>
              </div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 bg-[#1A1F2C] border-accent/10 text-white p-4">
            <div className="space-y-2">
              <h4 className="font-medium">{displayName}</h4>
              <p className="text-sm text-neutral-400">{service.description || "No description available"}</p>
              {service.address && (
                <p className="text-xs text-neutral-300 italic">{service.address}</p>
              )}
            </div>
          </HoverCardContent>
        </HoverCard>
        
        {/* Service name and details */}
        <div className="pt-2 border-t border-accent/10">
          <h4 className="text-lg font-semibold text-white mb-1">
            {service.name}
          </h4>
          <p className="text-sm text-neutral-400 line-clamp-2">
            {service.description || "No description available"}
          </p>
        </div>
        
        {/* View details button */}
        <div className="flex justify-end pt-2">
          <span className="text-xs font-medium text-accent hover:underline">
            View Details →
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
