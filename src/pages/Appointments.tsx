import React, { useRef, useEffect, useState, useCallback } from "react";
import { format, isBefore, isAfter, parseISO, startOfDay, compareAsc } from "date-fns";
import { UpcomingAppointments } from "@/components/appointments/UpcomingAppointments";
import { AppointmentCard } from "@/components/appointments/AppointmentCard";
import { AppointmentFilters } from "@/components/appointments/AppointmentFilters";
import { EmptyStateMessage } from "@/components/appointments/EmptyStateMessage";
import { Appointment } from "@/types/appointment";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, RefreshCw, Store, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserRoleBadge } from "@/components/profile/UserRoleBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Appointments = () => {
  const appointmentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<'customer' | 'business'>('customer');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const { toast } = useToast();

  const deletePastAppointments = useCallback(async (appointmentsData: any[]) => {
    const today = startOfDay(new Date());
    const pastAppointments = appointmentsData.filter(apt => {
      const appointmentDate = parseISO(apt.date);
      return compareAsc(appointmentDate, today) < 0;
    });
    
    if (pastAppointments.length === 0) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const deletedIds: string[] = [];
      
      for (const apt of pastAppointments) {
        const canDelete = apt.customer_id === user.id || 
                          apt.business_profiles?.owner_id === user.id;
        
        if (canDelete) {
          const { error } = await supabase
            .from('appointments')
            .delete()
            .eq('id', apt.id);
            
          if (!error) {
            deletedIds.push(apt.id);
          } else {
            console.error('Error deleting appointment:', error);
          }
        }
      }
      
      if (deletedIds.length > 0) {
        toast({
          title: "Cleanup Complete",
          description: `${deletedIds.length} past appointment(s) have been removed`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error in cleanup process:', error);
    }
  }, [toast]);

  const fetchAppointments = useCallback(async () => {
    try {
      if (!refreshing && !loading) return;
      
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

      const { data: userBusinesses, error: businessError } = await supabase
        .from('business_profiles')
        .select('id')
        .eq('owner_id', user.id);
        
      if (businessError) {
        console.error('Supabase business profiles query error:', businessError);
        throw businessError;
      }
      
      let ownerAppointments: any[] = [];
      
      if (userBusinesses && userBusinesses.length > 0) {
        const businessIds = userBusinesses.map(business => business.id);
        
        const { data: businessAppointments, error: ownerError } = await supabase
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
          .in('business_id', businessIds)
          .order('date', { ascending: true });
          
        if (ownerError) {
          console.error('Supabase owner query error:', ownerError);
          throw ownerError;
        }
        
        ownerAppointments = businessAppointments || [];
      }

      const mappedCustomerAppointments: Appointment[] = (customerAppointments || []).map(apt => ({
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
        category: apt.business_profiles?.category || 'Other',
        rawDate: apt.date,
        viewerRole: 'customer'
      }));
      
      const mappedOwnerAppointments: Appointment[] = ownerAppointments.map(apt => ({
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
        category: apt.business_profiles?.category || 'Other',
        rawDate: apt.date,
        viewerRole: 'business'
      }));

      const allAppointmentsForDeletion = [...(customerAppointments || []), ...ownerAppointments];
      await deletePastAppointments(allAppointmentsForDeletion);
      
      const remainingCustomerAppointments = mappedCustomerAppointments.filter(apt => 
        !apt.rawDate || compareAsc(parseISO(apt.rawDate), startOfDay(new Date())) >= 0
      );
      
      const remainingOwnerAppointments = mappedOwnerAppointments.filter(apt => 
        !apt.rawDate || compareAsc(parseISO(apt.rawDate), startOfDay(new Date())) >= 0
      );
      
      setAppointments(viewMode === 'customer' ? remainingCustomerAppointments : remainingOwnerAppointments);
      
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
  }, [toast, refreshing, loading, deletePastAppointments, viewMode]);

  useEffect(() => {
    if (loading || refreshing) {
      fetchAppointments();
    }
  }, [fetchAppointments, loading, refreshing]);
  
  useEffect(() => {
    setRefreshing(true);
  }, [viewMode]);

  const handleRefresh = () => {
    setRefreshing(true);
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

  const filteredAppointments = appointments.filter(appointment => {
    if (statusFilter !== "all" && appointment.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    
    if (categoryFilter !== "all" && appointment.category !== categoryFilter) {
      return false;
    }
    
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

  const pendingAppointments = filteredAppointments.filter(apt => apt.status.toLowerCase() === 'pending');
  const confirmedAppointments = filteredAppointments.filter(apt => apt.status.toLowerCase() === 'confirmed');
  const completedAppointments = filteredAppointments.filter(apt => apt.status.toLowerCase() === 'completed');
  const cancelledAppointments = filteredAppointments.filter(apt => apt.status.toLowerCase() === 'cancelled');
  
  const upcomingAppointments = filteredAppointments.filter(
    apt => apt.status.toLowerCase() === 'pending' || apt.status.toLowerCase() === 'confirmed'
  );

  const filtersApplied = statusFilter !== "all" || categoryFilter !== "all" || dateRange.from || dateRange.to;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className={`h-8 w-8 animate-spin ${viewMode === 'customer' ? 'text-blue-600' : 'text-emerald-600'}`} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className={`w-full border-b ${viewMode === 'customer' ? 'border-blue-200 bg-blue-50' : 'border-emerald-200 bg-emerald-50'}`}>
        <div className="container max-w-5xl mx-auto px-4 py-3">
          <div className={`flex items-center gap-2 font-medium ${viewMode === 'customer' ? 'text-blue-700' : 'text-emerald-700'}`}>
            {viewMode === 'customer' ? (
              <>
                <User className="h-4 w-4" />
                <span className="text-sm">Customer Mode</span>
              </>
            ) : (
              <>
                <Store className="h-4 w-4" />
                <span className="text-sm">Business Mode</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className={`text-2xl font-semibold ${viewMode === 'customer' ? 'text-blue-700' : 'text-emerald-700'}`}>
              {viewMode === 'customer' ? 'My Bookings' : 'Business Appointments'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {viewMode === 'customer' 
                ? 'Manage your service bookings in one place' 
                : 'View and manage appointments for your business'}
            </p>
          </div>
          <div className="flex gap-2">
            <UserRoleBadge role={viewMode} />
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
        
        <Tabs 
          defaultValue="customer" 
          value={viewMode} 
          onValueChange={(value) => setViewMode(value as 'customer' | 'business')}
        >
          <TabsList className="mb-4">
            <TabsTrigger 
              value="customer" 
              className={`flex items-center gap-1 ${viewMode === 'customer' ? 'data-[state=active]:border-b-2 data-[state=active]:border-blue-500' : ''}`}
            >
              <User className={`h-4 w-4 ${viewMode === 'customer' ? 'text-blue-600' : ''}`} />
              Customer View
            </TabsTrigger>
            <TabsTrigger 
              value="business" 
              className={`flex items-center gap-1 ${viewMode === 'business' ? 'data-[state=active]:border-b-2 data-[state=active]:border-emerald-500' : ''}`}
            >
              <Store className={`h-4 w-4 ${viewMode === 'business' ? 'text-emerald-600' : ''}`} />
              Business Owner View
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="p-5 border rounded-lg bg-card">
          <AppointmentFilters 
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            dateRange={dateRange}
            setDateRange={setDateRange}
            onResetFilters={handleResetFilters}
          />
        </div>
        
        {filteredAppointments.length === 0 && filtersApplied ? (
          <EmptyStateMessage type="filtered" />
        ) : (
          <div className="grid grid-cols-1 gap-8">
            <div className={`border rounded-lg p-5 bg-card ${viewMode === 'customer' ? 'border-blue-200' : 'border-emerald-200'}`}>
              <UpcomingAppointments
                appointments={upcomingAppointments}
                appointmentRefs={appointmentRefs}
                onStatusChange={() => setRefreshing(true)}
              />
            </div>
          </div>
        )}
        
        {pendingAppointments.length > 0 && (
          <div className="mt-8 p-6 border rounded-lg bg-card">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-1 h-6 rounded-full bg-amber-500 ${viewMode === 'customer' ? 'border-l-4 border-blue-200' : 'border-l-4 border-emerald-200'}`}></div>
              <h2 className="text-xl font-semibold">Pending Appointments</h2>
              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-medium">
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
          <div className="mt-8 p-6 border rounded-lg bg-card">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-1 h-6 rounded-full bg-green-500 ${viewMode === 'customer' ? 'border-l-4 border-blue-200' : 'border-l-4 border-emerald-200'}`}></div>
              <h2 className="text-xl font-semibold">Confirmed Appointments</h2>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">
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
          <div className="mt-8 p-6 border rounded-lg bg-card">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-1 h-6 rounded-full bg-blue-500 ${viewMode === 'customer' ? 'border-l-4 border-blue-200' : 'border-l-4 border-emerald-200'}`}></div>
              <h2 className="text-xl font-semibold">Completed Appointments</h2>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">
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
          <div className="mt-8 p-6 border rounded-lg bg-card">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-1 h-6 rounded-full bg-red-500 ${viewMode === 'customer' ? 'border-l-4 border-blue-200' : 'border-l-4 border-emerald-200'}`}></div>
              <h2 className="text-xl font-semibold">Cancelled Appointments</h2>
              <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-medium">
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
          <div className="p-6 border rounded-lg bg-card">
            <EmptyStateMessage type="all" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
