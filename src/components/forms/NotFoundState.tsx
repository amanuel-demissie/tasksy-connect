import { Button } from "@/components/ui/button";

interface NotFoundStateProps {
  onExit: () => void;
}

/**
 * NotFoundState Component
 * 
 * Displays a message when a business profile is not found
 * 
 * @component
 */
export function NotFoundState({ onExit }: NotFoundStateProps) {
  return (
    <div className="text-center py-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Business Profile Not Found
      </h2>
      <p className="text-gray-600 mb-4">
        The business profile you're looking for doesn't exist or has been deleted.
      </p>
      <Button onClick={onExit}>Return to Profile</Button>
    </div>
  );
}