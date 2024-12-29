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
      <Calendar 
        className="w-full rounded-2xl border-0 bg-[#1A1F2C] text-white p-6" 
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-2xl font-light tracking-wide",
          nav: "space-x-1 flex items-center",
          nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-neutral-400 rounded-md w-9 font-normal text-[0.8rem] uppercase",
          row: "flex w-full mt-2",
          cell: "relative h-9 w-9 text-center text-sm p-0 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: "h-9 w-9 p-0 font-normal text-white aria-selected:opacity-100 hover:bg-neutral-800/50 rounded-full transition-colors",
          day_range_end: "day-range-end",
          day_selected: "bg-accent text-white hover:bg-accent hover:text-white focus:bg-accent focus:text-white",
          day_today: "text-accent relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-accent",
          day_outside: "text-neutral-600 opacity-50",
          day_disabled: "text-neutral-600 opacity-50",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-white",
          day_hidden: "invisible",
        }}
      />
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-4">
          {appointments.map((appointment) => (
            <Card 
              key={appointment.id} 
              className="flex-shrink-0 w-80 bg-[#1A1F2C] backdrop-blur-sm border-neutral-700"
            >
              <CardContent className="p-4 space-y-0">
                <div className="space-y-0">
                  <Badge 
                    variant="secondary" 
                    className="bg-neutral-100 text-neutral-600 rounded-full"
                  >
                    {appointment.status}
                  </Badge>
                  
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-neutral-900">
                      {appointment.serviceName}
                    </h3>
                    <p className="text-sm text-neutral-600">
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
                    <div className="space-y-0">
                      <div className="text-xl font-bold">
                        {appointment.date.split(" ")[1]}
                      </div>
                      <div className="text-sm text-neutral-600">
                        {appointment.date.split(" ")[0]}
                      </div>
                      <div className="text-sm text-neutral-600">
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