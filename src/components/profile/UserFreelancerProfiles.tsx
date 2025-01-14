/**
 * UserFreelancerProfiles Component
 * 
 * Displays a list of freelancer profiles associated with the current user.
 * Each profile is displayed in a card format with key information and is clickable
 * to navigate to the detailed view.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {FreelancerProfile[]} props.profiles - Array of freelancer profiles to display
 * 
 * @example
 * ```tsx
 * <UserFreelancerProfiles profiles={freelancerProfiles} />
 * ```
 */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
}

interface UserFreelancerProfilesProps {
  profiles: FreelancerProfile[];
}

export const UserFreelancerProfiles = ({ profiles }: UserFreelancerProfilesProps) => {
  const navigate = useNavigate();

  // Don't render anything if there are no profiles
  if (profiles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-primary">Your Freelancer Profiles</h2>
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {profiles.map((profile) => (
              <CarouselItem key={profile.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card 
                  className="cursor-pointer hover:bg-accent/5 transition-colors"
                  onClick={() => navigate(`/freelancer/${profile.id}`)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5" />
                      {profile.full_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="font-medium">{profile.title}</p>
                    {profile.bio && (
                      <p className="text-sm text-muted-foreground">{profile.bio}</p>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="inline-block px-2 py-1 rounded-full bg-primary/10 text-primary text-sm">
                        {profile.category}
                      </span>
                      {profile.hourly_rate && (
                        <div className="flex items-center gap-1 text-sm">
                          <DollarSign className="w-4 h-4" />
                          {profile.hourly_rate}/hr
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      </div>
    </div>
  );
};