import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Scissors, Utensils, Briefcase, Home, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Calendar } from "@/components/ui/calendar";

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
    <Carousel className="w-full">
      <CarouselContent>
        {[1, 2, 3, 4, 5].map((i) => (
          <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
            <Card className="bg-white/80 backdrop-blur-sm border-neutral-200">
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
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </div>
);

const UpcomingAppointments = () => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold text-neutral-800">
      Upcoming Appointments
    </h2>
    <Calendar className="rounded-lg border bg-white/80 backdrop-blur-sm" />
    <Carousel className="w-full">
      <CarouselContent>
        {[1, 2, 3].map((i) => (
          <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
            <Card className="bg-white/80 backdrop-blur-sm border-neutral-200">
              <CardContent className="p-4">
                <h3 className="font-medium text-neutral-800">
                  Appointment {i}
                </h3>
                <p className="text-sm text-neutral-600">Tomorrow at 2:00 PM</p>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </div>
);

const Index = () => {
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
        <Carousel className="w-full">
          <CarouselContent>
            {serviceCategories.map((category) => (
              <CarouselItem
                key={category.id}
                className="basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <Card className="group hover:border-accent transition-colors duration-200 bg-white/80 backdrop-blur-sm cursor-pointer">
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
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        {/* Featured Services */}
        <FeaturedServices />

        {/* Upcoming Appointments */}
        <UpcomingAppointments />
      </div>
    </div>
  );
};

export default Index;