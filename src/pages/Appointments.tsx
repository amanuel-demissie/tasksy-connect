
import React, { useRef, useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { AppointmentCalendar } from "@/components/appointments/AppointmentCalendar";
import { UpcomingAppointments } from "@/components/appointments/UpcomingAppointments";
import { AppointmentCategory } from "@/components/appointments/AppointmentCategory";
import { Appointment } from "@/types/appointment";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Appointments = () => {
  const appointmentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();
  const appointmentCategories = ["Beauty", "Dining", "Professional", "Home"];

  const fetchAppointments = useCallback(async () => {
    try {
      setRefreshing(true);
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
            owner_id,
            category
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
            owner_id,
            category
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
        category: apt.business_profiles?.category || 'Other'
      }));

      setAppointments(mappedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Couldn't load appointments. Please try again."
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleRefresh = () => {
    fetchAppointments();
  };

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

  // Filter appointments by status
  const pendingAppointments = appointments.filter(apt => apt.status.toLowerCase() === 'pending');
  const confirmedAppointments = appointments.filter(apt => apt.status.toLowerCase() === 'confirmed');
  const completedAppointments = appointments.filter(apt => apt.status.toLowerCase() === 'completed');
  const cancelledAppointments = appointments.filter(apt => apt.status.toLowerCase() === 'cancelled');

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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-primary">My Appointments</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AppointmentCalendar
            appointmentDates={appointmentDates}
            onDateSelect={handleDateSelect}
          />
          <UpcomingAppointments
            appointments={appointments.filter(apt => apt.status.toLowerCase() === 'pending' || apt.status.toLowerCase() === 'confirmed')}
            appointmentRefs={appointmentRefs}
            onStatusChange={fetchAppointments}
          />
        </div>
        
        {pendingAppointments.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-primary mb-4">Pending Appointments</h2>
            <div className="grid grid-cols-1 gap-4">
              {pendingAppointments.map(appointment => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment} 
                  onStatusChange={fetchAppointments}
                />
              ))}
            </div>
          </div>
        )}
        
        {confirmedAppointments.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-primary mb-4">Confirmed Appointments</h2>
            <div className="grid grid-cols-1 gap-4">
              {confirmedAppointments.map(appointment => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment} 
                  onStatusChange={fetchAppointments}
                />
              ))}
            </div>
          </div>
        )}
        
        {completedAppointments.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-primary mb-4">Completed Appointments</h2>
            <div className="grid grid-cols-1 gap-4">
              {completedAppointments.map(appointment => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment} 
                  onStatusChange={fetchAppointments}
                />
              ))}
            </div>
          </div>
        )}
        
        {cancelledAppointments.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-primary mb-4">Cancelled Appointments</h2>
            <div className="grid grid-cols-1 gap-4">
              {cancelledAppointments.map(appointment => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment} 
                  onStatusChange={fetchAppointments}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
