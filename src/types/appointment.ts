
export interface Appointment {
  id: string;
  business_id: string;
  service_id: string;
  customer_id: string;
  date: string; // Format: "MMMM d"
  time: string;
  status: string;
  serviceName: string;
  providerName: string;
  businessName: string;
  businessLogo: string;
  category: string;
  rawDate?: string; // The original date string from the database
}
