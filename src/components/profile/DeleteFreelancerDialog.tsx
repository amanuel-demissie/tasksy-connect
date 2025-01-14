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

interface DeleteFreelancerDialogProps {
  freelancerId: string;
  freelancerName: string;
  onDelete?: () => void;
}

export const DeleteFreelancerDialog = ({ freelancerId, freelancerName, onDelete }: DeleteFreelancerDialogProps) => {
  const { toast } = useToast();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    console.log('Attempting to delete freelancer profile:', freelancerId);
    
    try {
      const { error } = await supabase
        .from('freelancer_profiles')
        .delete()
        .eq('id', freelancerId);

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }

      console.log('Freelancer profile deleted successfully');

      toast({
        title: "Success",
        description: `${freelancerName} has been deleted successfully`,
      });

      if (onDelete) onDelete();
    } catch (error) {
      console.error('Error deleting freelancer profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete freelancer profile. Please try again.",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="lg"
          className="relative text-white hover:bg-red-500/20 p-6 z-10"
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
            This action cannot be undone. This will permanently delete your freelancer profile
            and all associated skills.
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