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

/**
 * Interface representing a business profile for new message selection
 * @interface Business
 * @property {string} id - Business profile ID
 * @property {string} name - Business name
 * @property {string | null} image_url - Business profile image URL
 * @property {string} category - Business service category
 */
interface Business {
  id: string;
  name: string;
  image_url: string | null;
  category: string;
}

/**
 * Interface representing a freelancer profile for new message selection
 * @interface Freelancer
 * @property {string} id - Freelancer profile ID
 * @property {string} full_name - Freelancer's full name
 * @property {string | null} image_url - Freelancer profile image URL
 * @property {string} title - Freelancer's professional title
 */
interface Freelancer {
  id: string;
  full_name: string;
  image_url: string | null;
  title: string;
}

/**
 * Props for the NewMessageDialog component
 * @interface NewMessageDialogProps
 * @property {boolean} open - Controls dialog visibility
 * @property {(open: boolean) => void} onOpenChange - Callback for dialog open/close state changes
 * @property {(userId: string, userType: 'business' | 'freelancer') => void} onSelectUser - Callback when a user is selected to start conversation
 */
interface NewMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectUser: (userId: string, userType: 'business' | 'freelancer') => void;
}

/**
 * NewMessageDialog component for starting new conversations
 * 
 * This component provides:
 * - Search functionality for businesses and freelancers
 * - Tabbed interface to switch between business and freelancer lists
 * - User selection with profile information display
 * - Loading states and error handling
 * - Filtered results based on search term
 * 
 * Features:
 * - Real-time search filtering
 * - Avatar display with fallback initials
 * - Category/title information display
 * - Scrollable user lists
 * - Excludes current user from results
 * 
 * Data fetching:
 * - Loads businesses and freelancers when dialog opens
 * - Refetches when switching between tabs
 * - Filters out current user to prevent self-messaging
 * 
 * @component
 * @param {NewMessageDialogProps} props - Component props
 * @returns {JSX.Element} The new message dialog component
 */
export const NewMessageDialog: React.FC<NewMessageDialogProps> = ({
  open,
  onOpenChange,
  onSelectUser
}) => {
  /** Search term for filtering users */
  const [searchTerm, setSearchTerm] = useState("");
  /** List of available businesses */
  const [businesses, setBusinesses] = useState<Business[]>([]);
  /** List of available freelancers */
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  /** Loading state for user data fetching */
  const [loading, setLoading] = useState(false);
  /** Currently active tab (businesses or freelancers) */
  const [activeTab, setActiveTab] = useState<string>("businesses");
  const { toast } = useToast();

  /**
   * Fetches users when dialog opens or tab changes
   * 
   * This effect triggers when:
   * - Dialog opens (open state changes to true)
   * - Active tab changes (businesses vs freelancers)
   * 
   * Fetches either businesses or freelancers based on active tab
   */
  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open, activeTab]);

  /**
   * Fetches businesses or freelancers from the database
   * 
   * This function:
   * 1. Gets the current user session
   * 2. Fetches either businesses or freelancers based on active tab
   * 3. Excludes the current user from results
   * 4. Orders results alphabetically by name
   * 5. Updates the appropriate state with fetched data
   * 
   * @async
   * @function fetchUsers
   * @returns {Promise<void>}
   * @throws {Error} When session is invalid or database queries fail
   */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return;
      
      if (activeTab === "businesses") {
        // Fetch businesses excluding current user
        const { data, error } = await supabase
          .from('business_profiles')
          .select('id, name, image_url, category')
          .neq('owner_id', session.user.id)
          .order('name');
          
        if (error) throw error;
        setBusinesses(data || []);
      } else {
        // Fetch freelancers excluding current user
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

  /**
   * Filtered businesses based on search term
   * Case-insensitive search on business name
   */
  const filteredBusinesses = businesses.filter(business => 
    business.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  /**
   * Filtered freelancers based on search term
   * Case-insensitive search on freelancer full name
   */
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
          {/* Search input */}
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
          
          {/* Tabbed interface for businesses and freelancers */}
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
            
            {/* Businesses tab content */}
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
            
            {/* Freelancers tab content */}
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
