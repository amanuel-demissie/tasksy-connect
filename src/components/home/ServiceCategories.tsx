import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Scissors, Utensils, Briefcase, Home } from "lucide-react";

const serviceCategories = [
  {
    id: "beauty",
    name: "Beauty & Wellness",
    icon: <Scissors className="w-6 h-6" />,
    description: "Hair, Nails, Spa & More",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901"
  },
  {
    id: "dining",
    name: "Dining",
    icon: <Utensils className="w-6 h-6" />,
    description: "Restaurants & Cafes",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"
  },
  {
    id: "professional",
    name: "Professional Services",
    icon: <Briefcase className="w-6 h-6" />,
    description: "Freelancers & Experts",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
  },
  {
    id: "home",
    name: "Home Services",
    icon: <Home className="w-6 h-6" />,
    description: "Cleaning, Repairs & More",
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04"
  },
];

interface ServiceCategoriesProps {
  onCategoryClick: (categoryId: string) => void;
}

const ServiceCategories = ({ onCategoryClick }: ServiceCategoriesProps) => (
  <div className="overflow-x-auto">
    <div className="flex space-x-4 pb-4">
      {serviceCategories.map((category) => (
        <Card 
          key={category.id}
          className="flex-shrink-0 w-72 group hover:border-accent transition-colors duration-200 bg-white/80 backdrop-blur-sm cursor-pointer relative"
          onClick={() => onCategoryClick(category.id)}
        >
          <CardContent className="p-0">
            <div className="relative">
              <img 
                src={category.image} 
                alt={category.name}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <div className="absolute top-2 right-2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                {React.cloneElement(category.icon, {
                  className: "w-6 h-6 text-accent",
                })}
              </div>
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-medium text-neutral-800">{category.name}</h3>
              <p className="text-sm text-neutral-600">{category.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default ServiceCategories;