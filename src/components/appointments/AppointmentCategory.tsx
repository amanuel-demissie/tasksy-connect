import React from "react";
import { AppointmentCard } from "./AppointmentCard";
import { Appointment } from "@/types/appointment";

interface AppointmentCategoryProps {
  category: string;
}

export const AppointmentCategory = ({ category }: AppointmentCategoryProps) => {
  const mockAppointments: Appointment[] = [1, 2, 3].map((i) => ({
    id: i,
    status: "Upcoming",
    serviceName: `${category} Service ${i}`,
    providerName: "Provider Name",
    businessName: "Business Name",
    businessLogo: "placeholder.svg",
    date: "November 15",
    time: "2:00 PM"
  }));

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">
        {category} Appointments
      </h2>
      <div className="relative">
        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-4 min-w-max">
            {mockAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};