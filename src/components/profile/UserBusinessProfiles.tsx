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

/**
 * Interface defining the structure of a business profile
 * @interface BusinessProfile
 */
interface BusinessProfile {
  /** Unique identifier for the business profile */
  id: string;
  /** Name of the business */
  name: string;
  /** Optional description of the business */
  description: string | null;
  /** Category of service the business provides */
  category: string;
  /** Optional physical address of the business */
  address: string | null;
  /** Optional URL for the business profile image */
  image_url: string | null;
  /** Optional rating score for the business */
  ratings?: number | null;
}

/**
 * Props for the UserBusinessProfiles component
 * @interface UserBusinessProfilesProps
 */
interface UserBusinessProfilesProps {
  /** Array of business profiles to display */
  profiles: BusinessProfile[];
  /** Optional callback function triggered after a profile is deleted */
  onProfileDeleted?: () => void;
}

/**
 * UserBusinessProfiles Component
 * 
 * Displays a carousel of business profile cards for a user. Each card shows
 * basic business information and provides navigation to the detailed view.
 * The carousel includes navigation arrows when there are multiple profiles.
 * 
 * Features:
 * - Responsive carousel layout with different card sizes for different screen sizes
 * - Conditional rendering of navigation arrows based on number of profiles
 * - Click navigation to detailed business profile view
 * - Support for profile deletion with callback
 * 
 * @component
 * @example
 * ```tsx
 * const profiles = [{
 *   id: '123',
 *   name: 'My Business',
 *   category: 'retail',
 *   // ... other properties
 * }];
 * 
 * <UserBusinessProfiles 
 *   profiles={profiles}
 *   onProfileDeleted={() => console.log('Profile deleted')}
 * />
 * ```
 */
export const UserBusinessProfiles = ({ profiles, onProfileDeleted }: UserBusinessProfilesProps) => {
  const navigate = useNavigate();

  // Don't render anything if there are no profiles
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