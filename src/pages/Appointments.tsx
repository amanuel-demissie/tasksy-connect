import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface Appointment {
  id: number;
  status: string;
  serviceName: string;
  providerName: string;
  businessName: string;
  businessLogo: string;
  date: string;
  time: string;
}

const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="min-w-[300px] md:min-w-[400px]">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <div className="p-4 flex items-center space-x-4">
            <img
              src={appointment.businessLogo}
              alt={appointment.businessName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1 text-left">
              <h3 className="font-medium">{appointment.providerName}</h3>
              <p className="text-sm text-neutral-500">{appointment.date}</p>
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-2 border-t">
            <div className="pt-2">
              <p className="text-sm text-neutral-600">
                <span className="font-medium">Service:</span>{" "}
                {appointment.serviceName}
              </p>
              <p className="text-sm text-neutral-600">
                <span className="font-medium">Business:</span>{" "}
                {appointment.businessName}
              </p>
              <p className="text-sm text-neutral-600">
                <span className="font-medium">Time:</span> {appointment.time}
              </p>
              <p className="text-sm text-neutral-600">
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={cn(
                    "inline-block px-2 py-0.5 rounded text-xs",
                    appointment.status === "Upcoming"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  )}
                >
                  {appointment.status}
                </span>
              </p>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

const Appointments = () => {
  const categories = ["Beauty", "Professional", "Home"];

  return (
    <div className="min-h-screen bg-secondary pb-20">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-primary mb-8">
          Your Appointments
        </h1>

        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category} className="space-y-4">
              <h2 className="text-lg font-semibold text-neutral-800">
                {category} Appointments
              </h2>
              <div className="relative">
                <div className="overflow-x-auto pb-4">
                  <div className="flex space-x-4 min-w-max">
                    {[1, 2, 3].map((i) => (
                      <AppointmentCard
                        key={i}
                        appointment={{
                          id: i,
                          status: "Upcoming",
                          serviceName: `${category} Service ${i}`,
                          providerName: "Provider Name",
                          businessName: "Business Name",
                          businessLogo: "placeholder.svg",
                          date: "November 15",
                          time: "2:00 PM"
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Appointments;