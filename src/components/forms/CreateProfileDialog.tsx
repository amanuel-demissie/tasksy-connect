import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BusinessProfileForm from "./BusinessProfileForm";
import FreelancerProfileForm from "./FreelancerProfileForm";

interface CreateProfileDialogProps {
  /** Controls the visibility of the dialog */
  isOpen: boolean;
  /** Callback function to close the dialog */
  onClose: () => void;
  /** Type of profile being created */
  type: "business" | "freelancer" | null;
}

/**
 * Dialog component for creating business or freelancer profiles
 * 
 * This component:
 * 1. Renders a modal dialog with appropriate title and description
 * 2. Conditionally renders either BusinessProfileForm or FreelancerProfileForm
 * 3. Handles dialog visibility and closing
 * 
 * The actual profile creation logic is handled by the respective form components
 */
export default function CreateProfileDialog({
  isOpen,
  onClose,
  type
}: CreateProfileDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Create {type === "business" ? "Business" : "Freelancer"} Profile
          </DialogTitle>
          <DialogDescription>
            {type === "business"
              ? "Create your business profile to showcase your services"
              : "Create your freelancer profile to showcase your skills"}
          </DialogDescription>
        </DialogHeader>
        {/* Render appropriate form based on profile type */}
        {type === "business" ? (
          <BusinessProfileForm onSuccess={onClose} />
        ) : (
          <FreelancerProfileForm onSuccess={onClose} />
        )}
      </DialogContent>
    </Dialog>
  );
}