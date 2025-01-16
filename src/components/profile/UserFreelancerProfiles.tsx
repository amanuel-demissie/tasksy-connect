import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FreelancerCard } from './FreelancerCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface FreelancerProfile {
  id: string;
  full_name: string;
  title: string;
  bio: string | null;
  category: string;
  hourly_rate: number | null;
  image_url: string | null;
}

interface UserFreelancerProfilesProps {
  profiles: FreelancerProfile[];
}

export const UserFreelancerProfiles = ({ profiles }: UserFreelancerProfilesProps) => {
  const navigate = useNavigate();
  const [localProfiles, setLocalProfiles] = React.useState(profiles);

  React.useEffect(() => {
    setLocalProfiles(profiles);
  }, [profiles]);

  const handleDelete = React.useCallback((deletedId: string) => {
    setLocalProfiles(prev => prev.filter(profile => profile.id !== deletedId));
  }, []);

  if (localProfiles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-primary">Your Freelancer Profiles</h2>
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: localProfiles.length > 1,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {localProfiles.map((profile) => (
              <CarouselItem key={profile.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <FreelancerCard 
                  profile={profile}
                  onClick={() => navigate(`/freelancer-profile/${profile.id}`)}
                  onDelete={handleDelete}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {localProfiles.length > 1 && (
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