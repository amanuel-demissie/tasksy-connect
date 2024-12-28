import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { AppointmentCard } from "@/components/appointments/AppointmentCard";

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
  const appointmentCategories = ["Beauty", "Dining", "Professional", "Home"];

  return (
    <div className="min-h-screen bg-secondary pb-20">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-2xl font-semibold text-primary">My Appointments</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Calendar
            className="w-full rounded-lg border bg-white/80 backdrop-blur-sm p-4"
            mode="multiple"
            selected={[new Date()]}
          />
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-800">
              Upcoming Appointments
            </h2>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          </div>
        </div>

        {appointmentCategories.map((category) => (
          <div key={category} className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-800">
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