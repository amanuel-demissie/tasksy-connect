import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";

interface TimeSlot {
  id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  isNew?: boolean;
}

interface EmployeeAvailabilityProps {
  employeeId: string;
}

const daysOfWeek = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export default function EmployeeAvailability({ employeeId }: EmployeeAvailabilityProps) {
  const { toast } = useToast();
  const [availability, setAvailability] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch employee availability
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!employeeId) return;

      try {
        const { data, error } = await supabase
          .from("employee_availability")
          .select("*")
          .eq("employee_id", employeeId)
          .order("day_of_week")
          .order("start_time");

        if (error) throw error;
        setAvailability(data || []);
      } catch (error) {
        console.error("Error fetching availability:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load availability data",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [employeeId, toast]);

  // Add new time slot
  const addTimeSlot = () => {
    const newSlot: TimeSlot = {
      day_of_week: 1, // Monday by default
      start_time: "09:00:00",
      end_time: "17:00:00",
      isNew: true
    };
    setAvailability([...availability, newSlot]);
  };

  // Update time slot
  const updateTimeSlot = (index: number, field: string, value: string | number) => {
    const updatedSlots = [...availability];
    updatedSlots[index] = { 
      ...updatedSlots[index], 
      [field]: value 
    };
    setAvailability(updatedSlots);
  };

  // Delete time slot
  const deleteTimeSlot = async (index: number) => {
    const slot = availability[index];
    
    // If it's a new slot (not saved yet), just remove from state
    if (slot.isNew) {
      const updatedSlots = [...availability];
      updatedSlots.splice(index, 1);
      setAvailability(updatedSlots);
      return;
    }
    
    // Otherwise delete from database
    try {
      const { error } = await supabase
        .from("employee_availability")
        .delete()
        .eq("id", slot.id);

      if (error) throw error;
      
      // Remove from state
      const updatedSlots = [...availability];
      updatedSlots.splice(index, 1);
      setAvailability(updatedSlots);
      
      toast({
        title: "Success",
        description: "Time slot deleted",
      });
    } catch (error) {
      console.error("Error deleting time slot:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete time slot",
      });
    }
  };

  // Save all changes
  const saveChanges = async () => {
    setSaving(true);
    
    try {
      // Validate times
      for (const slot of availability) {
        if (slot.start_time >= slot.end_time) {
          toast({
            variant: "destructive",
            title: "Invalid Time",
            description: "Start time must be before end time",
          });
          setSaving(false);
          return;
        }
      }
      
      // Create array for new slots
      const newSlots = availability.filter(slot => slot.isNew).map(slot => ({
        employee_id: employeeId,
        day_of_week: slot.day_of_week,
        start_time: slot.start_time,
        end_time: slot.end_time
      }));
      
      // Create array for updated slots
      const updatedSlots = availability
        .filter(slot => !slot.isNew && slot.id)
        .map(({ id, day_of_week, start_time, end_time }) => ({
          id,
          day_of_week,
          start_time,
          end_time
        }));
      
      // Insert new slots
      if (newSlots.length > 0) {
        const { error: insertError } = await supabase
          .from("employee_availability")
          .insert(newSlots);

        if (insertError) throw insertError;
      }
      
      // Update existing slots individually
      for (const slot of updatedSlots) {
        const { error: updateError } = await supabase
          .from("employee_availability")
          .update({
            day_of_week: slot.day_of_week,
            start_time: slot.start_time,
            end_time: slot.end_time
          })
          .eq("id", slot.id);

        if (updateError) throw updateError;
      }
      
      // Refetch data to get IDs for new slots
      const { data, error } = await supabase
        .from("employee_availability")
        .select("*")
        .eq("employee_id", employeeId)
        .order("day_of_week")
        .order("start_time");
        
      if (error) throw error;
      setAvailability(data || []);
      
      toast({
        title: "Success",
        description: "Availability saved successfully",
      });
    } catch (error) {
      console.error("Error saving availability:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save availability",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!employeeId) {
    return <p>Please select an employee first</p>;
  }

  if (loading) {
    return <div className="text-center py-4">Loading availability...</div>;
  }

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle className="text-lg">Availability</CardTitle>
        <Button 
          onClick={addTimeSlot} 
          size="sm" 
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Time Slot
        </Button>
      </CardHeader>
      <CardContent>
        {availability.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No availability set</p>
            <Button 
              onClick={addTimeSlot} 
              className="bg-accent text-white hover:bg-accent/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Time Slot
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {availability.map((slot, index) => (
                  <div key={slot.id || index} className="grid grid-cols-[2fr,1fr,1fr,auto] gap-2 items-center">
                    <Select
                      value={slot.day_of_week.toString()}
                      onValueChange={(value) => updateTimeSlot(index, 'day_of_week', parseInt(value))}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                      <SelectContent>
                        {daysOfWeek.map((day) => (
                          <SelectItem key={day.value} value={day.value.toString()}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Input
                      type="time"
                      value={slot.start_time.substring(0, 5)}
                      onChange={(e) => updateTimeSlot(index, 'start_time', e.target.value + ':00')}
                      className="h-9"
                    />
                    
                    <Input
                      type="time"
                      value={slot.end_time.substring(0, 5)}
                      onChange={(e) => updateTimeSlot(index, 'end_time', e.target.value + ':00')}
                      className="h-9"
                    />
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTimeSlot(index)}
                      className="h-9 w-9"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="flex justify-end mt-4">
              <Button 
                onClick={saveChanges} 
                disabled={saving}
                className="bg-accent text-white hover:bg-accent/90"
              >
                {saving ? "Saving..." : "Save Availability"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
