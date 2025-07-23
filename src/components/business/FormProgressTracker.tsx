/**
 * FormProgressTracker Component
 * 
 * Displays progress indicator showing completion status of form sections
 */
import { CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormSection {
  id: string;
  title: string;
  isComplete: boolean;
  isActive: boolean;
}

interface FormProgressTrackerProps {
  sections: FormSection[];
  className?: string;
}

export function FormProgressTracker({ sections, className }: FormProgressTrackerProps) {
  const completedSections = sections.filter(section => section.isComplete).length;
  const progressPercentage = (completedSections / sections.length) * 100;

  return (
    <div className={cn("bg-card rounded-lg p-4 border", className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">Progress</h3>
        <span className="text-sm font-medium text-primary">
          {completedSections}/{sections.length} Complete
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-2 mb-4">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Section List */}
      <div className="space-y-2">
        {sections.map((section) => (
          <div 
            key={section.id}
            className={cn(
              "flex items-center gap-2 text-sm transition-colors",
              section.isActive && "text-primary font-medium",
              section.isComplete && "text-muted-foreground"
            )}
          >
            {section.isComplete ? (
              <CheckCircle className="h-4 w-4 text-primary" />
            ) : (
              <Circle className={cn(
                "h-4 w-4",
                section.isActive ? "text-primary" : "text-muted-foreground"
              )} />
            )}
            <span>{section.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}