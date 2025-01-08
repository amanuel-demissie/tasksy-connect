import React from 'react';
import { Star } from 'lucide-react';

/**
 * Props for the BusinessRating component
 * @interface BusinessRatingProps
 */
interface BusinessRatingProps {
  /** The rating value to display (optional) */
  rating?: number | null;
}

/**
 * BusinessRating Component
 * 
 * Displays a business rating with a star icon.
 * If no rating is provided, defaults to "5.0".
 * 
 * @component
 * @example
 * ```tsx
 * <BusinessRating rating={4.5} />
 * ```
 */
export const BusinessRating = ({ rating }: BusinessRatingProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl font-bold">
        {rating?.toFixed(1) || "5.0"}
      </span>
      <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
    </div>
  );
};