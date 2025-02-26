
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface TimeSlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
}

interface BlockedDate {
  blocked_date: string;
  reason?: string;
}

interface BusinessAvailabilityResponse {
  business_id: string;
  created_at: string;
  day_of_week: number;
  end_time: string;
  id: string;
  slot_duration: number;
  start_time: string;
  updated_at: string;
}

const BookingPage = () => {
  const { businessId, serviceId } = useParams();
  const navigate = useNavigate();
  
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [availability, setAvailability] = useState<TimeSlot[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  // Fetch business availability and blocked dates
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!businessId) return;

      // Fetch business availability
      const { data: availabilityData, error: availabilityError } = await supabase
        .from('business_availability')
        .select('*')
        .eq('business_id', businessId);

      if (availabilityError) {
        console.error('Error fetching availability:', availabilityError);
        return;
      }

      // Map the Supabase response to our TimeSlot interface
      const mappedAvailability: TimeSlot[] = (availabilityData || []).map((slot: BusinessAvailabilityResponse) => ({
        dayOfWeek: slot.day_of_week,
        startTime: slot.start_time,
        endTime: slot.end_time,
        slotDuration: slot.slot_duration
      }));

      // Fetch blocked dates
      const { data: blockedDatesData, error: blockedDatesError } = await supabase
        .from('business_blocked_dates')
        .select('*')
        .eq('business_id', businessId);

      if (blockedDatesError) {
        console.error('Error fetching blocked dates:', blockedDatesError);
        return;
      }

      setAvailability(mappedAvailability);
      setBlockedDates(blockedDatesData || []);
    };

    fetchAvailability();
  }, [businessId]);

  // Generate available time slots based on selected date and business availability
  useEffect(() => {
    if (!selectedDate || !availability.length) {
      setAvailableTimeSlots([]);
      return;
    }

    // Get day of week (0 = Sunday, 6 = Saturday)
    const dayOfWeek = selectedDate.getDay();

    // Find availability for selected day
    const dayAvailability = availability.find(slot => slot.dayOfWeek === dayOfWeek);
    
    if (!dayAvailability) {
      setAvailableTimeSlots([]);
      return;
    }

    // Check if date is blocked
    const isDateBlocked = blockedDates.some(blockedDate => 
      format(new Date(blockedDate.blocked_date), 'yyyy-MM-dd') === 
      format(selectedDate, 'yyyy-MM-dd')
    );

    if (isDateBlocked) {
      setAvailableTimeSlots([]);
      return;
    }

    // Generate time slots based on start time, end time, and duration
    const slots: string[] = [];
    const [startHour, startMinute] = dayAvailability.startTime.split(':').map(Number);
    const [endHour, endMinute] = dayAvailability.endTime.split(':').map(Number);
    const slotDuration = dayAvailability.slotDuration;

    let currentTime = new Date();
    currentTime.setHours(startHour, startMinute, 0);
    
    const endTime = new Date();
    endTime.setHours(endHour, endMinute, 0);

    while (currentTime < endTime) {
      slots.push(format(currentTime, 'hh:mm a'));
      currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
    }

    setAvailableTimeSlots(slots);
  }, [selectedDate, availability, blockedDates]);

  // Disable dates that are blocked or have no availability
  const disabledDates = (date: Date) => {
    const dayOfWeek = date.getDay();
    const hasAvailability = availability.some(slot => slot.dayOfWeek === dayOfWeek);
    const isBlocked = blockedDates.some(blockedDate => 
      format(new Date(blockedDate.blocked_date), 'yyyy-MM-dd') === 
      format(date, 'yyyy-MM-dd')
    );
    const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0));

    return !hasAvailability || isBlocked || isPastDate;
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) return;

    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([
          {
            business_id: businessId,
            service_id: serviceId,
            customer_id: (await supabase.auth.getUser()).data.user?.id,
            date: format(selectedDate, 'yyyy-MM-dd'),
            time: selectedTime,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Navigate to appointments page or show success message
      navigate('/appointments');
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-background rounded-lg shadow-md p-4">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)} 
            className="mr-2"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-bold">Book an Appointment</h1>
        </div>

        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          disabled={disabledDates}
          className="rounded-md border shadow mb-4"
        />

        <div className="mt-6">
          <h2 className="text-base font-semibold mb-3">Available Times</h2>
          <div className="flex flex-col space-y-2">
            {availableTimeSlots.map(time => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                className={cn(
                  "rounded-full",
                  selectedTime === time && "bg-primary text-primary-foreground"
                )}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </Button>
            ))}
            {availableTimeSlots.length === 0 && selectedDate && (
              <p className="text-muted-foreground text-center py-4">
                No available time slots for the selected date
              </p>
            )}
          </div>
        </div>

        <Button
          disabled={!selectedDate || !selectedTime}
          onClick={handleBooking}
          className="w-full mt-6 text-primary-foreground bg-violet-700 hover:bg-violet-600"
        >
          Confirm Booking
        </Button>
      </div>
    </div>
  );
};

export default BookingPage;
