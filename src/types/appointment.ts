
export interface Appointment {
  id: string;
  business_id: string;
  service_id: string;
  customer_id: string;
  date: string;
  time: string;
  status: string;
  // Additional fields from joins
  serviceName?: string;
  providerName?: string;
  businessName?: string;
  businessLogo?: string;
}
