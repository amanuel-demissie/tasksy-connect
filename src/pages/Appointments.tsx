
import React, { useRef, useEffect, useState, useCallback } from "react";
import { format, isBefore, isAfter, parseISO, startOfDay } from "date-fns";
import { AppointmentCalendar } from "@/components/appointments/AppointmentCalendar";
import { UpcomingAppointments } from "@/components/appointments/UpcomingAppointments";
import { AppointmentCard } from "@/components/appointments/AppointmentCard";
import { AppointmentFilters } from "@/components/appointments/AppointmentFilters";
import { EmptyStateMessage } from "@/components/appointments/EmptyStateMessage";
import { Appointment } from "@/types/appointment";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserRoleBadge } from "@/components/profile/UserRoleBadge";

const Appointments = () => {
  const appointmentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const { toast } = useToast();

  const fetchAppointments = useCallback(async () => {
    try {
      setRefreshing(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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

      const allAppointments = [...(customerAppointments || []), ...(ownerAppointments || [])];
      
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
        businessLogo: apt.business_profiles?.image_url || '/placeholder.svg',
        providerName: apt.business_profiles?.name || 'Unknown Provider',
        category: apt.business_profiles?.category || 'Other'
      }));

      setAppointments(mappedAppointments);
      
      // Show success notification on refresh
      if (refreshing) {
        toast({
          title: "Updated",
          description: "Appointments refreshed successfully",
        });
      }
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
  }, [toast, refreshing]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const formattedDate = format(date, "MMMM d");
    const ref = appointmentRefs.current[formattedDate];
    
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleResetFilters = () => {
    setStatusFilter("all");
    setCategoryFilter("all");
    setDateRange({ from: undefined, to: undefined });
  };

  // Apply filters to appointments
  const filteredAppointments = appointments.filter(appointment => {
    // Status filter
    if (statusFilter !== "all" && appointment.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    
    // Category filter
    if (categoryFilter !== "all" && appointment.category !== categoryFilter) {
      return false;
    }
    
    // Date range filter
    if (dateRange.from || dateRange.to) {
      const appointmentDate = new Date(appointment.date + ", 2024");
      
      if (dateRange.from && isBefore(appointmentDate, startOfDay(dateRange.from))) {
        return false;
      }
      
      if (dateRange.to && isAfter(appointmentDate, startOfDay(dateRange.to))) {
        return false;
      }
    }
    
    return true;
  });

  // Split appointments by status
  const pendingAppointments = filteredAppointments.filter(apt => apt.status.toLowerCase() === 'pending');
  const confirmedAppointments = filteredAppointments.filter(apt => apt.status.toLowerCase() === 'confirmed');
  const completedAppointments = filteredAppointments.filter(apt => apt.status.toLowerCase() === 'completed');
  const cancelledAppointments = filteredAppointments.filter(apt => apt.status.toLowerCase() === 'cancelled');
  
  // Upcoming appointments (pending + confirmed)
  const upcomingAppointments = filteredAppointments.filter(
    apt => apt.status.toLowerCase() === 'pending' || apt.status.toLowerCase() === 'confirmed'
  );

  // Check if filters are applied
  const filtersApplied = statusFilter !== "all" || categoryFilter !== "all" || dateRange.from || dateRange.to;

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary pb-20">
      <div className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-primary">My Appointments</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your service bookings in one place
            </p>
          </div>
          <div className="flex gap-2">
            <UserRoleBadge role="customer" />
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
        </div>
        
        <AppointmentFilters 
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onResetFilters={handleResetFilters}
        />
        
        {filteredAppointments.length === 0 && filtersApplied ? (
          <EmptyStateMessage type="filtered" />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AppointmentCalendar
              appointments={appointments}
              onDateSelect={handleDateSelect}
            />
            <UpcomingAppointments
              appointments={upcomingAppointments}
              appointmentRefs={appointmentRefs}
              onStatusChange={fetchAppointments}
            />
          </div>
        )}
        
        {pendingAppointments.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-semibold text-primary">Pending Appointments</h2>
              <span className="bg-amber-500/20 text-amber-500 text-xs px-2 py-0.5 rounded-full">
                {pendingAppointments.length}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-semibold text-primary">Confirmed Appointments</h2>
              <span className="bg-green-500/20 text-green-500 text-xs px-2 py-0.5 rounded-full">
                {confirmedAppointments.length}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-semibold text-primary">Completed Appointments</h2>
              <span className="bg-blue-500/20 text-blue-500 text-xs px-2 py-0.5 rounded-full">
                {completedAppointments.length}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-semibold text-primary">Cancelled Appointments</h2>
              <span className="bg-red-500/20 text-red-500 text-xs px-2 py-0.5 rounded-full">
                {cancelledAppointments.length}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {appointments.length === 0 && !filtersApplied && (
          <EmptyStateMessage type="all" />
        )}
      </div>
    </div>
  );
};

export default Appointments;
