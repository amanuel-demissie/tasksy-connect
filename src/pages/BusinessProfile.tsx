
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Search, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

interface BusinessService {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
}

interface BusinessEmployee {
  id: string;
  name: string;
  title: string | null;
  bio: string | null;
  image_url: string | null;
}

interface BusinessProfileData {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  category: string;
  business_services: BusinessService[];
  employees?: BusinessEmployee[];
  ratings?: number | null;
  review_count?: number | null;
  image_url?: string | null;
}

const BusinessProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<BusinessProfileData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("services");

  useEffect(() => {
    const fetchBusinessProfile = async () => {
      if (!id) return;
      try {
        // Fetch business profile with services
        const { data, error } = await supabase
          .from('business_profiles')
          .select(`
            *,
            business_services (
              id,
              name,
              description,
              price,
              duration
            )
          `)
          .eq('id', id)
          .maybeSingle();
        
        if (error) throw error;
        
        // Fetch employees
        const { data: employeesData, error: employeesError } = await supabase
          .from('employees')
          .select('id, name, title, bio, image_url')
          .eq('business_id', id)
          .eq('is_active', true);
          
        if (employeesError) throw employeesError;
        
        // Combine data
        setProfile({
          ...data,
          employees: employeesData || []
        });
      } catch (error) {
        console.error('Error fetching business profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessProfile();
  }, [id]);

  const filteredServices = profile?.business_services?.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredEmployees = profile?.employees?.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-48 w-full rounded-lg" />
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="bg-background rounded-lg shadow-md">
          {/* Header Image */}
          <div className="relative h-48 w-full mb-4">
            <img
              src={profile.image_url || "https://placehold.co/600x300"}
              alt={profile.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 bg-violet-600 hover:bg-violet-500"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </div>

          <div className="p-4">
            {/* Business Header */}
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold text-foreground">{profile.name}</h1>
              <div className="flex items-center">
                {profile.ratings && (
                  <>
                    <span className="text-xl font-semibold">
                      {profile.ratings.toFixed(1)}
                    </span>
                    <svg
                      className="w-5 h-5 text-yellow-500 ml-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.122-6.533L0 6.545l6.545-.953L10 0l2.455 5.592L19 6.545l-5.244 4.012 1.122 6.533z" />
                    </svg>
                  </>
                )}
                {profile.review_count && (
                  <span className="text-muted-foreground ml-1">
                    {profile.review_count} reviews
                  </span>
                )}
              </div>
            </div>

            {/* Address and Category */}
            {profile.address && (
              <p className="text-muted-foreground mb-4">{profile.address}</p>
            )}
            <p className="text-muted-foreground mb-4">
              {profile.category} | Entrepreneur
            </p>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={`Search for ${activeTab === 'services' ? 'service' : 'team member'}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="services" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
              </TabsList>
              
              {/* Services Tab */}
              <TabsContent value="services">
                <h2 className="text-xl font-semibold mb-2">Popular Services</h2>
                <div className="bg-card p-4 rounded-lg space-y-4">
                  {filteredServices?.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      No services match your search
                    </p>
                  ) : (
                    filteredServices?.map((service) => (
                      <div
                        key={service.id}
                        className="flex justify-between items-start pb-4 last:pb-0 last:border-0 border-b border-border"
                      >
                        <div>
                          <h3 className="font-bold">{service.name}</h3>
                          {service.description && (
                            <p className="text-muted-foreground text-sm">
                              {service.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                          <span className="text-lg font-bold">
                            ${service.price.toFixed(2)}
                          </span>
                          <div className="flex items-center text-muted-foreground text-sm">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{service.duration}m</span>
                          </div>
                          <Button
                            onClick={() => navigate(`/booking/${profile.id}/${service.id}`)}
                            className="mt-1 bg-violet-600 hover:bg-violet-500"
                          >
                            Book
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
              
              {/* Team Tab */}
              <TabsContent value="team">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold">Our Team</h2>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{profile.employees?.length || 0} Members</span>
                  </div>
                </div>
                <div className="bg-card p-4 rounded-lg">
                  {!profile.employees || profile.employees.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      No team members listed
                    </p>
                  ) : filteredEmployees?.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      No team members match your search
                    </p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {filteredEmployees?.map((employee) => (
                        <div key={employee.id} className="border border-border rounded-lg p-4 flex items-start">
                          <Avatar className="h-12 w-12 mr-4">
                            <AvatarImage src={employee.image_url || undefined} alt={employee.name} />
                            <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{employee.name}</h3>
                            {employee.title && (
                              <p className="text-sm text-muted-foreground">{employee.title}</p>
                            )}
                            {employee.bio && (
                              <p className="text-sm mt-2">{employee.bio}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;
