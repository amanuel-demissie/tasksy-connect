
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { getImageUrl } from "@/utils/imageUtils";

const FeaturedServices = () => {
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
              <Card key={i} className="flex-shrink-0 w-72 bg-[#1A1F2C] backdrop-blur-sm border-neutral-200 animate-pulse">
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
            <Card key={profile.id} className="flex-shrink-0 w-72 bg-[#1A1F2C] backdrop-blur-sm border-neutral-200">
              <CardContent className="flex items-center p-4">
                <div className="h-12 w-12 rounded-full bg-neutral-100 overflow-hidden">
                  {profile.image_url ? (
                    <img 
                      src={getImageUrl(profile.image_url)} 
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Star className="w-6 h-6 text-accent m-3" />
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-neutral-800">
                    {profile.name}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {profile.ratings ? `⭐️ ${profile.ratings}` : 'New'} • {profile.profiles?.username || profile.profiles?.email}
                  </p>
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
