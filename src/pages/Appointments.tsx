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
  const categories = ["Beauty", "Professional", "Home"];

  const handleOpenChange = (appointmentId: number, isOpen: boolean) => {
    setOpenAppointments(prev => ({
      ...prev,
      [appointmentId]: isOpen
    }));
  };

  return (
    <div className="min-h-screen bg-secondary pb-20">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-primary mb-8">
          Your Appointments
        </h1>

        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category} className="space-y-4">
              <h2 className="text-lg font-semibold text-neutral-800">
                {category} Appointments
              </h2>
              <div className="grid grid-cols-1 gap-4">
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
                    isOpen={openAppointments[i] || false}
                    onOpenChange={(isOpen) => handleOpenChange(i, isOpen)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Appointments;