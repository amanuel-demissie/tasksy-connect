import React from "react";

/**
 * Props for the MessageBubble component
 * @interface MessageBubbleProps
 * @property {string} message - The text content of the message
 * @property {boolean} isCurrentUser - Whether the current user sent this message
 * @property {string} timestamp - Formatted timestamp string for display
 */
interface MessageBubbleProps {
  message: string;
  isCurrentUser: boolean;
  timestamp: string;
}

/**
 * MessageBubble component for displaying individual messages in conversations
 * 
 * This component provides:
 * - Different styling for sent vs received messages
 * - Message content with word wrapping
 * - Timestamp display
 * - Responsive design with max-width constraints
 * 
 * Styling:
 * - Current user messages: Right-aligned with gradient background (pink to rose)
 * - Other user messages: Left-aligned with dark background (zinc-800)
 * - Timestamps: Small, right-aligned, semi-transparent
 * - Max width: 80% of container to prevent overly wide messages
 * 
 * Features:
 * - Automatic word breaking for long messages
 * - Rounded corners for modern chat appearance
 * - Proper spacing and alignment
 * - Responsive design that works on mobile and desktop
 * 
 * @component
 * @param {MessageBubbleProps} props - Component props
 * @returns {JSX.Element} The message bubble component
 */
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
        {/* Message content with word wrapping */}
        <p className="break-words">{message}</p>
        {/* Timestamp display */}
        <span className={`text-xs block text-right mt-1 opacity-70`}>
          {timestamp}
        </span>
      </div>
    </div>
  );
};
