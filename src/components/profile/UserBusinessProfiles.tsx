import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BusinessCard } from './BusinessCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface BusinessProfile {
  id: string;
  name: string;
  description: string | null;
  category: string;
  address: string | null;
  image_url: string | null;
  ratings?: number | null;
}

interface UserBusinessProfilesProps {
  profiles: BusinessProfile[];
  onProfileDeleted?: () => void;
}

export const UserBusinessProfiles = ({ profiles, onProfileDeleted }: UserBusinessProfilesProps) => {
  const navigate = useNavigate();

  if (profiles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-primary">Your Business Profiles</h2>
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: profiles.length > 1,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {profiles.map((profile) => (
              <CarouselItem key={profile.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <BusinessCard 
                  profile={profile}
                  onClick={() => navigate(`/business-profile/${profile.id}`)}
                  onDelete={onProfileDeleted}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {profiles.length > 1 && (
            <>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </>
          )}
        </Carousel>
      </div>
    </div>
  );
};