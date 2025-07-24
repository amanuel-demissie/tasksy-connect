
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface EmployeeTimeSlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface EmployeeAvailabilityHook {
  availableTimeSlots: string[];
  loading: boolean;
  error: string | null;
}

export const useEmployeeAvailability = (
  employeeId: string | null,
  businessId: string,
  selectedDate: Date | undefined
): EmployeeAvailabilityHook => {
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedDate) {
      setAvailableTimeSlots([]);
      return;
    }

    const fetchAvailability = async () => {
      setLoading(true);
      setError(null);

      try {
        const dayOfWeek = selectedDate.getDay();
        const dateString = format(selectedDate, 'yyyy-MM-dd');

        if (employeeId) {
          // Get specific employee availability
          const { data: employeeAvailability, error: availabilityError } = await supabase
            .from('employee_availability')
            .select('*')
            .eq('employee_id', employeeId)
            .eq('day_of_week', dayOfWeek);

          if (availabilityError) {
            throw availabilityError;
          }

          if (!employeeAvailability?.length) {
            setAvailableTimeSlots([]);
            return;
          }

          // Get existing appointments for this employee on this date
          const { data: existingAppointments, error: appointmentsError } = await supabase
            .from('appointments')
            .select('time')
            .eq('employee_id', employeeId)
            .eq('date', dateString)
            .neq('status', 'cancelled');

          if (appointmentsError) {
            throw appointmentsError;
          }

          // Generate time slots based on employee availability
          const slots: string[] = [];
          const bookedTimes = new Set(existingAppointments?.map(apt => apt.time) || []);

          employeeAvailability.forEach(availability => {
            const [startHour, startMinute] = availability.start_time.split(':').map(Number);
            const [endHour, endMinute] = availability.end_time.split(':').map(Number);
            const slotDuration = 30; // Default 30 minutes

            let currentTime = new Date();
            currentTime.setHours(startHour, startMinute, 0);
            
            const endTime = new Date();
            endTime.setHours(endHour, endMinute, 0);

            while (currentTime < endTime) {
              const timeString = format(currentTime, 'HH:mm:ss');
              const displayTime = format(currentTime, 'hh:mm a');
              
              if (!bookedTimes.has(timeString)) {
                slots.push(displayTime);
              }
              
              currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
            }
          });

          setAvailableTimeSlots(slots);
        } else {
          // No preference - get combined availability of all employees with this service
          // This is a simplified version - in production you might want more sophisticated logic
          const { data: businessAvailability, error: businessError } = await supabase
            .from('business_availability')
            .select('*')
            .eq('business_id', businessId)
            .eq('day_of_week', dayOfWeek);

          if (businessError) {
            throw businessError;
          }

          if (!businessAvailability?.length) {
            setAvailableTimeSlots([]);
            return;
          }

          // Generate time slots based on business availability
          const slots: string[] = [];
          businessAvailability.forEach(availability => {
            const [startHour, startMinute] = availability.start_time.split(':').map(Number);
            const [endHour, endMinute] = availability.end_time.split(':').map(Number);
            const slotDuration = availability.slot_duration || 30;

            let currentTime = new Date();
            currentTime.setHours(startHour, startMinute, 0);
            
            const endTime = new Date();
            endTime.setHours(endHour, endMinute, 0);

            while (currentTime < endTime) {
              const displayTime = format(currentTime, 'hh:mm a');
              if (!slots.includes(displayTime)) {
                slots.push(displayTime);
              }
              currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
            }
          });

          setAvailableTimeSlots(slots);
        }
      } catch (error) {
        console.error('Error fetching employee availability:', error);
        setError('Failed to load availability');
        setAvailableTimeSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [employeeId, businessId, selectedDate]);

  return {
    availableTimeSlots,
    loading,
    error
  };
};
