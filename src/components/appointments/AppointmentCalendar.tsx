
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AppointmentCalendarProps {
  appointmentDates: Date[];
  onDateSelect: (date: Date | undefined) => void;
}

export const AppointmentCalendar = ({ appointmentDates, onDateSelect }: AppointmentCalendarProps) => {
  const hasAppointments = (date: Date) => {
    return appointmentDates.some(appointmentDate => 
      appointmentDate.getDate() === date.getDate() &&
      appointmentDate.getMonth() === date.getMonth() &&
      appointmentDate.getFullYear() === date.getFullYear()
    );
  };

  return (
    <Calendar
      className="w-full rounded-2xl border-0 bg-[#1A1F2C] text-white p-6"
      mode="single"
      selected={undefined}
      onSelect={onDateSelect}
      modifiers={{
        booked: appointmentDates,
      }}
      modifiersStyles={{
        booked: {
          backgroundColor: "rgba(137, 137, 222, 0.15)", // Very transparent accent color
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
