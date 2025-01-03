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
  isOpen: boolean;
  onClose: () => void;
  type: "business" | "freelancer" | null;
}

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
        {type === "business" ? (
          <BusinessProfileForm onSuccess={onClose} />
        ) : (
          <FreelancerProfileForm onSuccess={onClose} />
        )}
      </DialogContent>
    </Dialog>
  );
}