
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, User, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Appointment } from "@/types/appointment";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AppointmentCardProps {
  appointment: Appointment;
  onStatusChange?: () => void;
}

export const AppointmentCard = ({ appointment, onStatusChange }: AppointmentCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<{ email: string | null; username: string | null } | null>(null);
  const [isBusinessOwner, setIsBusinessOwner] = useState(false);
  const [isCustomer, setIsCustomer] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

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

      // Check if current user is customer
      if (appointment.customer_id === user.id) {
        setIsCustomer(true);
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return "bg-green-500/20 text-green-500";
      case 'pending':
        return "bg-amber-500/20 text-amber-500";
      case 'cancelled':
        return "bg-red-500/20 text-red-500";
      case 'completed':
        return "bg-blue-500/20 text-blue-500";
      default:
        return "bg-[#403E43]/20 text-[#C8C8C9]";
    }
  };

  const updateAppointmentStatus = async (newStatus: string) => {
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointment.id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Appointment ${newStatus.toLowerCase()}`,
      });
      
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Couldn't update appointment status",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirm = () => updateAppointmentStatus('confirmed');
  const handleCancel = () => updateAppointmentStatus('cancelled');
  const handleComplete = () => updateAppointmentStatus('completed');

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
                  getStatusColor(appointment.status)
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

              {/* Action buttons based on role and current status */}
              {(isBusinessOwner || isCustomer) && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {isBusinessOwner && appointment.status.toLowerCase() === 'pending' && (
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleConfirm}
                      disabled={isUpdating}
                    >
                      <Check className="mr-1 h-4 w-4" /> Confirm
                    </Button>
                  )}
                  
                  {isBusinessOwner && appointment.status.toLowerCase() === 'confirmed' && (
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleComplete}
                      disabled={isUpdating}
                    >
                      <Check className="mr-1 h-4 w-4" /> Mark Completed
                    </Button>
                  )}
                  
                  {(isBusinessOwner || isCustomer) && 
                   (appointment.status.toLowerCase() === 'pending' || 
                    appointment.status.toLowerCase() === 'confirmed') && (
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={handleCancel}
                      disabled={isUpdating}
                    >
                      <X className="mr-1 h-4 w-4" /> Cancel
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
