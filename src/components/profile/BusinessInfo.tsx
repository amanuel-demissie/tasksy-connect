import React from 'react';
import { Building2, MapPin } from 'lucide-react';

interface BusinessInfoProps {
  category: string;
  name: string;
  address: string | null;
}

export const BusinessInfo = ({ category, name, address }: BusinessInfoProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm opacity-90">
        <Building2 className="w-4 h-4" />
        <span className="capitalize">{category}</span>
      </div>
      
      <h3 className="text-2xl font-bold">{name}</h3>
      
      {address && (
        <div className="flex items-center gap-2 text-sm opacity-90">
          <MapPin className="w-4 h-4" />
          {address}
        </div>
      )}
    </div>
  );
};