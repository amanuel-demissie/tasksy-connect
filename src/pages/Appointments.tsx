import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data similar to home page
const appointments = [
  {
    id: 1,
    status: "Upcoming",
    serviceName: "Haircut",
    providerName: "Mike Johnson",
    businessName: "Classic Cuts",
    businessLogo: "/placeholder.svg",
    date: "November 2",
    time: "2:00 PM"
  },
  {
    id: 2,
    status: "Upcoming",
    serviceName: "Beard Trim",
    providerName: "Sarah Smith",
    businessName: "Style Studio",
    businessLogo: "/placeholder.svg",
    date: "November 5",
    time: "3:30 PM"
  },
  {
    id: 3,
    status: "Pending",
    serviceName: "Hair Coloring",
    providerName: "Juan 'Jago' Gomez",
    businessName: "Ace Of Fadez Barber Lounge",
    businessLogo: "/placeholder.svg",
    date: "November 10",
    time: "1:00 PM"
  }
];

const Appointments = () => {
  const appointmentCategories = ["Beauty", "Dining", "Professional", "Home"];

  return (
    <div className="min-h-screen bg-secondary pb-20">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-2xl font-semibold text-primary">My Appointments</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Calendar
            className="w-full rounded-lg border bg-white/80 backdrop-blur-sm p-4"
            mode="multiple"
            selected={[new Date()]}
          />
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-800">
              Upcoming Appointments
            </h2>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id} className="bg-white/80 backdrop-blur-sm border-neutral-200">
                  <CardContent className="p-4 space-y-2">
                    <Badge 
                      variant="secondary" 
                      className="bg-neutral-100 text-neutral-600 rounded-full"
                    >
                      {appointment.status}
                    </Badge>
                    
                    <div className="space-y-1">
                      <h3 className="text-xl font-semibold text-neutral-900">
                        {appointment.serviceName}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        with {appointment.providerName}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <img 
                        src={appointment.businessLogo} 
                        alt={appointment.businessName}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-neutral-900 font-medium">
                        {appointment.businessName}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="space-y-0">
                        <div className="text-xl font-bold">
                          {appointment.date.split(" ")[1]}
                        </div>
                        <div className="text-sm text-neutral-600">
                          {appointment.date.split(" ")[0]}
                        </div>
                        <div className="text-sm text-neutral-600">
                          {appointment.time}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {appointmentCategories.map((category) => (
          <div key={category} className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-800">
              {category} Appointments
            </h2>
            <div className="overflow-x-auto">
              <div className="flex space-x-4 pb-4">
                {[1, 2, 3].map((i) => (
                  <Card 
                    key={i} 
                    className="flex-shrink-0 w-80 bg-white/80 backdrop-blur-sm border-neutral-200"
                  >
                    <CardContent className="p-4 space-y-2">
                      <Badge 
                        variant="secondary" 
                        className="bg-neutral-100 text-neutral-600 rounded-full"
                      >
                        Upcoming
                      </Badge>
                      
                      <div className="space-y-1">
                        <h3 className="text-xl font-semibold text-neutral-900">
                          {category} Service {i}
                        </h3>
                        <p className="text-sm text-neutral-600">
                          with Provider Name
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <img 
                          src="/placeholder.svg" 
                          alt="Business Logo"
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-neutral-900 font-medium">
                          Business Name
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="space-y-0">
                          <div className="text-xl font-bold">15</div>
                          <div className="text-sm text-neutral-600">November</div>
                          <div className="text-sm text-neutral-600">2:00 PM</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Appointments;
