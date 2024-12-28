import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
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

interface AppointmentCardProps {
  appointment: Appointment;
}

export const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
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
                className={cn(
                  "rounded-full",
                  appointment.status === "Upcoming"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-neutral-100 text-neutral-600"
                )}
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