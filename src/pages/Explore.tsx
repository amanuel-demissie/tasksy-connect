import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const Explore = () => {
  const filters = ["All", "Popular", "Trending", "New", "Near Me"];

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
              variant="outline"
              className="bg-white/80 backdrop-blur-sm whitespace-nowrap"
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;