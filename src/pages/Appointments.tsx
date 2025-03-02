
import React, { useRef, useEffect, useState } from "react";
import { format } from "date-fns";
import { AppointmentCalendar } from "@/components/appointments/AppointmentCalendar";
import { UpcomingAppointments } from "@/components/appointments/UpcomingAppointments";
import { AppointmentCategory } from "@/components/appointments/AppointmentCategory";
import { Appointment } from "@/types/appointment";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Appointments = () => {
  const appointmentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const appointmentCategories = ["Beauty", "Dining", "Professional", "Home"];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // First query for appointments where user is the customer
        const { data: customerAppointments, error: customerError } = await supabase
          .from('appointments')
          .select(`
            *,
            business_profiles:business_id (
              name,
              image_url,
              owner_id
            ),
            business_services:service_id (
              name
            )
          `)
          .eq('customer_id', user.id)
          .order('date', { ascending: true });

        if (customerError) {
          console.error('Supabase customer query error:', customerError);
          throw customerError;
        }

        // Second query for appointments where user is the business owner
        const { data: ownerAppointments, error: ownerError } = await supabase
          .from('appointments')
          .select(`
            *,
            business_profiles:business_id (
              name,
              image_url,
              owner_id
            ),
            business_services:service_id (
              name
            )
          `)
          .eq('business_profiles.owner_id', user.id)
          .order('date', { ascending: true });

        if (ownerError) {
          console.error('Supabase owner query error:', ownerError);
          throw ownerError;
        }

        // Combine the results
        const allAppointments = [...(customerAppointments || []), ...(ownerAppointments || [])];
        
        // Map the data to match our Appointment interface
        const mappedAppointments: Appointment[] = allAppointments.map(apt => ({
          id: apt.id,
          business_id: apt.business_id,
          service_id: apt.service_id,
          customer_id: apt.customer_id,
          date: format(new Date(apt.date), "MMMM d"),
          time: apt.time,
          status: apt.status,
          serviceName: apt.business_services?.name || 'Unknown Service',
          businessName: apt.business_profiles?.name || 'Unknown Business',
          businessLogo: apt.business_profiles?.image_url || 'placeholder.svg',
          providerName: apt.business_profiles?.name || 'Unknown Provider',
        }));

        setAppointments(mappedAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const appointmentDates = appointments.map(appointment => 
    new Date(appointment.date + ", 2024")
  );

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const formattedDate = format(date, "MMMM d");
    const ref = appointmentRefs.current[formattedDate];
    
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary pb-20">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-2xl font-semibold text-primary">My Appointments</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AppointmentCalendar
            appointmentDates={appointmentDates}
            onDateSelect={handleDateSelect}
          />
          <UpcomingAppointments
            appointments={appointments.filter(apt => apt.status === 'pending' || apt.status === 'confirmed')}
            appointmentRefs={appointmentRefs}
          />
        </div>
      </div>
    </div>
  );
};

export default Appointments;
