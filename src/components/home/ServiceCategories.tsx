import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Scissors, Utensils, Briefcase, Home } from "lucide-react";

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

interface ServiceCategoriesProps {
  onCategoryClick: (categoryId: string) => void;
}

const ServiceCategories = ({ onCategoryClick }: ServiceCategoriesProps) => (
  <div className="overflow-x-auto">
    <div className="flex space-x-4 pb-4">
      {serviceCategories.map((category) => (
        <Card 
          key={category.id}
          className="flex-shrink-0 w-72 group hover:border-accent transition-colors duration-200 bg-white/80 backdrop-blur-sm cursor-pointer"
          onClick={() => onCategoryClick(category.id)}
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
  </div>
);

export default ServiceCategories;