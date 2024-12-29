import React, { useRef, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { AppointmentCard } from "@/components/appointments/AppointmentCard";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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

  const hasAppointments = (date: Date) => {
    return appointmentDates.some(appointmentDate => 
      appointmentDate.getDate() === date.getDate() &&
      appointmentDate.getMonth() === date.getMonth() &&
      appointmentDate.getFullYear() === date.getFullYear()
    );
  };

  return (
    <div className="min-h-screen bg-secondary pb-20">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-2xl font-semibold text-primary">My Appointments</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Calendar
            className="w-full rounded-2xl border-0 bg-[#1A1F2C] text-white p-6"
            mode="single"
            selected={undefined}
            onSelect={handleDateSelect}
            modifiers={{
              booked: appointmentDates,
            }}
            modifiersStyles={{
              booked: {
                fontWeight: "bold"
              }
            }}
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-2xl font-light tracking-wide",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-neutral-400 rounded-md w-9 font-normal text-[0.8rem] uppercase",
              row: "flex w-full mt-2",
              cell: "relative h-9 w-9 text-center text-sm p-0 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: (props: { date: Date }) => cn(
                "h-9 w-9 p-0 font-normal text-white aria-selected:opacity-100 hover:bg-neutral-800/50 rounded-full transition-colors",
                hasAppointments(props.date) ? 'after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-accent' : ''
              ),
              day_range_end: "day-range-end",
              day_selected: "bg-accent text-white hover:bg-accent hover:text-white focus:bg-accent focus:text-white",
              day_today: "text-accent relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-accent",
              day_outside: "text-neutral-600 opacity-50",
              day_disabled: "text-neutral-600 opacity-50",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-white",
              day_hidden: "invisible",
            }}
          />
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-primary">
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
            <h2 className="text-lg font-semibold text-primary">
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
