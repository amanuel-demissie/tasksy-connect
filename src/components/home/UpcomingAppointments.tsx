import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock data for appointments
const appointments = [
  {
    id: 1,
    status: "Finished",
    serviceName: "Haircut",
    providerName: 'Juan "Jago" Gomez',
    businessName: "Ace Of Fadez Barber Lounge",
    businessLogo: "/placeholder.svg",
    date: "October 28",
    time: "11:00 AM"
  },
  {
    id: 2,
    status: "Upcoming",
    serviceName: "Beard Trim",
    providerName: "Mike Johnson",
    businessName: "Classic Cuts",
    businessLogo: "/placeholder.svg",
    date: "November 2",
    time: "2:00 PM"
  },
  {
    id: 3,
    status: "Pending",
    serviceName: "Hair Coloring",
    providerName: "Sarah Smith",
    businessName: "Style Studio",
    businessLogo: "/placeholder.svg",
    date: "November 5",
    time: "3:30 PM"
  }
];

const UpcomingAppointments = () => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold text-neutral-800">
      Upcoming Appointments
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Calendar className="w-full rounded-lg border bg-white/80 backdrop-blur-sm" />
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-4">
          {appointments.map((appointment) => (
            <Card 
              key={appointment.id} 
              className="flex-shrink-0 w-80 bg-white/80 backdrop-blur-sm border-neutral-200"
            >
              <CardContent className="p-6 space-y-4">
                <div className="space-y-4">
                  <Badge 
                    variant="secondary" 
                    className="bg-neutral-100 text-neutral-600 rounded-full"
                  >
                    {appointment.status}
                  </Badge>
                  
                  <div className="space-y-1">
                    <h3 className="text-2xl font-semibold text-neutral-900">
                      {appointment.serviceName}
                    </h3>
                    <p className="text-neutral-600">
                      with {appointment.providerName}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <img 
                      src={appointment.businessLogo} 
                      alt={appointment.businessName}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-neutral-900 font-medium">
                      {appointment.businessName}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold">
                        {appointment.date.split(" ")[1]}
                      </div>
                      <div className="text-neutral-600">
                        {appointment.date.split(" ")[0]}
                      </div>
                      <div className="text-neutral-600">
                        {appointment.time}
                      </div>
                    </div>
                    {appointment.status === "Finished" && (
                      <Button 
                        variant="secondary"
                        className="bg-accent text-white hover:bg-accent/90"
                      >
                        Book again
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default UpcomingAppointments;