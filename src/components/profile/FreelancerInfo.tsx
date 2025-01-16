import React from 'react';
import { DollarSign } from 'lucide-react';

interface FreelancerInfoProps {
  title: string;
  bio: string | null;
  category: string;
  hourlyRate: number | null;
}

export const FreelancerInfo = ({ title, bio, category, hourlyRate }: FreelancerInfoProps) => {
  return (
    <div className="space-y-2">
      <p className="font-medium">{title}</p>
      {bio && (
        <p className="text-sm text-white/80">{bio}</p>
      )}
      <div className="flex justify-between items-center">
        <span className="inline-block px-2 py-1 rounded-full bg-primary/10 text-white text-sm">
          {category}
        </span>
        {hourlyRate && (
          <div className="flex items-center gap-1 text-sm">
            <DollarSign className="w-4 h-4" />
            {hourlyRate}/hr
          </div>
        )}
      </div>
    </div>
  );
};