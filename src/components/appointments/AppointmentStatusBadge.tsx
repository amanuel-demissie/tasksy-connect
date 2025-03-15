
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AppointmentStatusBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
}

export const AppointmentStatusBadge = ({ 
  status, 
  size = "md" 
}: AppointmentStatusBadgeProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return "bg-green-500/20 text-green-500 border-green-500/30";
      case 'pending':
        return "bg-amber-500/20 text-amber-500 border-amber-500/30";
      case 'cancelled':
        return "bg-red-500/20 text-red-500 border-red-500/30";
      case 'completed':
        return "bg-blue-500/20 text-blue-500 border-blue-500/30";
      default:
        return "bg-[#403E43]/20 text-[#C8C8C9] border-[#403E43]/30";
    }
  };
  
  // Define size classes
  const sizeClasses = {
    sm: "text-[10px] px-2 py-0",
    md: "text-xs px-2.5 py-0.5",
    lg: "text-sm px-3 py-1",
  };

  return (
    <Badge 
      variant="secondary" 
      className={cn(
        "rounded-full border",
        getStatusColor(status),
        sizeClasses[size]
      )}
    >
      {status}
    </Badge>
  );
};
