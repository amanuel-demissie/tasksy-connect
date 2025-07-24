
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
  selectedDate: Date | undefined,
  serviceId?: string // Add serviceId for filtering eligible employees
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
          if (!serviceId) {
            setAvailableTimeSlots([]);
            setLoading(false);
            return;
          }

          // 1. Get all employees for this business and service
          const { data: employeeServices, error: employeeServicesError } = await supabase
            .from('employee_services')
            .select('employee_id')
            .eq('service_id', serviceId);

          if (employeeServicesError) throw employeeServicesError;

          const employeeIds = employeeServices?.map(es => es.employee_id) || [];
          if (employeeIds.length === 0) {
            setAvailableTimeSlots([]);
            setLoading(false);
            return;
          }

          // 2. For each employee, get their availability for the day
          const { data: availabilities, error: availabilitiesError } = await supabase
            .from('employee_availability')
            .select('*')
            .in('employee_id', employeeIds)
            .eq('day_of_week', dayOfWeek);

          if (availabilitiesError) throw availabilitiesError;

          // 3. For each employee, get their booked times for the date
          const { data: appointments, error: appointmentsError } = await supabase
            .from('appointments')
            .select('employee_id, time')
            .in('employee_id', employeeIds)
            .eq('date', dateString)
            .neq('status', 'cancelled');

          if (appointmentsError) throw appointmentsError;

          // 4. Generate all possible slots for all employees, filter out booked
          const slotsSet = new Set<string>();
          for (const availability of availabilities || []) {
            const [startHour, startMinute] = availability.start_time.split(':').map(Number);
            const [endHour, endMinute] = availability.end_time.split(':').map(Number);
            const slotDuration = 30; // Default 30 minutes

            let currentTime = new Date();
            currentTime.setHours(startHour, startMinute, 0);
            const endTime = new Date();
            endTime.setHours(endHour, endMinute, 0);

            // Get booked times for this employee
            const bookedTimes = new Set(
              (appointments || [])
                .filter(a => a.employee_id === availability.employee_id)
                .map(a => a.time)
            );

            while (currentTime < endTime) {
              const timeString = format(currentTime, 'HH:mm:ss');
              const displayTime = format(currentTime, 'hh:mm a');
              if (!bookedTimes.has(timeString)) {
                slotsSet.add(displayTime);
              }
              currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
            }
          }

          // Sort slots chronologically
          const sortedSlots = Array.from(slotsSet).sort((a, b) => {
            const dateA = new Date(`1970-01-01 ${a}`);
            const dateB = new Date(`1970-01-01 ${b}`);
            return dateA.getTime() - dateB.getTime();
          });

          setAvailableTimeSlots(sortedSlots);
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
  }, [employeeId, businessId, selectedDate, serviceId]);

  return {
    availableTimeSlots,
    loading,
    error
  };
};
