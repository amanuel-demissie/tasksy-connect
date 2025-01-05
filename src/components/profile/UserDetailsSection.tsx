import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Calendar, User, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Profile {
  email: string | null;
  created_at: string;
  username: string | null;
  phone_number: string | null;
}

interface UserDetailsSectionProps {
  profile: Profile;
  setProfile: (profile: Profile) => void;
}

export const UserDetailsSection = ({ profile, setProfile }: UserDetailsSectionProps) => {
  const [username, setUsername] = useState(profile.username || "");
  const [phoneNumber, setPhoneNumber] = useState(profile.phone_number || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  const handleUpdateUsername = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({ username })
      .eq('id', (await supabase.auth.getSession()).data.session?.user.id);

    if (error) {
      toast.error("Failed to update username");
      return;
    }

    setIsEditing(false);
    toast.success("Username updated successfully");
    
    if (profile) {
      setProfile({ ...profile, username });
    }
  };

  const handleUpdatePhoneNumber = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({ phone_number: phoneNumber })
      .eq('id', (await supabase.auth.getSession()).data.session?.user.id);

    if (error) {
      toast.error("Failed to update phone number");
      return;
    }

    setIsEditingPhone(false);
    toast.success("Phone number updated successfully");
    
    if (profile) {
      setProfile({ ...profile, phone_number: phoneNumber });
    }
  };

  return (
    <Card className="bg-card">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <User className="w-5 h-5 text-muted-foreground" />
          <div className="flex-grow">
            <p className="text-sm font-medium text-muted-foreground">Username</p>
            {isEditing ? (
              <div className="flex gap-2 mt-1">
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-background text-foreground"
                  placeholder="Enter username"
                />
                <Button 
                  onClick={handleUpdateUsername}
                  className="bg-accent hover:bg-accent/90"
                >
                  Save
                </Button>
                <Button 
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <p className="text-foreground">{profile.username || 'No username set'}</p>
                <Button 
                  onClick={() => setIsEditing(true)} 
                  variant="ghost" 
                  size="sm"
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Mail className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p className="text-foreground">{profile.email || 'No email set'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Phone className="w-5 h-5 text-muted-foreground" />
          <div className="flex-grow">
            <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
            {isEditingPhone ? (
              <div className="flex gap-2 mt-1">
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="bg-background text-foreground"
                  placeholder="Enter phone number"
                  type="tel"
                />
                <Button 
                  onClick={handleUpdatePhoneNumber}
                  className="bg-accent hover:bg-accent/90"
                >
                  Save
                </Button>
                <Button 
                  onClick={() => setIsEditingPhone(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <p className="text-foreground">{profile.phone_number || 'No phone number set'}</p>
                <Button 
                  onClick={() => setIsEditingPhone(true)} 
                  variant="ghost" 
                  size="sm"
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Member Since</p>
            <p className="text-foreground">
              {new Date(profile.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};