import React from 'react';
import { Star } from 'lucide-react';

interface BusinessRatingProps {
  rating?: number | null;
}

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