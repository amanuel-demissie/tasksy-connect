
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, Building, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Business {
  id: string;
  name: string;
  image_url: string | null;
  category: string;
}

interface Freelancer {
  id: string;
  full_name: string;
  image_url: string | null;
  title: string;
}

interface NewMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectUser: (userId: string, userType: 'business' | 'freelancer') => void;
}

export const NewMessageDialog: React.FC<NewMessageDialogProps> = ({
  open,
  onOpenChange,
  onSelectUser
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("businesses");
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open, activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return;
      
      if (activeTab === "businesses") {
        const { data, error } = await supabase
          .from('business_profiles')
          .select('id, name, image_url, category')
          .neq('owner_id', session.user.id)
          .order('name');
          
        if (error) throw error;
        setBusinesses(data || []);
      } else {
        const { data, error } = await supabase
          .from('freelancer_profiles')
          .select('id, full_name, image_url, title')
          .neq('owner_id', session.user.id)
          .order('full_name');
          
        if (error) throw error;
        setFreelancers(data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Could not load users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredBusinesses = businesses.filter(business => 
    business.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredFreelancers = freelancers.filter(freelancer => 
    freelancer.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
          <DialogDescription>
            Select a user to start a conversation with.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search users..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="businesses" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="businesses">
                <Building className="h-4 w-4 mr-2" />
                Businesses
              </TabsTrigger>
              <TabsTrigger value="freelancers">
                <User className="h-4 w-4 mr-2" />
                Freelancers
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="businesses" className="mt-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : filteredBusinesses.length > 0 ? (
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-2">
                    {filteredBusinesses.map(business => (
                      <Button
                        key={business.id}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => onSelectUser(business.id, 'business')}
                      >
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage 
                            src={business.image_url || undefined} 
                            alt={business.name} 
                          />
                          <AvatarFallback>
                            {business.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="font-medium">{business.name}</p>
                          <p className="text-xs text-muted-foreground">{business.category}</p>
                        </div>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "No businesses found" : "No businesses available"}
                </p>
              )}
            </TabsContent>
            
            <TabsContent value="freelancers" className="mt-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : filteredFreelancers.length > 0 ? (
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-2">
                    {filteredFreelancers.map(freelancer => (
                      <Button
                        key={freelancer.id}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => onSelectUser(freelancer.id, 'freelancer')}
                      >
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage 
                            src={freelancer.image_url || undefined} 
                            alt={freelancer.full_name} 
                          />
                          <AvatarFallback>
                            {freelancer.full_name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="font-medium">{freelancer.full_name}</p>
                          <p className="text-xs text-muted-foreground">{freelancer.title}</p>
                        </div>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "No freelancers found" : "No freelancers available"}
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogClose asChild>
          <Button variant="outline" className="w-full mt-2">Cancel</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
