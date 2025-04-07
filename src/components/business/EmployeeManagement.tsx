
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import EmployeesList from "./EmployeesList";
import EmployeeServices from "./EmployeeServices";
import EmployeeAvailability from "./EmployeeAvailability";
import { supabase } from "@/integrations/supabase/client";

interface Employee {
  id: string;
  name: string;
}

interface EmployeeManagementProps {
  businessId: string;
}

export default function EmployeeManagement({ businessId }: EmployeeManagementProps) {
  const [activeTab, setActiveTab] = useState("list");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  
  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("id, name")
        .eq("business_id", businessId)
        .order("name");
        
      if (error) throw error;
      setEmployees(data || []);
      
      // If we have employees but none selected, select the first one
      if (data && data.length > 0 && !selectedEmployeeId) {
        setSelectedEmployeeId(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchEmployees();
  }, [businessId]);
  
  // Handle employee selection change
  const handleEmployeeChange = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
  };
  
  // Handle employee added
  const handleEmployeeAdded = () => {
    fetchEmployees();
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Employee Management</h2>
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Employees</TabsTrigger>
          <TabsTrigger 
            value="services"
            disabled={employees.length === 0}
          >
            Services
          </TabsTrigger>
          <TabsTrigger 
            value="availability"
            disabled={employees.length === 0}
          >
            Availability
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="pt-4">
          <EmployeesList 
            businessId={businessId} 
            onEmployeeAdded={handleEmployeeAdded} 
          />
        </TabsContent>
        
        <TabsContent value="services" className="pt-4">
          {employees.length > 0 ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="employee-select">Select Employee</Label>
                <Select
                  value={selectedEmployeeId}
                  onValueChange={handleEmployeeChange}
                >
                  <SelectTrigger id="employee-select">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <EmployeeServices 
                employeeId={selectedEmployeeId} 
                businessId={businessId} 
              />
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Add employees first to manage their services
              </p>
              <Button 
                onClick={() => setActiveTab("list")}
                className="bg-accent text-white hover:bg-accent/90"
              >
                Add Employees
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="availability" className="pt-4">
          {employees.length > 0 ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="employee-select-avail">Select Employee</Label>
                <Select
                  value={selectedEmployeeId}
                  onValueChange={handleEmployeeChange}
                >
                  <SelectTrigger id="employee-select-avail">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <EmployeeAvailability employeeId={selectedEmployeeId} />
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Add employees first to manage their availability
              </p>
              <Button 
                onClick={() => setActiveTab("list")}
                className="bg-accent text-white hover:bg-accent/90"
              >
                Add Employees
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
