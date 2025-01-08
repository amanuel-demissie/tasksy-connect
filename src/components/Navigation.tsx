import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Search, Calendar, User, MessageSquare } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  
  // Hide navigation on auth page
  if (location.pathname === '/auth') {
    return null;
  }

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