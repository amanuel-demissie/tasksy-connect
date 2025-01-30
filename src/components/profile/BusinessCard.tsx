import React from 'react';
import { Card } from "@/components/ui/card";
import { DeleteBusinessDialog } from './DeleteBusinessDialog';
import { BusinessRating } from './BusinessRating';
import { BusinessInfo } from './BusinessInfo';
import { getImageUrl } from '@/utils/imageUtils';
import { useNavigate } from 'react-router-dom';

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
  onClick?: () => void;
  onDelete?: () => void;
}

/**
 * BusinessCard Component
 * 
 * Displays a business profile card with image, details, and actions.
 * Supports navigation to edit view and deletion functionality.
 * 
 * @component
 * @param {BusinessCardProps} props - Component props
 * @returns {JSX.Element} Rendered business card
 */
export const BusinessCard = ({ profile, onDelete }: BusinessCardProps) => {
  const [imageError, setImageError] = React.useState(false);
  const fallbackImage = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d';
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/business-profile/${profile.id}/edit`);
  };

  return (
    <Card 
      className="relative overflow-hidden cursor-pointer group h-[300px]"
      onClick={handleClick}
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

      {/* Edit Button - Always Visible */}
      <div className="absolute bottom-4 right-4">
        <button className="bg-accent text-white px-6 py-2 rounded-full font-semibold hover:bg-accent/90 transition-colors">
          Edit Profile
        </button>
      </div>
    </Card>
  );
};