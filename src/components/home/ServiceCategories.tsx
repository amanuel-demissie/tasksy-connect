
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Scissors, Utensils, Briefcase, Home, Package } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import { ScrollArea } from "@/components/ui/scroll-area";

type ServiceCategory = Database['public']['Enums']['service_category'] | "others";

const serviceCategories = [
  {
    id: "beauty",
    name: "Beauty & Wellness",
    icon: <Scissors className="w-8 h-8" />,
    description: "Hair, Nails, Spa & More"
  },
  {
    id: "dining",
    name: "Dining",
    icon: <Utensils className="w-8 h-8" />,
    description: "Restaurants & Cafes"
  },
  {
    id: "professional",
    name: "Professional Services",
    icon: <Briefcase className="w-8 h-8" />,
    description: "Freelancers & Experts"
  },
  {
    id: "home",
    name: "Home Services",
    icon: <Home className="w-8 h-8" />,
    description: "Cleaning, Repairs & More"
  },
  {
    id: "others",
    name: "Others",
    icon: <Package className="w-8 h-8" />,
    description: "Miscellaneous Services"
  },
];

interface ServiceCategoriesProps {
  onCategoryClick: (categoryId: string) => void;
}

const ServiceCategories = ({ onCategoryClick }: ServiceCategoriesProps) => (
  <ScrollArea className="h-[calc(100vh-200px)] pr-4">
    <div className="flex flex-col space-y-4 pb-4">
      {serviceCategories.map((category) => (
        <Card 
          key={category.id}
          className="flex-shrink-0 w-full group hover:border-accent transition-colors duration-200 bg-[#1A1F2C] backdrop-blur-sm cursor-pointer relative"
          onClick={() => onCategoryClick(category.id)}
        >
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center py-8 px-3">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:bg-accent/20">
                {React.cloneElement(category.icon, {
                  className: "w-10 h-10 text-accent",
                })}
              </div>
              <div className="space-y-1 text-center">
                <h3 className="font-medium text-neutral-800">{category.name}</h3>
                <p className="text-sm text-neutral-600">{category.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </ScrollArea>
);

export default ServiceCategories;
