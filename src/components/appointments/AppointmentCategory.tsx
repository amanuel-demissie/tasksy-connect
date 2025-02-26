
import React from "react";
import { AppointmentCard } from "./AppointmentCard";
import { Appointment } from "@/types/appointment";

interface AppointmentCategoryProps {
  category: string;
  appointments: Appointment[];
}

export const AppointmentCategory = ({ category, appointments }: AppointmentCategoryProps) => {
  // Filter appointments for this category if needed
  const categoryAppointments = appointments || [];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">
        {category} Appointments
      </h2>
      <div className="relative">
        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-4 min-w-max">
            {categoryAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
              />
            ))}
            {categoryAppointments.length === 0 && (
              <p className="text-muted-foreground py-4">
                No {category.toLowerCase()} appointments found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
