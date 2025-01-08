import React from 'react';
import { Card } from "@/components/ui/card";
import { DeleteBusinessDialog } from './DeleteBusinessDialog';
import { BusinessRating } from './BusinessRating';
import { BusinessInfo } from './BusinessInfo';

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
  onDelete?: () => void;
}

export const BusinessCard = ({ profile, onClick, onDelete }: BusinessCardProps) => {
  return (
    <Card 
      className="relative overflow-hidden cursor-pointer group h-[300px]"
      onClick={onClick}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={profile.image_url || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'} 
          alt={profile.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error('Image load error:', e);
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative h-full p-6 flex flex-col justify-between text-white">
        {/* Top Section - Delete Button and Ratings */}
        <div className="flex justify-between items-center">
          <DeleteBusinessDialog 
            businessId={profile.id}
            businessName={profile.name}
            onDelete={onDelete}
          />
          <BusinessRating rating={profile.ratings} />
        </div>

        {/* Bottom Section - Business Info */}
        <BusinessInfo 
          category={profile.category}
          name={profile.name}
          address={profile.address}
        />
      </div>

      {/* Hover Effect */}
      <div 
        className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
      >
        <div className="absolute bottom-4 right-4">
          <button className="bg-accent text-white px-6 py-2 rounded-full font-semibold hover:bg-accent/90 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </Card>
  );
};