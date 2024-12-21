import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Search, Calendar, User, MessageSquare } from "lucide-react";

const Navigation = () => {
  const tabs = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Explore", path: "/explore" },
    { icon: Calendar, label: "Appointments", path: "/appointments" },
    { icon: MessageSquare, label: "Messages", path: "/messages" },
    { icon: User, label: "Profile", path: "/profile" },
    
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-neutral-200 px-4 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
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
  );
};

export default Navigation;