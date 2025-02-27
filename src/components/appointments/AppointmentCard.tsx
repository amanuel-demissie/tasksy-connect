
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Appointment } from "@/types/appointment";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AppointmentCardProps {
  appointment: Appointment;
}

export const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<{ email: string | null; username: string | null } | null>(null);
  const [isBusinessOwner, setIsBusinessOwner] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if current user is business owner
      const { data } = await supabase
        .from('business_profiles')
        .select('owner_id')
        .eq('id', appointment.business_id)
        .single();

      if (data?.owner_id === user.id) {
        setIsBusinessOwner(true);
        // Fetch customer info
        fetchCustomerInfo(appointment.customer_id);
      }
    };
    
    const fetchCustomerInfo = async (customerId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('email, username')
        .eq('id', customerId)
        .single();
        
      if (error) {
        console.error('Error fetching customer info:', error);
        return;
      }
      
      setCustomerInfo(data);
    };
    
    checkUserRole();
  }, [appointment.business_id, appointment.customer_id]);

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

              {isBusinessOwner && customerInfo && (
                <div className="mt-4 p-3 bg-[#2A2F3C] rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-[#C8C8C9]" />
                    <span className="text-sm font-medium text-[#C8C8C9]">Customer Details</span>
                  </div>
                  <p className="text-sm text-white">
                    {customerInfo.username || 'No username'}
                  </p>
                  <p className="text-xs text-[#C8C8C9]">
                    {customerInfo.email || 'No email provided'}
                  </p>
                </div>
              )}

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
