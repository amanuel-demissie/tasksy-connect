/**
 * AutoSaveIndicator Component
 * 
 * Shows auto-save status with timestamp
 */
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AutoSaveIndicatorProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved?: Date;
  className?: string;
}

export function AutoSaveIndicator({ status, lastSaved, className }: AutoSaveIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return {
          icon: Clock,
          text: 'Saving...',
          className: 'text-muted-foreground'
        };
      case 'saved':
        return {
          icon: CheckCircle,
          text: `Saved ${lastSaved ? formatTimeAgo(lastSaved) : ''}`,
          className: 'text-green-600'
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Failed to save',
          className: 'text-destructive'
        };
      default:
        return null;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const config = getStatusConfig();
  
  if (!config) return null;

  const { icon: Icon, text, className: statusClassName } = config;

  return (
    <div className={cn("flex items-center gap-1 text-xs", statusClassName, className)}>
      <Icon className="h-3 w-3" />
      <span>{text}</span>
    </div>
  );
}