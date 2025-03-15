
import React from "react";
import { Calendar, Clock } from "lucide-react";

interface EmptyStateMessageProps {
  type: "all" | "pending" | "confirmed" | "completed" | "cancelled" | "filtered";
}

export const EmptyStateMessage = ({ type }: EmptyStateMessageProps) => {
  const messages = {
    all: {
      title: "No appointments yet",
      description: "When you book services or receive bookings, they'll appear here.",
      icon: Calendar
    },
    pending: {
      title: "No pending appointments",
      description: "You don't have any appointments waiting for confirmation.",
      icon: Clock
    },
    confirmed: {
      title: "No confirmed appointments",
      description: "None of your appointments have been confirmed yet.",
      icon: Calendar
    },
    completed: {
      title: "No completed appointments",
      description: "Your completed appointments will appear here.",
      icon: Calendar
    },
    cancelled: {
      title: "No cancelled appointments",
      description: "You don't have any cancelled appointments.",
      icon: Calendar
    },
    filtered: {
      title: "No matching appointments",
      description: "Try adjusting your filters to see more appointments.",
      icon: Calendar
    }
  };

  const { title, description, icon: Icon } = messages[type];

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-[#403E43] rounded-lg bg-[#1A1F2C]/40">
      <Icon className="w-12 h-12 text-[#403E43] mb-3" />
      <h3 className="text-lg font-medium text-white mb-1">{title}</h3>
      <p className="text-[#C8C8C9] max-w-md">{description}</p>
    </div>
  );
};
