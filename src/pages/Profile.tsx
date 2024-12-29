import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Calendar, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const userInfo = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    age: "28",
    memberSince: "2023",
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  return (
    <div className="min-h-screen bg-secondary pb-20">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-semibold text-primary">
            {userInfo.name}
          </h1>
        </div>

        <Card className="bg-[#1A1F2C] backdrop-blur-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center space-x-4">
              <Mail className="w-5 h-5 text-neutral-500" />
              <div>
                <p className="text-sm text-neutral-500">Email</p>
                <p className="text-neutral-800">{userInfo.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Phone className="w-5 h-5 text-neutral-500" />
              <div>
                <p className="text-sm text-neutral-500">Phone</p>
                <p className="text-neutral-800">{userInfo.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Calendar className="w-5 h-5 text-neutral-500" />
              <div>
                <p className="text-sm text-neutral-500">Member Since</p>
                <p className="text-neutral-800">{userInfo.memberSince}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Profile;