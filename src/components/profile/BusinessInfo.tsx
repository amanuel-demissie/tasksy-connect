import React from 'react';
import { Building2, MapPin } from 'lucide-react';

/**
 * Props for the BusinessInfo component
 * @interface BusinessInfoProps
 */
interface BusinessInfoProps {
  /** The business category */
  category: string;
  /** The business name */
  name: string;
  /** The business address (optional) */
  address: string | null;
}

/**
 * BusinessInfo Component
 * 
 * Displays basic business information including category, name, and address.
 * Uses icons from lucide-react for visual enhancement.
 * 
 * @component
 * @example
 * ```tsx
 * <BusinessInfo
 *   category="retail"
 *   name="My Business"
 *   address="123 Main St"
 * />
 * ```
 */
export const BusinessInfo = ({
  category,
  name,
  address
}: BusinessInfoProps) => {
  return <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm opacity-90">
        <Building2 className="w-4 h-4" />
        <span className="capitalize">{category}</span>
      </div>
      
      <h3 className="text-2xl font-bold text-slate-800">{name}</h3>
      
      {address && <div className="flex items-center gap-2 text-sm opacity-90">
          <MapPin className="w-4 h-4" />
          {address}
        </div>}
    </div>;
};