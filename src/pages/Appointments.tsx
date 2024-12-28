import { useState } from "react";
import { AppointmentCard } from "@/components/appointments/AppointmentCard";

interface Appointment {
  id: number;
  status: string;
  serviceName: string;
  providerName: string;
  businessName: string;
  businessLogo: string;
  date: string;
  time: string;
}

const Appointments = () => {
  const [openAppointments, setOpenAppointments] = useState<Record<number, boolean>>({});

  const handleOpenChange = (appointmentId: number, isOpen: boolean) => {
    setOpenAppointments(prev => ({
      ...prev,
      [appointmentId]: isOpen
    }));
  };

  const appointments: Appointment[] = [
    {
      id: 1,
      status: "Upcoming",
      serviceName: "Haircut",
      providerName: "John Smith",
      businessName: "Modern Cuts",
      businessLogo: "placeholder.svg",
      date: "November 15",
      time: "2:00 PM"
    },
    {
      id: 2,
      status: "Completed",
      serviceName: "Massage",
      providerName: "Sarah Johnson",
      businessName: "Wellness Spa",
      businessLogo: "placeholder.svg",
      date: "November 10",
      time: "3:30 PM"
    },
    {
      id: 3,
      status: "Upcoming",
      serviceName: "Manicure",
      providerName: "Lisa Brown",
      businessName: "Nail Studio",
      businessLogo: "placeholder.svg",
      date: "November 18",
      time: "1:00 PM"
    }
  ];

  return (
    <div className="min-h-screen bg-secondary pb-20">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-primary mb-8">
          Your Appointments
        </h1>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              isOpen={openAppointments[appointment.id] || false}
              onOpenChange={(isOpen) => handleOpenChange(appointment.id, isOpen)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Appointments;