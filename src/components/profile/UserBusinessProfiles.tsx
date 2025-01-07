import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BusinessCard } from './BusinessCard';

interface BusinessProfile {
  id: string;
  name: string;
  description: string | null;
  category: string;
  address: string | null;
  image_url: string | null;
  ratings?: number | null;
}

interface UserBusinessProfilesProps {
  profiles: BusinessProfile[];
  onProfileDeleted?: () => void;
}

export const UserBusinessProfiles = ({ profiles, onProfileDeleted }: UserBusinessProfilesProps) => {
  const navigate = useNavigate();

  if (profiles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-primary">Your Business Profiles</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {profiles.map((profile) => (
          <BusinessCard 
            key={profile.id}
            profile={profile}
            onClick={() => navigate(`/business/${profile.id}`)}
            onDelete={onProfileDeleted}
          />
        ))}
      </div>
    </div>
  );
};