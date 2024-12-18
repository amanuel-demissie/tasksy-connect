import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Appointments = () => {
  const appointmentCategories = ["Beauty", "Dining", "Professional", "Home"];

  return (
    <div className="min-h-screen bg-secondary pb-20">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-2xl font-semibold text-primary">My Appointments</h1>
        
        <Calendar
          className="rounded-lg border bg-white/80 backdrop-blur-sm p-4"
          mode="multiple"
          selected={[new Date()]}
        />

        {appointmentCategories.map((category) => (
          <div key={category} className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-800">
              {category} Appointments
            </h2>
            <Carousel className="w-full">
              <CarouselContent>
                {[1, 2, 3].map((i) => (
                  <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="bg-white/80 backdrop-blur-sm border-neutral-200">
                      <CardContent className="p-4">
                        <h3 className="font-medium text-neutral-800">
                          {category} Appointment {i}
                        </h3>
                        <p className="text-sm text-neutral-600">
                          Tomorrow at 2:00 PM
                        </p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Appointments;