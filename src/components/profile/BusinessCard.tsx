import React from 'react';
import { Card } from "@/components/ui/card";
import { DeleteBusinessDialog } from './DeleteBusinessDialog';
import { BusinessRating } from './BusinessRating';
import { BusinessInfo } from './BusinessInfo';
import { getImageUrl } from '@/utils/imageUtils';

/**
 * Interface defining the structure of a business profile
 * @interface BusinessProfile
 */
interface BusinessProfile {
  id: string;
  name: string;
  description: string | null;
  category: string;
  address: string | null;
  image_url: string | null;
  ratings?: number | null;
}

/**
 * Props for the BusinessCard component
 * @interface BusinessCardProps
 */
interface BusinessCardProps {
  /** The business profile data to display */
  profile: BusinessProfile;
  /** Callback function triggered when the card is clicked */
  onClick: () => void;
  /** Optional callback function triggered after successful deletion */
  onDelete?: () => void;
}

/**
 * BusinessCard Component
 * 
 * Displays a business profile in a card format with image, rating, and basic information.
 * Includes hover effects and a delete button with confirmation dialog.
 * 
 * @component
 * @example
 * ```tsx
 * const profile = {
 *   id: '123',
 *   name: 'Business Name',
 *   category: 'retail',
 *   address: '123 Main St'
 * };
 * 
 * <BusinessCard 
 *   profile={profile}
 *   onClick={() => console.log('Card clicked')}
 *   onDelete={() => console.log('Business deleted')}
 * />
 * ```
 */
export const BusinessCard = ({ profile, onClick, onDelete }: BusinessCardProps) => {
  const [imageError, setImageError] = React.useState(false);
  const fallbackImage = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d';

  return (
    <Card 
      className="relative overflow-hidden cursor-pointer group h-[300px]"
      onClick={onClick}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={imageError ? fallbackImage : getImageUrl(profile.image_url)}
          alt={profile.name}
          className="w-full h-full object-cover"
          onError={() => {
            console.log('Image failed to load, using fallback:', profile.image_url);
            setImageError(true);
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