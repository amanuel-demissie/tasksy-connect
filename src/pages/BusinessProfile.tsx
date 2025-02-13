
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
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
}

interface BusinessProfileData {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  category: string;
  business_services: BusinessService[];
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
        const { data, error } = await supabase
          .from('business_profiles')
          .select(`
            *,
            business_services (
              id,
              name,
              description,
              price
            )
          `)
          .eq('id', id)
          .maybeSingle();

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
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <BusinessInfo 
            category={profile.category}
            name={profile.name}
            address={profile.address}
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
            {profile.business_services?.map((service) => (
              <div 
                key={service.id}
                className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    {service.description && (
                      <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                    )}
                  </div>
                  <span className="font-semibold text-lg">
                    ${service.price.toFixed(2)}
                  </span>
                </div>
                <Button 
                  className="w-full mt-4"
                  onClick={() => navigate('/messages')} // Placeholder for booking functionality
                >
                  Book Now
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;
