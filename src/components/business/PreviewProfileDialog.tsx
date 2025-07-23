/**
 * PreviewProfileDialog Component
 * 
 * Shows a preview of how the business profile will look to customers
 */
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, Users, MapPin, Tag } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PreviewProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileData: {
    name?: string;
    description?: string;
    address?: string;
    category?: string;
    imageUrl?: string;
    services?: Array<{
      name: string;
      description?: string;
      price: number;
      duration: number;
    }>;
    employees?: Array<{
      name: string;
      title?: string;
      bio?: string;
      imageUrl?: string;
    }>;
  };
}

export function PreviewProfileDialog({ open, onOpenChange, profileData }: PreviewProfileDialogProps) {
  const [activeTab, setActiveTab] = useState("services");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profile Preview</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header Image */}
          <div className="relative h-48 w-full">
            <img
              src={profileData.imageUrl || "https://placehold.co/600x300"}
              alt={profileData.name || "Business"}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>

          {/* Business Info */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{profileData.name || "Business Name"}</h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {profileData.category && (
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  {profileData.category}
                </div>
              )}
              {profileData.address && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {profileData.address}
                </div>
              )}
            </div>

            {profileData.description && (
              <p className="text-muted-foreground">{profileData.description}</p>
            )}
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>
            
            {/* Services Tab */}
            <TabsContent value="services" className="space-y-4">
              <h2 className="text-xl font-semibold">Our Services</h2>
              <div className="space-y-4">
                {profileData.services?.length ? (
                  profileData.services.map((service, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-start p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold">{service.name}</h3>
                        {service.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {service.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-lg font-bold">${service.price.toFixed(2)}</div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          {service.duration}m
                        </div>
                        <Button size="sm">Book</Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No services added yet
                  </p>
                )}
              </div>
            </TabsContent>
            
            {/* Team Tab */}
            <TabsContent value="team" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Our Team</h2>
                <div className="flex items-center text-muted-foreground">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{profileData.employees?.length || 0} Members</span>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                {profileData.employees?.length ? (
                  profileData.employees.map((employee, index) => (
                    <div key={index} className="border rounded-lg p-4 flex items-start">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage src={employee.imageUrl} alt={employee.name} />
                        <AvatarFallback>{employee.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{employee.name}</h3>
                        {employee.title && (
                          <p className="text-sm text-muted-foreground">{employee.title}</p>
                        )}
                        {employee.bio && (
                          <p className="text-sm mt-2">{employee.bio}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8 col-span-2">
                    No team members added yet
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}