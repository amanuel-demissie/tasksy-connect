import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BusinessProfile {
  id: string;
  name: string;
  description: string | null;
  category: string;
  address: string | null;
  image_url: string | null;
}

interface UserBusinessProfilesProps {
  profiles: BusinessProfile[];
}

export const UserBusinessProfiles = ({ profiles }: UserBusinessProfilesProps) => {
  const navigate = useNavigate();

  if (profiles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-primary">Your Business Profiles</h2>
      <div className="grid gap-4">
        {profiles.map((profile) => (
          <Card 
            key={profile.id}
            className="cursor-pointer hover:bg-accent/5 transition-colors"
            onClick={() => navigate(`/business/${profile.id}`)}
          >
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {profile.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {profile.description && (
                <p className="text-sm text-muted-foreground">{profile.description}</p>
              )}
              {profile.address && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {profile.address}
                </div>
              )}
              <div className="text-sm">
                <span className="inline-block px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {profile.category}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};