/**
 * FormBreadcrumbs Component
 * 
 * Shows navigation breadcrumbs for the form
 */
import { ChevronRight, Home, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FormBreadcrumbsProps {
  businessName?: string;
  className?: string;
}

export function FormBreadcrumbs({ businessName, className }: FormBreadcrumbsProps) {
  const navigate = useNavigate();

  const breadcrumbs = [
    { label: "Dashboard", icon: Home, onClick: () => navigate("/") },
    { label: "Profile", icon: Building2, onClick: () => navigate("/profile") },
    { label: businessName || "Edit Business", current: true }
  ];

  return (
    <nav className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}>
      {breadcrumbs.map((crumb, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
          {crumb.current ? (
            <span className="text-foreground font-medium flex items-center gap-1">
              {crumb.icon && <crumb.icon className="h-4 w-4" />}
              {crumb.label}
            </span>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-muted-foreground hover:text-foreground"
              onClick={crumb.onClick}
            >
              <crumb.icon className="h-4 w-4 mr-1" />
              {crumb.label}
            </Button>
          )}
        </div>
      ))}
    </nav>
  );
}