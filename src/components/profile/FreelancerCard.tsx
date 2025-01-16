import React from 'react';
import { Card } from "@/components/ui/card";
import { User, DollarSign } from 'lucide-react';
import { DeleteFreelancerDialog } from './DeleteFreelancerDialog';
import { getImageUrl } from '@/utils/imageUtils';
import { FreelancerInfo } from './FreelancerInfo';

interface FreelancerProfile {
  id: string;
  full_name: string;
  title: string;
  bio: string | null;
  category: string;
  hourly_rate: number | null;
  image_url: string | null;
}

interface FreelancerCardProps {
  profile: FreelancerProfile;
  onClick: () => void;
  onDelete: (id: string) => void;
}

export const FreelancerCard = ({ profile, onClick, onDelete }: FreelancerCardProps) => {
  const fallbackImage = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d';

  return (
    <Card 
      className="cursor-pointer hover:bg-accent/5 transition-colors relative h-[300px] overflow-hidden"
      onClick={onClick}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={getImageUrl(profile.image_url)}
          alt={profile.full_name}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.log('Image failed to load, using fallback:', profile.image_url);
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative h-full p-6 flex flex-col justify-between text-white">
        <div className="flex justify-between items-start">
          <div className="text-lg flex items-center gap-2">
            <User className="w-5 h-5" />
            {profile.full_name}
          </div>
          <DeleteFreelancerDialog 
            freelancerId={profile.id}
            freelancerName={profile.full_name}
            onDelete={() => onDelete(profile.id)}
          />
        </div>
        <FreelancerInfo 
          title={profile.title}
          bio={profile.bio}
          category={profile.category}
          hourlyRate={profile.hourly_rate}
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