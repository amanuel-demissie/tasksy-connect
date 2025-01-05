/**
 * ProfileHeader Component
 * 
 * Displays the user's avatar and profile title at the top of the profile page.
 * Uses the Avatar component from shadcn/ui for consistent styling.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Session | null} props.session - The user's session object from Supabase Auth
 * 
 * @example
 * ```tsx
 * <ProfileHeader session={session} />
 * ```
 */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Session } from "@supabase/supabase-js";

interface ProfileHeaderProps {
  session: Session | null;
}

export const ProfileHeader = ({ session }: ProfileHeaderProps) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="w-24 h-24">
        <AvatarImage src={session?.user?.user_metadata?.avatar_url} />
        <AvatarFallback>
          {session?.user?.email?.[0]?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <h1 className="text-2xl font-semibold text-primary">
        Profile
      </h1>
    </div>
  );
};