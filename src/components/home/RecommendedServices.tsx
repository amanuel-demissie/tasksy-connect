import { Card, CardContent } from "@/components/ui/card";

const recommendedServices = {
  beauty: [
    { id: 1, name: "Luxe Hair Salon", rating: "4.9", reviews: 120 },
    { id: 2, name: "Zen Spa & Wellness", rating: "4.8", reviews: 95 },
    { id: 3, name: "Glow Beauty Studio", rating: "4.7", reviews: 88 },
    { id: 4, name: "Elite Nails", rating: "4.6", reviews: 75 },
  ],
  dining: [
    { id: 1, name: "The Fine Palate", rating: "4.9", reviews: 230 },
    { id: 2, name: "Sushi Master", rating: "4.8", reviews: 180 },
    { id: 3, name: "Bistro Central", rating: "4.7", reviews: 150 },
    { id: 4, name: "Garden Cafe", rating: "4.6", reviews: 120 },
  ],
  professional: [
    { id: 1, name: "Tech Solutions Pro", rating: "4.9", reviews: 89 },
    { id: 2, name: "Legal Advisors", rating: "4.8", reviews: 76 },
    { id: 3, name: "Financial Experts", rating: "4.7", reviews: 65 },
    { id: 4, name: "Business Consultants", rating: "4.6", reviews: 54 },
  ],
  home: [
    { id: 1, name: "Premium Cleaners", rating: "4.9", reviews: 145 },
    { id: 2, name: "HandyFix Pro", rating: "4.8", reviews: 132 },
    { id: 3, name: "Garden Masters", rating: "4.7", reviews: 98 },
    { id: 4, name: "Home Security Experts", rating: "4.6", reviews: 87 },
  ],
};

const ServiceSection = ({ category, services }) => (
  <div id={category} className="space-y-4 py-0">
    <h2 className="text-lg font-semibold text-neutral-800 capitalize">
      {category.replace("-", " ")} Services
    </h2>
    <div className="overflow-x-auto">
      <div className="flex space-x-4 pb-4">
        {services.map((service) => (
          <Card key={service.id} className="flex-shrink-0 w-72 bg-white/80 backdrop-blur-sm border-neutral-200">
            <CardContent className="p-4">
              <h3 className="font-medium text-neutral-800">{service.name}</h3>
              <p className="text-sm text-neutral-600">
                ⭐️ {service.rating} ({service.reviews} reviews)
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

const RecommendedServices = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-semibold text-primary">Recommended Services</h2>
    {Object.entries(recommendedServices).map(([category, services]) => (
      <ServiceSection key={category} category={category} services={services} />
    ))}
  </div>
);

export default RecommendedServices;