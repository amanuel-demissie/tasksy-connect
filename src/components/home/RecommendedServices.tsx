
import ServiceSection from "./ServiceSection";
import type { Database } from "@/integrations/supabase/types";

type ServiceCategory = Database['public']['Enums']['service_category'];

const categories: ServiceCategory[] = ["beauty", "dining", "professional", "home"];

const RecommendedServices = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-semibold text-primary">Recommended Services</h2>
    {categories.map((category) => (
      <ServiceSection key={category} category={category} />
    ))}
  </div>
);

export default RecommendedServices;
