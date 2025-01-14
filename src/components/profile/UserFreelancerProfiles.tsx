import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DeleteFreelancerDialog } from './DeleteFreelancerDialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

/**
 * Interface defining the structure of a freelancer profile
 * @interface FreelancerProfile
 */
interface FreelancerProfile {
  /** Unique identifier for the freelancer profile */
  id: string;
  /** Full name of the freelancer */
  full_name: string;
  /** Professional title of the freelancer */
  title: string;
  /** Optional biography or description */
  bio: string | null;
  /** Category of service the freelancer provides */
  category: string;
  /** Optional hourly rate for services */
  hourly_rate: number | null;
}

/**
 * Props for the UserFreelancerProfiles component
 * @interface UserFreelancerProfilesProps
 */
interface UserFreelancerProfilesProps {
  /** Array of freelancer profiles to display */
  profiles: FreelancerProfile[];
}

/**
 * UserFreelancerProfiles Component
 * 
 * Displays a carousel of freelancer profile cards for a user. Each card shows
 * professional information and provides navigation to the detailed view.
 * Includes functionality for profile deletion and state management.
 * 
 * Features:
 * - Local state management for profile deletion
 * - Responsive carousel layout
 * - Conditional navigation arrows
 * - Delete functionality with confirmation dialog
 * - Hourly rate display when available
 * 
 * @component
 * @example
 * ```tsx
 * const profiles = [{
 *   id: '123',
 *   full_name: 'John Doe',
 *   title: 'Software Developer',
 *   category: 'professional',
 *   // ... other properties
 * }];
 * 
 * <UserFreelancerProfiles profiles={profiles} />
 * ```
 */
export const UserFreelancerProfiles = ({ profiles }: UserFreelancerProfilesProps) => {
  const navigate = useNavigate();
  const [localProfiles, setLocalProfiles] = React.useState(profiles);

  // Update local state when props change
  React.useEffect(() => {
    setLocalProfiles(profiles);
  }, [profiles]);

  // Handler for profile deletion
  const handleDelete = React.useCallback((deletedId: string) => {
    setLocalProfiles(prev => prev.filter(profile => profile.id !== deletedId));
  }, []);

  // Don't render anything if there are no profiles
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
                <Card 
                  className="cursor-pointer hover:bg-accent/5 transition-colors relative"
                  onClick={() => navigate(`/freelancer-profile/${profile.id}`)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="w-5 h-5" />
                        {profile.full_name}
                      </CardTitle>
                      <DeleteFreelancerDialog 
                        freelancerId={profile.id}
                        freelancerName={profile.full_name}
                        onDelete={() => handleDelete(profile.id)}
                      />
                    </div>
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