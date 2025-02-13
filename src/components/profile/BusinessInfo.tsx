
import React from 'react';
import { MapPin, Star } from 'lucide-react';

/**
 * Props for the BusinessInfo component
 * @interface BusinessInfoProps
 */
interface BusinessInfoProps {
  /** The business category */
  category: string;
  /** The business name */
  name: string;
  /** The business address (optional) */
  address: string | null;
  /** The business rating (optional) */
  rating?: number | null;
  /** Number of reviews (optional) */
  reviews?: number | null;
  /** Additional categories or tags */
  tags?: string[];
}

/**
 * BusinessInfo Component
 * 
 * Displays basic business information including category, name, address, and ratings.
 * Uses icons from lucide-react for visual enhancement.
 * 
 * @component
 */
export const BusinessInfo = ({
  category,
  name,
  address,
  rating = null,
  reviews = null,
  tags = []
}: BusinessInfoProps) => {
  return (
    <div className="space-y-4">
      {/* Rating Section */}
      {(rating !== null || reviews !== null) && (
        <div className="flex items-center gap-2 text-2xl font-bold">
          {rating !== null && (
            <div className="flex items-center gap-1">
              <span>{rating.toFixed(1)}</span>
              <Star className="w-6 h-6 fill-current" />
            </div>
          )}
          {reviews !== null && (
            <span className="text-lg text-gray-600 font-normal">
              {reviews} reviews
            </span>
          )}
        </div>
      )}

      {/* Business Name */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">{name}</h1>
        
        {/* Categories and Tags */}
        <div className="flex items-center gap-3 text-gray-600">
          <span className="font-medium">{category}</span>
          {tags.map((tag, index) => (
            <React.Fragment key={tag}>
              {index > 0 && <span className="text-gray-400">|</span>}
              <span>{tag}</span>
            </React.Fragment>
          ))}
        </div>

        {/* Address */}
        {address && (
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-5 h-5" />
            <span>{address}</span>
          </div>
        )}
      </div>
    </div>
  );
};
