
export interface Appointment {
  id: string;
  business_id: string;
  service_id: string;
  customer_id: string;
  employee_id?: string;
  date: string; // Format: "MMMM d"
  time: string;
  status: string;
  serviceName: string;
  providerName: string;
  businessName: string;
  businessLogo: string;
  category: string;
  rawDate?: string; // The original date string from the database
  viewerRole?: 'customer' | 'business'; // Changed 'owner' to 'business' to match UserRole type
}
