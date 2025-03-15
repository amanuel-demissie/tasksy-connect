
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Briefcase, User, Wrench } from "lucide-react";

export type UserRole = "customer" | "business" | "freelancer";

interface UserRoleBadgeProps {
  role: UserRole;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

/**
 * A badge component that displays the user's role with an appropriate icon and color
 */
export function UserRoleBadge({ 
  role, 
  size = "md", 
  showIcon = true 
}: UserRoleBadgeProps) {
  // Define role-specific properties
  const roleConfig = {
    customer: {
      icon: User,
      label: "Customer",
      variant: "customer" as const,
    },
    business: {
      icon: Briefcase,
      label: "Business",
      variant: "business" as const,
    },
    freelancer: {
      icon: Wrench,
      label: "Freelancer",
      variant: "freelancer" as const,
    },
  };

  const { icon: Icon, label, variant } = roleConfig[role];
  
  // Define size classes
  const sizeClasses = {
    sm: "text-[10px] px-2 py-0",
    md: "text-xs px-2.5 py-0.5",
    lg: "text-sm px-3 py-1",
  };

  const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14,
  };

  return (
    <Badge 
      variant={variant} 
      className={`${sizeClasses[size]} gap-1`}
    >
      {showIcon && <Icon size={iconSizes[size]} className="inline-block" />}
      {label}
    </Badge>
  );
}
