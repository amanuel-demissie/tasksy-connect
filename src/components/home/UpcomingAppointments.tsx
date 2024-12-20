import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";

const UpcomingAppointments = () => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold text-neutral-800">
      Upcoming Appointments
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Calendar className="w-full rounded-lg border bg-white/80 backdrop-blur-sm" />
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="flex-shrink-0 w-72 bg-white/80 backdrop-blur-sm border-neutral-200">
              <CardContent className="p-4">
                <h3 className="font-medium text-neutral-800">
                  Appointment {i}
                </h3>
                <p className="text-sm text-neutral-600">Tomorrow at 2:00 PM</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default UpcomingAppointments;