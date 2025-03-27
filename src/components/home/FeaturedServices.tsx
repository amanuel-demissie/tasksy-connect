
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { getImageUrl } from "@/utils/imageUtils";
import { useNavigate } from "react-router-dom";

const FeaturedServices = () => {
  const navigate = useNavigate();
  const { data: featuredProfiles, isLoading } = useQuery({
    queryKey: ['featuredProfiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_profiles')
        .select(`
          *,
          profiles:owner_id (
            email,
            username
          )
        `)
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-800">Featured Services</h2>
        <div className="overflow-x-auto">
          <div className="flex space-x-4 pb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="flex-shrink-0 w-72 bg-[#1A1F2C]/80 backdrop-blur-sm border-accent/10 animate-pulse">
                <CardContent className="flex items-center p-4 h-24" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-neutral-800">Featured Services</h2>
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-4">
          {featuredProfiles?.map((profile) => (
            <Card 
              key={profile.id} 
              className="flex-shrink-0 w-72 bg-[#1A1F2C]/90 backdrop-blur-sm border border-accent/10 
                hover:shadow-lg hover:shadow-accent/20 hover:translate-y-[-4px] transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/business-profile/${profile.id}`)}
            >
              <CardContent className="flex items-center p-4">
                <div className="h-12 w-12 rounded-full bg-accent/10 overflow-hidden flex items-center justify-center">
                  {profile.image_url ? (
                    <img 
                      src={getImageUrl(profile.image_url)} 
                      alt={profile.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  ) : (
                    <Star className="w-6 h-6 text-accent" />
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-medium text-white truncate">
                    {profile.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-neutral-400 truncate">
                      {profile.profiles?.username || profile.profiles?.email}
                    </p>
                    {profile.ratings && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-white">{profile.ratings.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedServices;
