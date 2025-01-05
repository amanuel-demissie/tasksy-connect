/**
 * UserBusinessProfiles Component
 * 
 * Displays a list of business profiles associated with the current user.
 * Each profile is displayed in a card format with a background image and key information.
 * Cards are clickable to navigate to the detailed business view.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {BusinessProfile[]} props.profiles - Array of business profiles to display
 */
import React from 'react';
import { Card } from "@/components/ui/card";
import { Building2, MapPin, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

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
}

export const UserBusinessProfiles = ({ profiles }: UserBusinessProfilesProps) => {
  const navigate = useNavigate();

  if (profiles.length === 0) {
    return null;
  }

  const getImageUrl = (url: string | null) => {
    if (!url) return '/placeholder.svg';
    
    // Handle relative URLs
    if (url.startsWith('/')) return url;
    
    // Handle Supabase storage URLs
    if (url.startsWith('avatars/')) {
      try {
        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(url);
        return data.publicUrl;
      } catch {
        return '/placeholder.svg';
      }
    }
    
    // Handle full URLs
    try {
      const urlObj = new URL(url);
      // Remove any trailing colons that might cause issues
      return urlObj.toString().replace(/:+$/, '');
    } catch {
      return '/placeholder.svg';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-primary">Your Business Profiles</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {profiles.map((profile) => (
          <Card 
            key={profile.id}
            className="relative overflow-hidden cursor-pointer group h-[300px]"
            onClick={() => navigate(`/business/${profile.id}`)}
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <img 
                src={getImageUrl(profile.image_url)} 
                alt={profile.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
            </div>

            {/* Content */}
            <div className="relative h-full p-6 flex flex-col justify-between text-white">
              {/* Top Section - Ratings */}
              <div className="flex justify-end items-center gap-2">
                <span className="text-2xl font-bold">
                  {profile.ratings?.toFixed(1) || "5.0"}
                </span>
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              </div>

              {/* Bottom Section - Business Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm opacity-90">
                  <Building2 className="w-4 h-4" />
                  <span className="capitalize">{profile.category}</span>
                </div>
                
                <h3 className="text-2xl font-bold">{profile.name}</h3>
                
                {profile.address && (
                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <MapPin className="w-4 h-4" />
                    {profile.address}
                  </div>
                )}
              </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-4 right-4">
                <button className="bg-accent text-white px-6 py-2 rounded-full font-semibold hover:bg-accent/90 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};