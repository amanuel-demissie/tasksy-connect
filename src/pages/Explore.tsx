
/**
 * Explore Page Component
 * 
 * Provides a search interface for discovering services.
 * Includes search functionality and filtering options.
 * 
 * @component
 * @example
 * ```tsx
 * <Explore />
 * ```
 */
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Database } from "@/integrations/supabase/types";
import RecommendedServices from "@/components/home/RecommendedServices";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ServiceSection from "@/components/home/ServiceSection";

type ServiceCategory = Database['public']['Enums']['service_category'];
const categories: ServiceCategory[] = ["beauty", "dining", "professional", "home"];

const Explore = () => {
  /**
   * Available filter options for service discovery
   */
  const filters = ["All", "Popular", "Trending", "New", "Near Me"];
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeTab, setActiveTab] = useState<"all" | ServiceCategory>("all");

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
  };

  return (
    <div className="min-h-screen bg-secondary pb-20">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
          <Input
            placeholder="Search services..."
            className="pl-10 bg-white/80 backdrop-blur-sm border-neutral-200"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              className={activeFilter === filter 
                ? "bg-accent text-white" 
                : "bg-[#1A1F2C] backdrop-blur-sm whitespace-nowrap"}
              onClick={() => handleFilterClick(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "all" | ServiceCategory)} className="w-full">
          <TabsList className="w-full bg-[#1A1F2C]/80 mb-6 overflow-x-auto flex-nowrap">
            <TabsTrigger value="all" className="flex-1">All Services</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="flex-1 capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all" className="space-y-8 mt-4">
            {categories.map((category) => (
              <ServiceSection key={category} category={category} />
            ))}
          </TabsContent>
          
          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-4">
              <ServiceSection category={category} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Explore;
