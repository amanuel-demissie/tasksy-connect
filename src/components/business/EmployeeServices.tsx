
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [services, setServices] = useState<BusinessService[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch all business services and assigned employee services
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all business services
        const { data: businessServices, error: businessError } = await supabase
          .from("business_services")
          .select("*")
          .eq("business_id", businessId);

        if (businessError) throw businessError;
        
        // Fetch employee's assigned services
        const { data: employeeServices, error: employeeError } = await supabase
          .from("employee_services")
          .select("service_id")
          .eq("employee_id", employeeId);

        if (employeeError) throw employeeError;

        // Set all services
        setServices(businessServices || []);
        
        // Set selected services
        const assignedServiceIds = employeeServices?.map(es => es.service_id) || [];
        setSelectedServices(assignedServiceIds);
      } catch (error) {
        console.error("Error fetching services:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load services data",
        });
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      fetchData();
    }
  }, [businessId, employeeId, toast]);

  // Handle service selection
  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  // Save service assignments
  const handleSave = async () => {
    setSaving(true);

    try {
      // Delete all existing assignments
      const { error: deleteError } = await supabase
        .from("employee_services")
        .delete()
        .eq("employee_id", employeeId);

      if (deleteError) throw deleteError;

      // Insert new assignments
      if (selectedServices.length > 0) {
        const newAssignments = selectedServices.map(serviceId => ({
          employee_id: employeeId,
          service_id: serviceId,
        }));

        const { error: insertError } = await supabase
          .from("employee_services")
          .insert(newAssignments);

        if (insertError) throw insertError;
      }

      toast({
        title: "Success",
        description: "Services updated successfully",
      });
    } catch (error) {
      console.error("Error saving service assignments:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update services",
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
            <div className="flex justify-end mt-4">
              <Button 
                onClick={handleSave} 
                disabled={saving}
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
