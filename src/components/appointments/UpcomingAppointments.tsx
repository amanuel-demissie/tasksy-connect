
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppointmentCard } from "./AppointmentCard";
import { Appointment } from "@/types/appointment";

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  appointmentRefs: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
  onStatusChange?: () => void;
}

export const UpcomingAppointments = ({
  appointments,
  appointmentRefs,
  onStatusChange
}: UpcomingAppointmentsProps) => {
  // Group appointments by date
  const groupedAppointments = appointments.reduce(
    (groups: { [date: string]: Appointment[] }, appointment) => {
      if (!groups[appointment.date]) {
        groups[appointment.date] = [];
      }
      groups[appointment.date].push(appointment);
      return groups;
    },
    {}
  );

  // Sort dates chronologically
  const sortedDates = Object.keys(groupedAppointments).sort(
    (a, b) => new Date(a + ", 2024").getTime() - new Date(b + ", 2024").getTime()
  );

  return (
    <Card className="bg-[#1A1F2C]/80 backdrop-blur-sm border-[#403E43]">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-xl">Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No upcoming appointments</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDates.map((date) => (
              <div 
                key={date} 
                ref={(el) => (appointmentRefs.current[date] = el)}
                className="space-y-2"
              >
                <div className="sticky top-0 bg-[#1A1F2C] z-10 py-2">
                  <h3 className="text-[#C8C8C9] font-medium">{date}</h3>
                </div>
                <div className="space-y-3">
                  {groupedAppointments[date].map((appointment) => (
                    <AppointmentCard 
                      key={appointment.id} 
                      appointment={appointment} 
                      onStatusChange={onStatusChange}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
