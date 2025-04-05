
import React from "react";

interface MessageBubbleProps {
  message: string;
  isCurrentUser: boolean;
  timestamp: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isCurrentUser,
  timestamp
}) => {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div 
        className={`rounded-2xl px-4 py-2 max-w-[80%] ${
          isCurrentUser 
            ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white' 
            : 'bg-zinc-800 text-white'
        }`}
      >
        <p className="break-words">{message}</p>
        <span className={`text-xs block text-right mt-1 opacity-70`}>
          {timestamp}
        </span>
      </div>
    </div>
  );
};
