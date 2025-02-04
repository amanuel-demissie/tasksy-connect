
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Scissors, Utensils, Briefcase, Home } from "lucide-react";
import beautyImg from "@/assets/categories/beauty.png";
import diningImg from "@/assets/categories/dining.png";
import professionalImg from "@/assets/categories/professional.png";
import homeImg from "@/assets/categories/home.png";

const serviceCategories = [
  {
    id: "beauty",
    name: "Beauty & Wellness",
    icon: <Scissors className="w-8 h-8" />,
    description: "Hair, Nails, Spa & More",
    image: beautyImg
  },
  {
    id: "dining",
    name: "Dining",
    icon: <Utensils className="w-8 h-8" />,
    description: "Restaurants & Cafes",
    image: diningImg
  },
  {
    id: "professional",
    name: "Professional Services",
    icon: <Briefcase className="w-8 h-8" />,
    description: "Freelancers & Experts",
    image: professionalImg
  },
  {
    id: "home",
    name: "Home Services",
    icon: <Home className="w-8 h-8" />,
    description: "Cleaning, Repairs & More",
    image: homeImg
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
          className="flex-shrink-0 w-64 group hover:border-accent transition-colors duration-200 bg-[#1A1F2C] backdrop-blur-sm cursor-pointer relative"
          onClick={() => onCategoryClick(category.id)}
        >
          <CardContent className="p-0">
            <div className="relative">
              <img 
                src={category.image} 
                alt={category.name}
                className="w-full h-32 object-cover rounded-t-lg"
              />
              <div className="absolute top-2 right-2 w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                {React.cloneElement(category.icon, {
                  className: "w-8 h-8 text-accent",
                })}
              </div>
            </div>
            <div className="p-3 space-y-1">
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
