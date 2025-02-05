
import { useQuery } from "@tanstack/react-query";
import ServiceCard from "./ServiceCard";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Scissors, Utensils, Briefcase, Home } from "lucide-react";

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

  const getCategoryIcon = () => {
    switch (category) {
      case "beauty":
        return <Scissors className="w-6 h-6 text-accent" />;
      case "dining":
        return <Utensils className="w-6 h-6 text-accent" />;
      case "professional":
        return <Briefcase className="w-6 h-6 text-accent" />;
      case "home":
        return <Home className="w-6 h-6 text-accent" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div id={category} className="space-y-4 py-0">
        <h2 className="text-lg font-semibold text-neutral-800 capitalize flex items-center gap-2">
          {getCategoryIcon()}
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
      <h2 className="text-lg font-semibold text-neutral-800 capitalize flex items-center gap-2">
        {getCategoryIcon()}
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

