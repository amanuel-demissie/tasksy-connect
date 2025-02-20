import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
const timeSlots = ["12:00 PM", "12:30 PM", "2:00 PM", "3:00 PM", "3:30 PM", "4:00 PM"];
const BookingPage = () => {
  const {
    businessId,
    serviceId
  } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const handleBooking = () => {
    if (!selectedDate || !selectedTime) return;
    // TODO: Implement booking creation
    console.log("Booking:", {
      businessId,
      serviceId,
      selectedDate,
      selectedTime
    });
  };
  return <div className="container mx-auto px-4 py-6">
      <div className="bg-background rounded-lg shadow-md p-4">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-bold">Book an Appointment</h1>
        </div>

        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border shadow mb-4" />

        <div className="mt-6">
          <h2 className="text-base font-semibold mb-3">Available Times</h2>
          <div className="flex flex-col space-y-2">
            {timeSlots.map(time => <Button key={time} variant={selectedTime === time ? "default" : "outline"} className={cn("rounded-full", selectedTime === time && "bg-primary text-primary-foreground")} onClick={() => setSelectedTime(time)}>
                {time}
              </Button>)}
          </div>
        </div>

        <Button disabled={!selectedDate || !selectedTime} onClick={handleBooking} className="w-full mt-6 text-primary-foreground bg-violet-700 hover:bg-violet-600">
          Confirm Booking
        </Button>
      </div>
    </div>;
};
export default BookingPage;