import React from 'react';
import { Card } from "@/components/ui/card";
import { Building2, MapPin, Star } from 'lucide-react';
import { getImageUrl } from "@/utils/imageUtils";

interface BusinessProfile {
  id: string;
  name: string;
  description: string | null;
  category: string;
  address: string | null;
  image_url: string | null;
  ratings?: number | null;
}

interface BusinessCardProps {
  profile: BusinessProfile;
  onClick: () => void;
}

export const BusinessCard = ({ profile, onClick }: BusinessCardProps) => {
  return (
    <Card 
      className="relative overflow-hidden cursor-pointer group h-[300px]"
      onClick={onClick}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={getImageUrl(profile.image_url)} 
          alt={profile.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative h-full p-6 flex flex-col justify-between text-white">
        {/* Top Section - Ratings */}
        <div className="flex justify-end items-center gap-2">
          <span className="text-2xl font-bold">
            {profile.ratings?.toFixed(1) || "5.0"}
          </span>
          <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
        </div>

        {/* Bottom Section - Business Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm opacity-90">
            <Building2 className="w-4 h-4" />
            <span className="capitalize">{profile.category}</span>
          </div>
          
          <h3 className="text-2xl font-bold">{profile.name}</h3>
          
          {profile.address && (
            <div className="flex items-center gap-2 text-sm opacity-90">
              <MapPin className="w-4 h-4" />
              {profile.address}
            </div>
          )}
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-4 right-4">
          <button className="bg-accent text-white px-6 py-2 rounded-full font-semibold hover:bg-accent/90 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </Card>
  );
};