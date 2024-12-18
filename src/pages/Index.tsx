import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Scissors, Utensils, Briefcase, Home, Star } from "lucide-react";
import { Input } from "@/components/ui/input";

const serviceCategories = [
  {
    id: 1,
    name: "Beauty & Wellness",
    icon: <Scissors className="w-6 h-6" />,
    description: "Hair, Nails, Spa & More",
  },
  {
    id: 2,
    name: "Dining",
    icon: <Utensils className="w-6 h-6" />,
    description: "Restaurants & Cafes",
  },
  {
    id: 3,
    name: "Professional Services",
    icon: <Briefcase className="w-6 h-6" />,
    description: "Freelancers & Experts",
  },
  {
    id: 4,
    name: "Home Services",
    icon: <Home className="w-6 h-6" />,
    description: "Cleaning, Repairs & More",
  },
];

const FeaturedServices = () => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold text-neutral-800">Featured Services</h2>
    <ScrollArea className="h-[200px] w-full rounded-md">
      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="flex items-center p-4 bg-white/80 backdrop-blur-sm border-neutral-200">
            <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center">
              <Star className="w-6 h-6 text-accent" />
            </div>
            <CardContent className="flex-1 pl-4">
              <h3 className="font-medium text-neutral-800">Service Provider {i}</h3>
              <p className="text-sm text-neutral-600">⭐️ 4.9 (120 reviews)</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-secondary">
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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {serviceCategories.map((category) => (
            <Card
              key={category.id}
              className="group hover:border-accent transition-colors duration-200 bg-white/80 backdrop-blur-sm cursor-pointer"
            >
              <CardContent className="p-4 text-center space-y-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-accent/10 transition-colors duration-200">
                  {React.cloneElement(category.icon, {
                    className: "w-6 h-6 text-accent",
                  })}
                </div>
                <h3 className="font-medium text-neutral-800">{category.name}</h3>
                <p className="text-sm text-neutral-600">{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Services */}
        <FeaturedServices />
      </div>
    </div>
  );
};

export default Index;