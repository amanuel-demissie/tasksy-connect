
/**
 * ProfileHeader Component
 * 
 * Displays the user's profile image and profile title at the top of the profile page.
 * Uses the Avatar component from shadcn/ui for consistent styling.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Session | null} props.session - The user's session object from Supabase Auth
 */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Session } from "@supabase/supabase-js";
import { useState, useRef } from "react";
import ImageUpload from "@/components/shared/ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfileHeaderProps {
  session: Session | null;
}

export const ProfileHeader = ({ session }: ProfileHeaderProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [uploading, setUploading] = useState(false);

  const onCapturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'profile-photo.jpg', { type: 'image/jpeg' });
          setImageFile(file);
          setShowCamera(false);
          const stream = videoRef.current?.srcObject as MediaStream;
          stream?.getTracks().forEach(track => track.stop());
        }
      }, 'image/jpeg');
    }
  };

  const handleImageUpload = async () => {
    if (!session?.user?.id || !imageFile) return;

    try {
      setUploading(true);
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `${session.user.id}/profile.${fileExt}`;

      // Upload image to Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, imageFile, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new image URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_image: filePath })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      toast.success('Profile image updated successfully');
      setImageFile(null);
    } catch (error) {
      toast.error('Error uploading image');
      console.error('Error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="w-24 h-24">
          <AvatarImage src={session?.user?.user_metadata?.avatar_url} />
          <AvatarFallback>
            {session?.user?.email?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="mt-4">
          <ImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            showCamera={showCamera}
            setShowCamera={setShowCamera}
            onCapturePhoto={onCapturePhoto}
            videoRef={videoRef}
          />
          {imageFile && (
            <button
              onClick={handleImageUpload}
              disabled={uploading}
              className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          )}
        </div>
      </div>
      <h1 className="text-2xl font-semibold text-primary">
        Profile
      </h1>
    </div>
  );
};
