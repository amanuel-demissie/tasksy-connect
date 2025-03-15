
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Appointment } from "@/types/appointment";

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onDateSelect: (date: Date | undefined) => void;
}

export const AppointmentCalendar = ({ appointments, onDateSelect }: AppointmentCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  const appointmentsByDate = appointments.reduce((acc, appointment) => {
    const dateKey = appointment.date;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(appointment);
    return acc;
  }, {} as Record<string, Appointment[]>);
  
  const appointmentDates = Object.keys(appointmentsByDate).map(dateStr => 
    new Date(dateStr + ", 2024")
  );

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  // Custom day rendering with appointment information
  const renderDay = (day: Date) => {
    const dateKey = format(day, "MMMM d");
    const dayAppointments = appointmentsByDate[dateKey] || [];
    const hasAppointments = dayAppointments.length > 0;
    
    if (!hasAppointments) return null;
    
    const statuses = dayAppointments.map(apt => apt.status.toLowerCase());
    const hasPending = statuses.includes('pending');
    const hasConfirmed = statuses.includes('confirmed');
    const hasCancelled = statuses.includes('cancelled');
    const hasCompleted = statuses.includes('completed');
    
    // Determine priority color
    let statusColor = "";
    if (hasPending) statusColor = "bg-amber-500";
    else if (hasConfirmed) statusColor = "bg-green-500";
    else if (hasCompleted) statusColor = "bg-blue-500";
    else if (hasCancelled) statusColor = "bg-red-500";
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative w-full h-full flex items-center justify-center">
              <div 
                className={cn(
                  "absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full",
                  statusColor
                )}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-[#2A2F3C] border-[#403E43] text-white p-2">
            <div className="text-xs">
              <p className="font-medium mb-1">{dayAppointments.length} appointment{dayAppointments.length > 1 ? 's' : ''}</p>
              <ul className="space-y-1">
                {dayAppointments.slice(0, 3).map((apt, i) => (
                  <li key={i} className="flex items-center gap-1">
                    <span 
                      className={cn(
                        "w-2 h-2 rounded-full",
                        apt.status.toLowerCase() === 'pending' && "bg-amber-500",
                        apt.status.toLowerCase() === 'confirmed' && "bg-green-500",
                        apt.status.toLowerCase() === 'completed' && "bg-blue-500",
                        apt.status.toLowerCase() === 'cancelled' && "bg-red-500"
                      )}
                    />
                    <span>{apt.serviceName} ({apt.time})</span>
                  </li>
                ))}
                {dayAppointments.length > 3 && (
                  <li className="text-[#C8C8C9] text-center">+{dayAppointments.length - 3} more</li>
                )}
              </ul>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <Calendar
      className="w-full rounded-2xl border-0 bg-[#1A1F2C] text-white p-6"
      mode="single"
      selected={selectedDate}
      onSelect={handleDateSelect}
      modifiers={{
        booked: appointmentDates,
      }}
      modifiersStyles={{
        booked: {
          backgroundColor: "rgba(137, 137, 222, 0.15)", // Very transparent accent color
          fontWeight: "bold"
        }
      }}
      components={{
        DayContent: ({ date }) => {
          const formattedDate = format(date, "MMMM d");
          const dayAppointments = appointmentsByDate[formattedDate];
          
          return (
            <div className="relative w-full h-full flex items-center justify-center">
              <div>{date.getDate()}</div>
              {dayAppointments && renderDay(date)}
            </div>
          );
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
        head_cell: "text-[#C8C8C9] rounded-md w-9 font-normal text-[0.8rem] uppercase",
        row: "flex w-full mt-2",
        cell: "relative h-9 w-9 text-center text-sm p-0 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: "h-9 w-9 p-0 font-normal text-white aria-selected:opacity-100 hover:bg-[#403E43]/50 rounded-full transition-colors",
        day_range_end: "day-range-end",
        day_selected: "bg-accent text-white hover:bg-accent hover:text-white focus:bg-accent focus:text-white",
        day_today: "text-accent relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-accent",
        day_outside: "text-[#403E43] opacity-50",
        day_disabled: "text-[#403E43] opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-white",
        day_hidden: "invisible",
      }}
    />
  );
};
