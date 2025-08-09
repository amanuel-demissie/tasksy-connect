
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/components/auth/AuthProvider";

interface BusinessService {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
}

interface EmployeeServicesProps {
  employeeId: string;
  businessId: string;
}

export default function EmployeeServices({ employeeId, businessId }: EmployeeServicesProps) {
  const { toast } = useToast();
  const { session } = useAuth();
  const [services, setServices] = useState<BusinessService[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Debug authentication state
  useEffect(() => {
    console.log("EmployeeServices Debug - Session:", session);
    console.log("EmployeeServices Debug - Employee ID:", employeeId);
    console.log("EmployeeServices Debug - Business ID:", businessId);
    
    setDebugInfo({
      isAuthenticated: !!session,
      userId: session?.user?.id,
      employeeId,
      businessId,
      timestamp: new Date().toISOString()
    });
  }, [session, employeeId, businessId]);

  // Fetch all business services and assigned employee services
  useEffect(() => {
    const fetchData = async () => {
      if (!session || !employeeId) {
        console.log("EmployeeServices - Missing session or employeeId");
        return;
      }

      try {
        console.log("EmployeeServices - Fetching business services for businessId:", businessId);
        
        // Fetch all business services
        const { data: businessServices, error: businessError } = await supabase
          .from("business_services")
          .select("*")
          .eq("business_id", businessId);

        if (businessError) {
          console.error("Error fetching business services:", businessError);
          throw businessError;
        }
        
        console.log("EmployeeServices - Business services fetched:", businessServices);
        
        // Fetch employee's assigned services
        const { data: employeeServices, error: employeeError } = await supabase
          .from("employee_services")
          .select("service_id")
          .eq("employee_id", employeeId);

        if (employeeError) {
          console.error("Error fetching employee services:", employeeError);
          throw employeeError;
        }

        console.log("EmployeeServices - Employee services fetched:", employeeServices);

        // Set all services
        setServices(businessServices || []);
        
        // Set selected services
        const assignedServiceIds = employeeServices?.map(es => es.service_id) || [];
        setSelectedServices(assignedServiceIds);
        
        console.log("EmployeeServices - Selected services set:", assignedServiceIds);
      } catch (error) {
        console.error("Error in fetchData:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load services data: " + (error as Error).message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [businessId, employeeId, session, toast, refreshTrigger]);

  // Handle service selection
  const handleServiceToggle = (serviceId: string) => {
    console.log("EmployeeServices - Toggling service:", serviceId);
    
    setSelectedServices(prev => {
      const newSelection = prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId];
      
      console.log("EmployeeServices - New selection:", newSelection);
      return newSelection;
    });
  };

  // Save service assignments with improved error handling
  const handleSave = async () => {
    console.log("EmployeeServices - Starting save operation");
    
    // Pre-save validation
    if (!session) {
      console.error("EmployeeServices - No session found");
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to save changes",
      });
      return;
    }

    if (!employeeId) {
      console.error("EmployeeServices - No employee ID");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Employee ID is required",
      });
      return;
    }

    setSaving(true);

    try {
      console.log("EmployeeServices - Auth state check:", {
        userId: session.user.id,
        employeeId,
        selectedServices,
        servicesCount: selectedServices.length
      });

      // First, verify the employee belongs to a business owned by the current user
      const { data: employeeCheck, error: employeeCheckError } = await supabase
        .from("employees")
        .select(`
          id,
          business_id,
          business_profiles!employees_business_id_fkey(
            id,
            owner_id
          )
        `)
        .eq("id", employeeId)
        .single();

      if (employeeCheckError) {
        console.error("EmployeeServices - Employee check error:", employeeCheckError);
        throw new Error("Failed to verify employee ownership");
      }

      if (!employeeCheck || employeeCheck.business_profiles?.owner_id !== session.user.id) {
        console.error("EmployeeServices - Permission denied:", {
          employeeCheck,
          currentUserId: session.user.id
        });
        throw new Error("You don't have permission to modify this employee's services");
      }

      console.log("EmployeeServices - Employee ownership verified:", employeeCheck);

      // Get current assignments to compare
      const { data: currentAssignments, error: currentError } = await supabase
        .from("employee_services")
        .select("service_id")
        .eq("employee_id", employeeId);

      if (currentError) {
        console.error("EmployeeServices - Error fetching current assignments:", currentError);
        throw currentError;
      }

      const currentServiceIds = currentAssignments?.map(a => a.service_id) || [];
      console.log("EmployeeServices - Current assignments:", currentServiceIds);
      console.log("EmployeeServices - New assignments:", selectedServices);

      // Calculate what needs to be added and removed
      const toAdd = selectedServices.filter(id => !currentServiceIds.includes(id));
      const toRemove = currentServiceIds.filter(id => !selectedServices.includes(id));

      console.log("EmployeeServices - To add:", toAdd);
      console.log("EmployeeServices - To remove:", toRemove);

      // Remove unselected services
      if (toRemove.length > 0) {
        const { error: deleteError } = await supabase
          .from("employee_services")
          .delete()
          .eq("employee_id", employeeId)
          .in("service_id", toRemove);

        if (deleteError) {
          console.error("EmployeeServices - Delete error:", deleteError);
          throw deleteError;
        }
        console.log("EmployeeServices - Successfully removed services:", toRemove);
      }

      // Add new services
      if (toAdd.length > 0) {
        const newAssignments = toAdd.map(serviceId => ({
          employee_id: employeeId,
          service_id: serviceId,
        }));

        console.log("EmployeeServices - Inserting new assignments:", newAssignments);

        const { error: insertError, data: insertData } = await supabase
          .from("employee_services")
          .insert(newAssignments)
          .select();

        if (insertError) {
          console.error("EmployeeServices - Insert error:", insertError);
          throw insertError;
        }
        console.log("EmployeeServices - Successfully added services:", insertData);
      }

      console.log("EmployeeServices - Save operation completed successfully");
      
      // Trigger a full refresh of the data to update the UI
      console.log("EmployeeServices - Triggering data refresh");
      
      // Small delay to ensure database transaction is committed
      setTimeout(() => {
        setRefreshTrigger(prev => prev + 1);
      }, 100);
      
      toast({
        title: "Success",
        description: "Services updated successfully. Refreshing...",
      });

    } catch (error) {
      console.error("EmployeeServices - Save operation failed:", error);
      
      let errorMessage = "Failed to update services";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Check for specific RLS-related errors
      if (errorMessage.includes('new row violates row-level security policy') || 
          errorMessage.includes('permission denied')) {
        errorMessage = "Permission denied. Please ensure you own this business and try again.";
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setSaving(false);
    }
  };

  if (!employeeId) {
    return <p>Please select an employee first</p>;
  }

  if (loading) {
    return <div className="text-center py-4">Loading services...</div>;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Assigned Services</CardTitle>
        
        {/* Debug info - remove after fixing */}
        {debugInfo && (
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
            <strong>Debug Info:</strong> Auth: {debugInfo.isAuthenticated ? 'Yes' : 'No'} | 
            User: {debugInfo.userId?.slice(0, 8)}... | 
            Employee: {debugInfo.employeeId?.slice(0, 8)}... | 
            Business: {debugInfo.businessId?.slice(0, 8)}...
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {services.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No services found for this business
          </p>
        ) : (
          <>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`service-${service.id}`}
                      checked={selectedServices.includes(service.id)}
                      onCheckedChange={() => handleServiceToggle(service.id)}
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={`service-${service.id}`}
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        {service.name}
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        ${service.price.toFixed(2)} • {service.duration}min
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                {selectedServices.length} of {services.length} services selected
              </div>
              <Button 
                onClick={handleSave} 
                disabled={saving || !session}
                className="bg-accent text-white hover:bg-accent/90"
              >
                {saving ? "Saving..." : "Save Assignments"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
