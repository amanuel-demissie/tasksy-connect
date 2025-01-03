import { useState } from "react";
import { Plus } from "lucide-react";
import SearchBar from "@/components/home/SearchBar";
import ServiceCategories from "@/components/home/ServiceCategories";
import FeaturedServices from "@/components/home/FeaturedServices";
import UpcomingAppointments from "@/components/home/UpcomingAppointments";
import RecommendedServices from "@/components/home/RecommendedServices";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateProfileDialog from "@/components/forms/CreateProfileDialog";

const Index = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [profileType, setProfileType] = useState<"business" | "freelancer" | null>(null);

  const scrollToSection = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCreateProfile = (type: "business" | "freelancer") => {
    setProfileType(type);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-secondary pb-20">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-primary">
              Create, Find & Book Services
            </h1>
            <p className="text-neutral-600">
              Connect with customers and services with ease
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleCreateProfile("business")}>
                Create Business Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCreateProfile("freelancer")}>
                Create Freelancer Profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <SearchBar />
        <ServiceCategories onCategoryClick={scrollToSection} />
        <FeaturedServices />
        <UpcomingAppointments />
        <RecommendedServices />

        <CreateProfileDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setProfileType(null);
          }}
          type={profileType}
        />
      </div>
    </div>
  );
};

export default Index;