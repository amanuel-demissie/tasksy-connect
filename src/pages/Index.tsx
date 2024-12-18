import React, { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Scissors, Utensils, Briefcase, Home, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";

const serviceCategories = [
  {
    id: "beauty",
    name: "Beauty & Wellness",
    icon: <Scissors className="w-6 h-6" />,
    description: "Hair, Nails, Spa & More",
  },
  {
    id: "dining",
    name: "Dining",
    icon: <Utensils className="w-6 h-6" />,
    description: "Restaurants & Cafes",
  },
  {
    id: "professional",
    name: "Professional Services",
    icon: <Briefcase className="w-6 h-6" />,
    description: "Freelancers & Experts",
  },
  {
    id: "home",
    name: "Home Services",
    icon: <Home className="w-6 h-6" />,
    description: "Cleaning, Repairs & More",
  },
];

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

const FeaturedServices = () => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold text-neutral-800">Featured Services</h2>
    <div className="overflow-x-auto">
      <div className="flex space-x-4 pb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="flex-shrink-0 w-72 bg-white/80 backdrop-blur-sm border-neutral-200">
            <CardContent className="flex items-center p-4">
              <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center">
                <Star className="w-6 h-6 text-accent" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-neutral-800">
                  Service Provider {i}
                </h3>
                <p className="text-sm text-neutral-600">⭐️ 4.9 (120 reviews)</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

const UpcomingAppointments = () => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold text-neutral-800">
      Upcoming Appointments
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Calendar className="w-full rounded-lg border bg-white/80 backdrop-blur-sm" />
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="flex-shrink-0 w-72 bg-white/80 backdrop-blur-sm border-neutral-200">
              <CardContent className="p-4">
                <h3 className="font-medium text-neutral-800">
                  Appointment {i}
                </h3>
                <p className="text-sm text-neutral-600">Tomorrow at 2:00 PM</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ServiceSection = ({ category, services }) => (
  <div id={category} className="space-y-4 py-8">
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

const Index = () => {
  const scrollToSection = (categoryId) => {
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-secondary pb-20">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold text-primary">
            Find & Book Services
          </h1>
          <p className="text-neutral-600">
            Discover and book local services with ease
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
          <Input
            placeholder="Search for services..."
            className="pl-10 bg-white/80 backdrop-blur-sm border-neutral-200"
          />
        </div>

        {/* Categories */}
        <div className="overflow-x-auto">
          <div className="flex space-x-4 pb-4">
            {serviceCategories.map((category) => (
              <Card 
                key={category.id}
                className="flex-shrink-0 w-72 group hover:border-accent transition-colors duration-200 bg-white/80 backdrop-blur-sm cursor-pointer"
                onClick={() => scrollToSection(category.id)}
              >
                <CardContent className="p-4 text-center space-y-2">
                  <div className="mx-auto w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-accent/10 transition-colors duration-200">
                    {React.cloneElement(category.icon, {
                      className: "w-6 h-6 text-accent",
                    })}
                  </div>
                  <h3 className="font-medium text-neutral-800">
                    {category.name}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Services */}
        <FeaturedServices />

        {/* Upcoming Appointments */}
        <UpcomingAppointments />

        {/* Recommended Services Sections */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-primary">Recommended Services</h2>
          {Object.entries(recommendedServices).map(([category, services]) => (
            <ServiceSection key={category} category={category} services={services} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;