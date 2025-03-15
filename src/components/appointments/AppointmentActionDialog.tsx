
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Check, X, Calendar, CheckCircle } from "lucide-react";

interface AppointmentActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  actionType: "confirm" | "cancel" | "complete";
  serviceName: string;
  businessName: string;
  isLoading: boolean;
}

export const AppointmentActionDialog = ({
  open,
  onOpenChange,
  onConfirm,
  actionType,
  serviceName,
  businessName,
  isLoading
}: AppointmentActionDialogProps) => {
  const actionConfig = {
    confirm: {
      title: "Confirm Appointment",
      description: `Are you sure you want to confirm the ${serviceName} appointment with ${businessName}?`,
      confirmText: "Confirm Appointment",
      confirmIcon: Check,
      confirmColor: "bg-green-600 hover:bg-green-700 text-white",
      headerIcon: Calendar,
      headerColor: "text-green-500"
    },
    cancel: {
      title: "Cancel Appointment",
      description: `Are you sure you want to cancel the ${serviceName} appointment with ${businessName}?`,
      confirmText: "Cancel Appointment",
      confirmIcon: X,
      confirmColor: "bg-red-600 hover:bg-red-700 text-white",
      headerIcon: X,
      headerColor: "text-red-500"
    },
    complete: {
      title: "Complete Appointment",
      description: `Mark this ${serviceName} appointment with ${businessName} as completed?`,
      confirmText: "Mark Completed",
      confirmIcon: CheckCircle,
      confirmColor: "bg-blue-600 hover:bg-blue-700 text-white",
      headerIcon: CheckCircle,
      headerColor: "text-blue-500"
    }
  };

  const config = actionConfig[actionType];
  const Icon = config.confirmIcon;
  const HeaderIcon = config.headerIcon;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-[#1A1F2C] border-[#403E43] text-white">
        <AlertDialogHeader>
          <div className="mx-auto bg-[#2A2F3C] p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <HeaderIcon className={`h-8 w-8 ${config.headerColor}`} />
          </div>
          <AlertDialogTitle className="text-center text-xl">
            {config.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-[#C8C8C9]">
            {config.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-[#2A2F3C] text-white border-[#403E43] hover:bg-[#3A3F4C] hover:text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            className={`${config.confirmColor} ${isLoading ? 'opacity-70' : ''}`} 
            onClick={(e) => {
              if (isLoading) {
                e.preventDefault();
                return;
              }
              onConfirm();
            }}
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">●</span>
                Processing...
              </>
            ) : (
              <>
                <Icon className="mr-2 h-4 w-4" />
                {config.confirmText}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
