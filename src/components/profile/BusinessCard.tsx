import React from 'react';
import { Card } from "@/components/ui/card";
import { Building2, MapPin, Star, Trash2 } from 'lucide-react';
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BusinessProfile {
  id: string;
  name: string;
  description: string | null;
  category: string;
  address: string | null;
  image_url: string | null;
  ratings?: number | null;
}

interface BusinessCardProps {
  profile: BusinessProfile;
  onClick: () => void;
  onDelete?: () => void;
}

export const BusinessCard = ({ profile, onClick, onDelete }: BusinessCardProps) => {
  const { toast } = useToast();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event propagation
    
    console.log('Attempting to delete business profile:', profile.id);
    
    try {
      const { error } = await supabase
        .from('business_profiles')
        .delete()
        .eq('id', profile.id);

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }

      console.log('Business profile deleted successfully');

      toast({
        title: "Success",
        description: `${profile.name} has been deleted successfully`,
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
    <Card 
      className="relative overflow-hidden cursor-pointer group h-[300px]"
      onClick={onClick}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={profile.image_url || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'} 
          alt={profile.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error('Image load error:', e);
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative h-full p-6 flex flex-col justify-between text-white">
        {/* Top Section - Delete Button and Ratings */}
        <div className="flex justify-between items-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="lg"
                className="relative text-white hover:bg-red-500/20 p-6 z-[100]"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
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
                  and all associated services.
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
          
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">
              {profile.ratings?.toFixed(1) || "5.0"}
            </span>
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
          </div>
        </div>

        {/* Bottom Section - Business Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm opacity-90">
            <Building2 className="w-4 h-4" />
            <span className="capitalize">{profile.category}</span>
          </div>
          
          <h3 className="text-2xl font-bold">{profile.name}</h3>
          
          {profile.address && (
            <div className="flex items-center gap-2 text-sm opacity-90">
              <MapPin className="w-4 h-4" />
              {profile.address}
            </div>
          )}
        </div>
      </div>

      {/* Hover Effect */}
      <div 
        className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
      >
        <div className="absolute bottom-4 right-4">
          <button className="bg-accent text-white px-6 py-2 rounded-full font-semibold hover:bg-accent/90 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </Card>
  );
};