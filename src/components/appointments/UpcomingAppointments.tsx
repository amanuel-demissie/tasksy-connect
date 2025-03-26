
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppointmentCard } from "./AppointmentCard";
import { Appointment } from "@/types/appointment";
import { EmptyStateMessage } from "./EmptyStateMessage";

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
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-xl">Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {appointments.length === 0 ? (
          <EmptyStateMessage type="all" />
        ) : (
          <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
            {sortedDates.map((date) => (
              <div 
                key={date} 
                ref={(el) => (appointmentRefs.current[date] = el)}
                className="space-y-2"
              >
                <div className="sticky top-0 bg-[#1A1F2C] z-10 py-2 backdrop-blur-sm">
                  <h3 className="text-[#C8C8C9] font-medium flex items-center">
                    <span className="inline-block w-2 h-2 bg-accent rounded-full mr-2"></span>
                    {date}
                  </h3>
                </div>
                <div className="space-y-3 pl-4 border-l border-[#403E43]">
                  {groupedAppointments[date].map((appointment, index) => (
                    <AppointmentCard 
                      key={`${appointment.id}-${index}`} 
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
