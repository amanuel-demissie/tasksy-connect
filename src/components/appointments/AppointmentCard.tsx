import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, User, Check, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Appointment } from "@/types/appointment";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AppointmentStatusBadge } from "./AppointmentStatusBadge";
import { AppointmentActionDialog } from "./AppointmentActionDialog";

interface AppointmentCardProps {
  appointment: Appointment;
  onStatusChange?: () => void;
  variant?: "default" | "compact";
}

export const AppointmentCard = ({ 
  appointment, 
  onStatusChange,
  variant = "default" 
}: AppointmentCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<{ email: string | null; username: string | null } | null>(null);
  const [employeeInfo, setEmployeeInfo] = useState<{ name: string; title?: string } | null>(null);
  const [isBusinessOwner, setIsBusinessOwner] = useState(false);
  const [isCustomer, setIsCustomer] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<"confirm" | "cancel" | "complete">("confirm");
  const { toast } = useToast();

  // Status color mapping for the card border
  const getStatusBorderColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return "border-l-4 border-l-green-500";
      case 'pending':
        return "border-l-4 border-l-amber-500";
      case 'cancelled':
        return "border-l-4 border-l-red-500";
      case 'completed':
        return "border-l-4 border-l-blue-500";
      default:
        return "";
    }
  };

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

      // Check if current user is the assigned employee
      if (appointment.employee_id && appointment.employee_id === user.id) {
        setIsEmployee(true);
      }

      // Fetch employee info if there's an assigned employee
      if (appointment.employee_id) {
        fetchEmployeeInfo(appointment.employee_id);
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

    const fetchEmployeeInfo = async (employeeId: string) => {
      const { data, error } = await supabase
        .from('employees')
        .select('name, title')
        .eq('id', employeeId)
        .single();
        
      if (error) {
        console.error('Error fetching employee info:', error);
        return;
      }
      
      setEmployeeInfo(data);
    };
    
    checkUserRole();
  }, [appointment.business_id, appointment.customer_id, appointment.employee_id]);

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
        variant: newStatus.toLowerCase() === "cancelled" ? "destructive" : "default",
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
      setActionDialogOpen(false);
    }
  };

  const handleOpenDialog = (action: "confirm" | "cancel" | "complete") => {
    setCurrentAction(action);
    setActionDialogOpen(true);
  };

  const handleConfirm = () => updateAppointmentStatus('confirmed');
  const handleCancel = () => updateAppointmentStatus('cancelled');
  const handleComplete = () => updateAppointmentStatus('completed');

  const getActionByType = () => {
    switch (currentAction) {
      case "confirm": return handleConfirm;
      case "cancel": return handleCancel;
      case "complete": return handleComplete;
    }
  };

  return (
    <>
      <Collapsible 
        open={isOpen} 
        onOpenChange={setIsOpen} 
        className={cn(
          "w-full min-w-[300px] md:min-w-[400px] transition-all duration-200",
          variant === "compact" && "min-w-[250px]"
        )}
      >
        <Card 
          className={cn(
            "bg-[#1A1F2C]/80 backdrop-blur-sm border-[#403E43] hover:bg-[#1A1F2C]",
            getStatusBorderColor(appointment.status),
            isOpen && "ring-1 ring-accent"
          )}
        >
          <CollapsibleTrigger className="w-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img 
                      src={appointment.businessLogo} 
                      alt={appointment.businessName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1">
                      <AppointmentStatusBadge status={appointment.status} size="sm" />
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-white">{appointment.serviceName}</p>
                    <div className="flex items-center text-sm text-[#C8C8C9]">
                      <Clock className="w-3 h-3 mr-1" />
                      {appointment.time}
                    </div>
                    {employeeInfo && (
                      <div className="text-xs text-[#C8C8C9]">
                        with {employeeInfo.name}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-[#C8C8C9] mr-2">{appointment.date}</span>
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-[#C8C8C9]" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-[#C8C8C9]" />
                  )}
                </div>
              </div>
            </CardContent>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="animate-accordion-down">
            <CardContent className="pt-0 pb-4 px-4">
              <div className="space-y-4 border-t border-[#403E43] pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">
                      {appointment.businessName}
                    </h3>
                    <AppointmentStatusBadge status={appointment.status} />
                  </div>
                  
                  <div className="text-sm text-[#C8C8C9]">
                    Category: <span className="text-white">{appointment.category}</span>
                  </div>

                  {employeeInfo && (
                    <div className="p-3 bg-[#2A2F3C] rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-[#C8C8C9]" />
                        <span className="text-sm font-medium text-[#C8C8C9]">Assigned Employee</span>
                      </div>
                      <p className="text-sm text-white">{employeeInfo.name}</p>
                      {employeeInfo.title && (
                        <p className="text-xs text-[#C8C8C9]">{employeeInfo.title}</p>
                      )}
                    </div>
                  )}
                </div>

                {(isBusinessOwner || isEmployee) && customerInfo && (
                  <div className="p-3 bg-[#2A2F3C] rounded-lg">
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

                {/* Action buttons based on role and current status */}
                {(isBusinessOwner || isEmployee || isCustomer) && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {(isBusinessOwner || isEmployee) && appointment.status.toLowerCase() === 'pending' && (
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleOpenDialog("confirm")}
                        disabled={isUpdating}
                      >
                        <Check className="mr-1 h-4 w-4" /> Confirm
                      </Button>
                    )}
                    
                    {(isBusinessOwner || isEmployee) && appointment.status.toLowerCase() === 'confirmed' && (
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleOpenDialog("complete")}
                        disabled={isUpdating}
                      >
                        <Check className="mr-1 h-4 w-4" /> Mark Completed
                      </Button>
                    )}
                    
                    {(isBusinessOwner || isEmployee || isCustomer) && 
                     (appointment.status.toLowerCase() === 'pending' || 
                      appointment.status.toLowerCase() === 'confirmed') && (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleOpenDialog("cancel")}
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

      <AppointmentActionDialog
        open={actionDialogOpen}
        onOpenChange={setActionDialogOpen}
        onConfirm={getActionByType()}
        actionType={currentAction}
        serviceName={appointment.serviceName}
        businessName={appointment.businessName}
        isLoading={isUpdating}
      />
    </>
  );
};
