import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

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

const AppointmentCard = ({ appointment }: { appointment: typeof appointments[0] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full min-w-[300px] md:min-w-[400px]">
      <Card className="bg-white/80 backdrop-blur-sm border-neutral-200">
        <CollapsibleTrigger className="w-full">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img 
                  src={appointment.businessLogo} 
                  alt={appointment.businessName}
                  className="w-8 h-8 rounded-full"
                />
                <div className="text-left">
                  <p className="font-medium text-neutral-900">{appointment.providerName}</p>
                  <p className="text-sm text-neutral-600">{appointment.date}</p>
                </div>
              </div>
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-neutral-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-neutral-500" />
              )}
            </div>
          </CardContent>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4 px-4">
            <div className="space-y-4 border-t pt-4">
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
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-neutral-900 font-medium">
                  {appointment.businessName}
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-neutral-600">
                  {appointment.time}
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

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
                <AppointmentCard key={appointment.id} appointment={appointment} />
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
              <div className="flex flex-col space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4 pb-4">
                {[1, 2, 3].map((i) => (
                  <AppointmentCard
                    key={i}
                    appointment={{
                      id: i,
                      status: "Upcoming",
                      serviceName: `${category} Service ${i}`,
                      providerName: "Provider Name",
                      businessName: "Business Name",
                      businessLogo: "/placeholder.svg",
                      date: "November 15",
                      time: "2:00 PM"
                    }}
                  />
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