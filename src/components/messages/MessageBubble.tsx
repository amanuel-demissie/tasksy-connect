
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
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
        isCurrentUser 
          ? 'bg-primary text-white' 
          : 'bg-secondary text-foreground'
      }`}>
        <p className="break-words">{message}</p>
        <span className={`text-xs block text-right mt-1 
            ${isCurrentUser ? 'text-white/70' : 'text-neutral-400'}
          `}>
          {timestamp}
        </span>
      </div>
    </div>
  );
};
