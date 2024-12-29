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
      <Card className="bg-[#1A1F2C]/80 backdrop-blur-sm border-[#403E43]">
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
                  <p className="font-medium text-white">{appointment.providerName}</p>
                  <p className="text-sm text-[#C8C8C9]">{appointment.date}</p>
                </div>
              </div>
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-[#C8C8C9]" />
              ) : (
                <ChevronDown className="h-5 w-5 text-[#C8C8C9]" />
              )}
            </div>
          </CardContent>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4 px-4">
            <div className="space-y-4 border-t border-[#403E43] pt-4">
              <Badge 
                variant="secondary" 
                className={cn(
                  "rounded-full",
                  appointment.status === "Upcoming"
                    ? "bg-accent/20 text-accent"
                    : "bg-[#403E43]/20 text-[#C8C8C9]"
                )}
              >
                {appointment.status}
              </Badge>
              
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-white">
                  {appointment.serviceName}
                </h3>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-white font-medium">
                  {appointment.businessName}
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-[#C8C8C9]">
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