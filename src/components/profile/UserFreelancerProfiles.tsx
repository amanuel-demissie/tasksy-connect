import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DeleteFreelancerDialog } from './DeleteFreelancerDialog';
import { getImageUrl } from '@/utils/imageUtils';
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
  /** Optional profile image URL */
  image_url: string | null;
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
 * - Background image display with fallback
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
  const fallbackImage = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d';

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
                  className="cursor-pointer hover:bg-accent/5 transition-colors relative h-[300px] overflow-hidden"
                  onClick={() => navigate(`/freelancer-profile/${profile.id}`)}
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
                    <div className="space-y-2">
                      <p className="font-medium">{profile.title}</p>
                      {profile.bio && (
                        <p className="text-sm text-white/80">{profile.bio}</p>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="inline-block px-2 py-1 rounded-full bg-primary/10 text-white text-sm">
                          {profile.category}
                        </span>
                        {profile.hourly_rate && (
                          <div className="flex items-center gap-1 text-sm">
                            <DollarSign className="w-4 h-4" />
                            {profile.hourly_rate}/hr
                          </div>
                        )}
                      </div>
                    </div>
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