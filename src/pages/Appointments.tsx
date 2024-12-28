import React, { useRef, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { AppointmentCard } from "@/components/appointments/AppointmentCard";
import { format } from "date-fns";

const appointments = [
  {
    id: 1,
    status: "Upcoming",
    serviceName: "Haircut",
    providerName: "Mike Johnson",
    businessName: "Classic Cuts",
    businessLogo: "placeholder.svg",
    date: "November 2",
    time: "2:00 PM"
  },
  {
    id: 2,
    status: "Upcoming",
    serviceName: "Beard Trim",
    providerName: "Sarah Smith",
    businessName: "Style Studio",
    businessLogo: "placeholder.svg",
    date: "November 5",
    time: "3:30 PM"
  },
  {
    id: 3,
    status: "Pending",
    serviceName: "Hair Coloring",
    providerName: "Juan 'Jago' Gomez",
    businessName: "Ace Of Fadez Barber Lounge",
    businessLogo: "placeholder.svg",
    date: "November 10",
    time: "1:00 PM"
  }
];

const Appointments = () => {
  const appointmentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const appointmentCategories = ["Beauty", "Dining", "Professional", "Home"];

  // Create a map of dates that have appointments
  const appointmentDates = appointments.reduce((acc: Date[], appointment) => {
    const date = new Date(appointment.date + ", 2024");
    acc.push(date);
    return acc;
  }, []);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const formattedDate = format(date, "MMMM d");
    const ref = appointmentRefs.current[formattedDate];
    
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="min-h-screen bg-secondary pb-20">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-2xl font-semibold text-primary">My Appointments</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Calendar
            className="w-full rounded-lg border bg-neutral-900 text-white backdrop-blur-sm p-4"
            mode="single"
            selected={undefined}
            onSelect={handleDateSelect}
            modifiers={{
              booked: appointmentDates,
            }}
            classNames={{
              day_selected: "bg-accent text-primary-foreground hover:bg-accent hover:text-primary-foreground focus:bg-accent focus:text-primary-foreground",
              day_today: "text-accent relative before:absolute before:bottom-1 before:left-1/2 before:-translate-x-1/2 before:h-1 before:w-1 before:rounded-full before:bg-accent",
              day: "h-9 w-9 p-0 font-normal text-white aria-selected:opacity-100 hover:bg-neutral-800",
              day_disabled: "text-neutral-600",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
              cell: "relative h-9 w-9 text-center text-sm p-0 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              head_cell: "text-neutral-400 rounded-md w-9 font-normal text-[0.8rem] uppercase",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white",
              caption: "text-white",
              root: "bg-neutral-900",
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            }}
          />
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-800">
              Upcoming Appointments
            </h2>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  ref={(el) => appointmentRefs.current[appointment.date] = el}
                >
                  <AppointmentCard appointment={appointment} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {appointmentCategories.map((category) => (
          <div key={category} className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-800">
              {category} Appointments
            </h2>
            <div className="relative">
              <div className="overflow-x-auto pb-4">
                <div className="flex space-x-4 min-w-max">
                  {[1, 2, 3].map((i) => (
                    <AppointmentCard
                      key={i}
                      appointment={{
                        id: i,
                        status: "Upcoming",
                        serviceName: `${category} Service ${i}`,
                        providerName: "Provider Name",
                        businessName: "Business Name",
                        businessLogo: "placeholder.svg",
                        date: "November 15",
                        time: "2:00 PM"
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Appointments;
