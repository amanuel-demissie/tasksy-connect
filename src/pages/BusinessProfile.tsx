import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { BusinessInfo } from "@/components/profile/BusinessInfo";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface BusinessService {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
}

interface BusinessProfileData {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  category: string;
  business_services: BusinessService[];
  ratings?: number | null;
  review_count?: number | null;
}

const BusinessProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<BusinessProfileData | null>(null);

  useEffect(() => {
    const fetchBusinessProfile = async () => {
      if (!id) return;
      try {
        const {
          data,
          error
        } = await supabase.from('business_profiles').select(`
            *,
            business_services (
              id,
              name,
              description,
              price,
              duration
            )
          `).eq('id', id).maybeSingle();
        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching business profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBusinessProfile();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold">Business not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6 space-y-8">
        <div className="flex items-start gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="mt-1"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <BusinessInfo 
            category={profile.category}
            name={profile.name}
            address={profile.address}
            rating={profile.ratings}
            reviews={profile.review_count}
            tags={["Entrepreneur"]}
          />
        </div>

        {profile.description && (
          <div className="py-4 border-b">
            <p className="text-gray-600">{profile.description}</p>
          </div>
        )}

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Services</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {profile.business_services?.map(service => <div key={service.id} className="p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col h-full">
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                    {service.description && <p className="mt-2 text-sm text-gray-500">{service.description}</p>}
                    <div className="mt-0 flex items-center gap-2 text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{service.duration} min</span>
                    </div>
                  </div>
                  <div className="mt-0 pt-4 border-t flex items-center justify-between">
                    <span className="text-xl font-semibold text-gray-900">
                      ${service.price.toFixed(2)}
                    </span>
                    <Button onClick={() => navigate('/messages')} className="bg-gray-800 hover:bg-gray-700">
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;
