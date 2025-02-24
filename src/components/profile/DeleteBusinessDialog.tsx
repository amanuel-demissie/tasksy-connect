
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Props for the DeleteBusinessDialog component
 * @interface DeleteBusinessDialogProps
 */
interface DeleteBusinessDialogProps {
  /** The unique identifier of the business to delete */
  businessId: string;
  /** The name of the business (used in confirmation messages) */
  businessName: string;
  /** Optional callback function triggered after successful deletion */
  onDelete?: () => void;
}

/**
 * DeleteBusinessDialog Component
 * 
 * Provides a confirmation dialog for deleting a business profile.
 * Handles the deletion process through Supabase and provides feedback via toast notifications.
 * 
 * @component
 */
export const DeleteBusinessDialog = ({ businessId, businessName, onDelete }: DeleteBusinessDialogProps) => {
  const { toast } = useToast();

  /**
   * Handles the business deletion process
   * @param {React.MouseEvent} e - The click event
   */
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    console.log('Attempting to delete business profile:', businessId);
    
    try {
      // First, delete related availability records
      const { error: availabilityError } = await supabase
        .from('business_availability')
        .delete()
        .eq('business_id', businessId);

      if (availabilityError) {
        console.error('Error deleting availability:', availabilityError);
        throw availabilityError;
      }

      // Then delete blocked dates
      const { error: blockedDatesError } = await supabase
        .from('business_blocked_dates')
        .delete()
        .eq('business_id', businessId);

      if (blockedDatesError) {
        console.error('Error deleting blocked dates:', blockedDatesError);
        throw blockedDatesError;
      }

      // Finally delete the business services
      const { error: servicesError } = await supabase
        .from('business_services')
        .delete()
        .eq('business_id', businessId);

      if (servicesError) {
        console.error('Error deleting services:', servicesError);
        throw servicesError;
      }

      // Now delete the business profile
      const { error } = await supabase
        .from('business_profiles')
        .delete()
        .eq('id', businessId);

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }

      console.log('Business profile deleted successfully');

      toast({
        title: "Success",
        description: `${businessName} has been deleted successfully`,
      });

      if (onDelete) onDelete();
    } catch (error) {
      console.error('Error deleting business profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete business profile. Please try again.",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="lg"
          className="relative text-white hover:bg-red-500/20 p-6"
          onClick={(e) => {
            e.stopPropagation();
            console.log('clicked delete button')
          }}
        >
          <Trash2 className="w-8 h-8" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent 
        className="z-[200]"
        onClick={(e) => e.stopPropagation()}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your business profile
            and all associated services, availability, and blocked dates.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600"
            onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
