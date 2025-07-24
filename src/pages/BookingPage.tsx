
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import EmployeeSelector from "@/components/booking/EmployeeSelector";
import { useEmployeeAvailability } from "@/hooks/use-employee-availability";

interface BlockedDate {
  blocked_date: string;
  reason?: string;
}

const BookingPage = () => {
  const { businessId, serviceId } = useParams();
  const navigate = useNavigate();
  
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [serviceName, setServiceName] = useState<string>("");

  const { availableTimeSlots, loading: availabilityLoading } = useEmployeeAvailability(
    selectedEmployeeId,
    businessId!,
    selectedDate
  );

  // Fetch service name and blocked dates
  useEffect(() => {
    const fetchData = async () => {
      if (!businessId || !serviceId) return;

      // Fetch service name
      const { data: serviceData, error: serviceError } = await supabase
        .from('business_services')
        .select('name')
        .eq('id', serviceId)
        .single();

      if (serviceError) {
        console.error('Error fetching service:', serviceError);
      } else {
        setServiceName(serviceData?.name || "");
      }

      // Fetch blocked dates
      const { data: blockedDatesData, error: blockedDatesError } = await supabase
        .from('business_blocked_dates')
        .select('*')
        .eq('business_id', businessId);

      if (blockedDatesError) {
        console.error('Error fetching blocked dates:', blockedDatesError);
      } else {
        setBlockedDates(blockedDatesData || []);
      }
    };

    fetchData();
  }, [businessId, serviceId]);

  // Reset selected time when date or employee changes
  useEffect(() => {
    setSelectedTime(undefined);
  }, [selectedDate, selectedEmployeeId]);

  // Disable dates that are blocked or in the past
  const disabledDates = (date: Date) => {
    const isBlocked = blockedDates.some(blockedDate => 
      format(new Date(blockedDate.blocked_date), 'yyyy-MM-dd') === 
      format(date, 'yyyy-MM-dd')
    );
    const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0));

    return isBlocked || isPastDate;
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) return;

    try {
      // Convert display time back to 24-hour format for database
      const timeFor24Hour = new Date(`1970-01-01 ${selectedTime}`);
      const time24Hour = format(timeFor24Hour, 'HH:mm:ss');

      const appointmentData = {
        business_id: businessId,
        service_id: serviceId,
        customer_id: (await supabase.auth.getUser()).data.user?.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: time24Hour,
        status: 'pending',
        ...(selectedEmployeeId && { employee_id: selectedEmployeeId })
      };

      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()
        .single();

      if (error) throw error;

      // Navigate to appointments page
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

        {serviceName && (
          <div className="mb-6">
            <h2 className="text-base font-semibold text-muted-foreground">
              Service: {serviceName}
            </h2>
          </div>
        )}

        {/* Employee Selection */}
        <div className="mb-6">
          <EmployeeSelector
            businessId={businessId!}
            serviceId={serviceId!}
            selectedEmployeeId={selectedEmployeeId}
            onEmployeeSelect={setSelectedEmployeeId}
          />
        </div>

        {/* Calendar */}
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          disabled={disabledDates}
          className="rounded-md border shadow mb-4"
        />

        {/* Available Times */}
        <div className="mt-6">
          <h2 className="text-base font-semibold mb-3">Available Times</h2>
          <div className="flex flex-col space-y-2">
            {availabilityLoading ? (
              <p className="text-muted-foreground text-center py-4">
                Loading available times...
              </p>
            ) : availableTimeSlots.length > 0 ? (
              availableTimeSlots.map(time => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className={cn(
                    "rounded-full",
                    selectedTime === time && "bg-violet-700 text-white hover:bg-violet-600"
                  )}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))
            ) : selectedDate ? (
              <p className="text-muted-foreground text-center py-4">
                No available time slots for the selected date
                {selectedEmployeeId && " and employee"}
              </p>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Please select a date to see available times
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
