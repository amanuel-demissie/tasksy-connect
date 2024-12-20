import { Card, CardContent } from "@/components/ui/card";

const recommendedServices = {
  beauty: [
    { 
      id: 1, 
      name: "Luxe Hair Salon", 
      rating: "4.9", 
      reviews: 120, 
      image: "/lovable-uploads/7d30a090-07ff-4f11-aea4-de8f03072091.png",
      provider: "Sarah Williams",
      service: "Haircut & Styling",
      address: "123 Beauty Lane, Suite 100"
    },
    { 
      id: 2, 
      name: "Zen Spa & Wellness", 
      rating: "4.8", 
      reviews: 95,
      image: "/lovable-uploads/7d30a090-07ff-4f11-aea4-de8f03072091.png",
      provider: "Emily Spa",
      service: "Full Body Massage",
      address: "234 Relax Rd"
    },
    { 
      id: 3, 
      name: "Glow Beauty Studio", 
      rating: "4.7", 
      reviews: 88,
      image: "/lovable-uploads/7d30a090-07ff-4f11-aea4-de8f03072091.png",
      provider: "Anna Glow",
      service: "Facial Treatment",
      address: "345 Beauty Blvd"
    },
    { 
      id: 4, 
      name: "Elite Nails", 
      rating: "4.6", 
      reviews: 75,
      image: "/lovable-uploads/7d30a090-07ff-4f11-aea4-de8f03072091.png",
      provider: "Nail Expert",
      service: "Manicure & Pedicure",
      address: "456 Nail St"
    },
  ],
  dining: [
    { 
      id: 1, 
      name: "The Fine Palate", 
      rating: "4.9", 
      reviews: 230,
      image: "/lovable-uploads/7d30a090-07ff-4f11-aea4-de8f03072091.png",
      provider: "Chef Michael Brown",
      service: "Fine Dining",
      address: "456 Culinary Ave"
    },
    { 
      id: 2, 
      name: "Sushi Master", 
      rating: "4.8", 
      reviews: 180,
      image: "/lovable-uploads/7d30a090-07ff-4f11-aea4-de8f03072091.png",
      provider: "Sushi Chef",
      service: "Sushi & Sashimi",
      address: "567 Sushi St"
    },
    { 
      id: 3, 
      name: "Bistro Central", 
      rating: "4.7", 
      reviews: 150,
      image: "/lovable-uploads/7d30a090-07ff-4f11-aea4-de8f03072091.png",
      provider: "Bistro Chef",
      service: "Casual Dining",
      address: "678 Bistro Blvd"
    },
    { 
      id: 4, 
      name: "Garden Cafe", 
      rating: "4.6", 
      reviews: 120,
      image: "/lovable-uploads/7d30a090-07ff-4f11-aea4-de8f03072091.png",
      provider: "Cafe Owner",
      service: "Coffee & Snacks",
      address: "789 Garden St"
    },
  ],
  professional: [
    { 
      id: 1, 
      name: "Tech Solutions Pro", 
      rating: "4.9", 
      reviews: 89,
      image: "/lovable-uploads/7d30a090-07ff-4f11-aea4-de8f03072091.png",
      provider: "John Tech",
      service: "IT Consulting",
      address: "789 Tech Boulevard"
    },
    { 
      id: 2, 
      name: "Legal Advisors", 
      rating: "4.8", 
      reviews: 76,
      image: "/lovable-uploads/7d30a090-07ff-4f11-aea4-de8f03072091.png",
      provider: "Lawyer Jane",
      service: "Legal Consulting",
      address: "890 Law St"
    },
    { 
      id: 3, 
      name: "Financial Experts", 
      rating: "4.7", 
      reviews: 65,
      image: "/lovable-uploads/7d30a090-07ff-4f11-aea4-de8f03072091.png",
      provider: "Finance Guru",
      service: "Financial Planning",
      address: "901 Finance Ave"
    },
    { 
      id: 4, 
      name: "Business Consultants", 
      rating: "4.6", 
      reviews: 54,
      image: "/lovable-uploads/7d30a090-07ff-4f11-aea4-de8f03072091.png",
      provider: "Consultant Pro",
      service: "Business Strategy",
      address: "123 Business Rd"
    },
  ],
  home: [
    { 
      id: 1, 
      name: "Premium Cleaners", 
      rating: "4.9", 
      reviews: 145,
      image: "/lovable-uploads/7d30a090-07ff-4f11-aea4-de8f03072091.png",
      provider: "Mary Clean",
      service: "Home Cleaning",
      address: "321 Home Street"
    },
    { 
      id: 2, 
      name: "HandyFix Pro", 
      rating: "4.8", 
      reviews: 132,
      image: "/lovable-uploads/7d30a090-07ff-4f11-aea4-de8f03072091.png",
      provider: "Handy Man",
      service: "Home Repairs",
      address: "432 Fix It Rd"
    },
    { 
      id: 3, 
      name: "Garden Masters", 
      rating: "4.7", 
      reviews: 98,
      image: "/lovable-uploads/7d30a090-07ff-4f11-aea4-de8f03072091.png",
      provider: "Gardener Joe",
      service: "Landscaping",
      address: "543 Garden Ave"
    },
    { 
      id: 4, 
      name: "Home Security Experts", 
      rating: "4.6", 
      reviews: 87,
      image: "/lovable-uploads/7d30a090-07ff-4f11-aea4-de8f03072091.png",
      provider: "Security Pro",
      service: "Security Systems",
      address: "654 Security Blvd"
    },
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
          <Card key={service.id} className="flex-shrink-0 w-80 bg-white/80 backdrop-blur-sm border-neutral-200">
            <div className="relative">
              <img 
                src={service.image} 
                alt={service.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-1">
                <span className="text-xl font-bold">{service.rating}</span>
                <span className="text-sm text-neutral-600"> ({service.reviews} reviews)</span>
              </div>
            </div>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <img 
                  src="/placeholder.svg"
                  alt={service.provider}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-medium text-neutral-900">{service.provider}</h3>
                  <p className="text-sm text-neutral-600">{service.service}</p>
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-semibold text-neutral-900">{service.name}</h4>
                <p className="text-sm text-neutral-600">{service.address}</p>
              </div>
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
