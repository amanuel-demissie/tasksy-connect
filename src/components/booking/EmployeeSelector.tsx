
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface Employee {
  id: string;
  name: string;
  title?: string;
  image_url?: string;
  bio?: string;
}

interface EmployeeSelectorProps {
  businessId: string;
  serviceId: string;
  selectedEmployeeId?: string;
  onEmployeeSelect: (employeeId: string | null) => void;
}

export default function EmployeeSelector({
  businessId,
  serviceId,
  selectedEmployeeId,
  onEmployeeSelect
}: EmployeeSelectorProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // Fetch employees who can provide this service and are active
        const { data: employeeServices, error } = await supabase
          .from('employee_services')
          .select(`
            employee_id,
            employees (
              id,
              name,
              title,
              image_url,
              bio,
              is_active
            )
          `)
          .eq('service_id', serviceId);

        if (error) {
          console.error('Error fetching employees:', error);
          return;
        }

        // Filter active employees and map to our interface
        const activeEmployees = employeeServices
          ?.filter(es => es.employees?.is_active)
          .map(es => ({
            id: es.employees.id,
            name: es.employees.name,
            title: es.employees.title,
            image_url: es.employees.image_url,
            bio: es.employees.bio
          })) || [];

        setEmployees(activeEmployees);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [businessId, serviceId]);

  if (loading) {
    return (
      <div className="space-y-3">
        <h3 className="text-base font-semibold">Select Employee</h3>
        <div className="text-sm text-muted-foreground">Loading employees...</div>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="space-y-3">
        <h3 className="text-base font-semibold">Select Employee</h3>
        <div className="text-sm text-muted-foreground">No employees available for this service</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold">Select Employee</h3>
      <ScrollArea className="w-full max-w-full overflow-x-auto">
        <div className="flex space-x-3 pb-2 min-w-[320px] md:min-w-0">
          {/* No preference option */}
          <Button
            variant={selectedEmployeeId === null ? "default" : "outline"}
            className={cn(
              "flex flex-col items-center space-y-2 h-auto py-3 px-4 min-w-[100px] focus-visible:ring-2 focus-visible:ring-violet-500",
              selectedEmployeeId === null && "bg-violet-700 text-white hover:bg-violet-600"
            )}
            onClick={() => onEmployeeSelect(null)}
            aria-label="No preference"
          >
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <div className="text-xs text-center">No preference</div>
          </Button>

          {/* Employee options */}
          {employees.map((employee) => (
            <Button
              key={employee.id}
              variant={selectedEmployeeId === employee.id ? "default" : "outline"}
              className={cn(
                "flex flex-col items-center space-y-2 h-auto py-3 px-4 min-w-[100px] focus-visible:ring-2 focus-visible:ring-violet-500",
                selectedEmployeeId === employee.id && "bg-violet-700 text-white hover:bg-violet-600"
              )}
              onClick={() => onEmployeeSelect(employee.id)}
              aria-label={`Select ${employee.name}`}
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={employee.image_url} alt={employee.name} />
                <AvatarFallback>
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="text-xs text-center">
                <div className="font-medium truncate max-w-[80px]">{employee.name}</div>
                {employee.title && (
                  <div className="text-muted-foreground truncate max-w-[80px]">{employee.title}</div>
                )}
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
