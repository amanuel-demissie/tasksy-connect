import React from "react";
import { AppointmentCard } from "./AppointmentCard";
import { Appointment } from "@/types/appointment";

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  appointmentRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
}

export const UpcomingAppointments = ({ appointments, appointmentRefs }: UpcomingAppointmentsProps) => {
  return (
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
  );
};