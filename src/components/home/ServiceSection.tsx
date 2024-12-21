import ServiceCard from "./ServiceCard";

interface ServiceSectionProps {
  category: string;
  services: Array<{
    id: number;
    name: string;
    rating: string;
    reviews: number;
    image: string;
    provider: string;
    service: string;
    address: string;
  }>;
}

const ServiceSection = ({ category, services }: ServiceSectionProps) => (
  <div id={category} className="space-y-4 py-0">
    <h2 className="text-lg font-semibold text-neutral-800 capitalize">
      {category.replace("-", " ")} Services
    </h2>
    <div className="overflow-x-auto">
      <div className="flex space-x-4 pb-4">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  </div>
);

export default ServiceSection;