
import { useQuery } from "@tanstack/react-query";
import ServiceCard from "./ServiceCard";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type ServiceCategory = Database['public']['Enums']['service_category'];

interface ServiceSectionProps {
  category: ServiceCategory;
}

const ServiceSection = ({ category }: ServiceSectionProps) => {
  const { data: services, isLoading } = useQuery({
    queryKey: ['businessProfiles', category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_profiles')
        .select(`
          *,
          profiles:owner_id (
            username,
            email
          )
        `)
        .eq('category', category);
      
      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <div id={category} className="space-y-4 py-0">
        <h2 className="text-lg font-semibold text-neutral-800 capitalize">
          {category.replace("_", " ")} Services
        </h2>
        <div className="overflow-x-auto">
          <div className="flex space-x-4 pb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-72 h-80 bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id={category} className="space-y-4 py-0">
      <h2 className="text-lg font-semibold text-neutral-800 capitalize">
        {category.replace("_", " ")} Services
      </h2>
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-4">
          {services?.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceSection;
