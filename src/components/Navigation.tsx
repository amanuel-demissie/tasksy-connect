
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Search, Calendar, User, MessageSquare } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { UserRoleBadge } from "./profile/UserRoleBadge";

const Navigation = () => {
  const location = useLocation();
  const { session } = useAuth();
  const [activeRole, setActiveRole] = useState<string | null>(null);
  
  // Hide navigation on auth page
  if (location.pathname === '/auth') {
    return null;
  }

  useEffect(() => {
    const fetchPrimaryRole = async () => {
      if (!session?.user?.id) {
        setActiveRole('customer'); // Default role
        return;
      }
      
      try {
        // Check if user has business profiles first (prioritizing business)
        const { data: businessData } = await supabase
          .from('business_profiles')
          .select('id')
          .eq('owner_id', session.user.id);
          
        if (businessData && businessData.length > 0) {
          setActiveRole('business');
          return;
        }
        
        // If no business, check for freelancer profiles
        const { data: freelancerData } = await supabase
          .from('freelancer_profiles')
          .select('id')
          .eq('owner_id', session.user.id);
        
        if (freelancerData && freelancerData.length > 0) {
          setActiveRole('freelancer');
          return;
        }
        
        // Default to customer if no other roles
        setActiveRole('customer');
      } catch (error) {
        console.error('Error fetching user roles:', error);
        setActiveRole('customer'); // Default on error
      }
    };
    
    fetchPrimaryRole();
  }, [session]);

  const tabs = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Explore", path: "/explore" },
    { icon: Calendar, label: "Appointments", path: "/appointments" },
    { icon: MessageSquare, label: "Messages", path: "/messages" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-100">
      <nav className="w-full max-w-[428px] mx-auto border-t border-neutral-200 px-4 py-2 bg-neutral-100">
        {/* Role indicator */}
        {activeRole && (
          <div className="flex justify-center mb-1">
            <UserRoleBadge role={activeRole as any} size="sm" />
          </div>
        )}
        
        <div className="flex justify-around items-center">
          {tabs.map(({ icon: Icon, label, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex flex-col items-center p-2 ${
                  isActive ? "text-accent" : "text-neutral-600"
                }`
              }
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
