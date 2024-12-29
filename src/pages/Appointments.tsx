import React, { useRef } from "react";
import { format } from "date-fns";
import { AppointmentCalendar } from "@/components/appointments/AppointmentCalendar";
import { UpcomingAppointments } from "@/components/appointments/UpcomingAppointments";
import { AppointmentCategory } from "@/components/appointments/AppointmentCategory";
import { Appointment } from "@/types/appointment";

const appointments: Appointment[] = [
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

  return (
    <div className="min-h-screen bg-secondary pb-20">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-2xl font-semibold text-primary">My Appointments</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AppointmentCalendar
            appointmentDates={appointmentDates}
            onDateSelect={handleDateSelect}
          />
          <UpcomingAppointments
            appointments={appointments}
            appointmentRefs={appointmentRefs}
          />
        </div>

        {appointmentCategories.map((category) => (
          <AppointmentCategory key={category} category={category} />
        ))}
      </div>
    </div>
  );
};

export default Appointments;