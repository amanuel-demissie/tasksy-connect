import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

interface AppointmentCardProps {
  appointment: Appointment;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const AppointmentCard = ({ appointment, isOpen, onOpenChange }: AppointmentCardProps) => {
  return (
    <Card className="min-w-[300px] md:min-w-[400px]">
      <div className="w-full" onClick={() => onOpenChange(!isOpen)}>
        <div className="p-4 flex items-center space-x-4">
          <img
            src={appointment.businessLogo}
            alt={appointment.businessName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1 text-left">
            <h3 className="font-medium">{appointment.providerName}</h3>
            <p className="text-sm text-neutral-500">{appointment.date}</p>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="px-4 pb-4 space-y-2 border-t">
          <div className="pt-2">
            <p className="text-sm text-neutral-600">
              <span className="font-medium">Service:</span>{" "}
              {appointment.serviceName}
            </p>
            <p className="text-sm text-neutral-600">
              <span className="font-medium">Business:</span>{" "}
              {appointment.businessName}
            </p>
            <p className="text-sm text-neutral-600">
              <span className="font-medium">Time:</span> {appointment.time}
            </p>
            <p className="text-sm text-neutral-600">
              <span className="font-medium">Status:</span>{" "}
              <span
                className={cn(
                  "inline-block px-2 py-0.5 rounded text-xs",
                  appointment.status === "Upcoming"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                )}
              >
                {appointment.status}
              </span>
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};