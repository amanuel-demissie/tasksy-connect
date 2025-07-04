import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { RefreshCw, Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * Interface representing a conversation in the list
 * @interface Conversation
 * @property {string} id - Unique identifier for the conversation
 * @property {Object} business - Business profile information
 * @property {string} business.id - Business profile ID
 * @property {string} business.name - Business name
 * @property {string | null} business.image_url - Business profile image URL
 * @property {string | null} lastMessage - Content of the last message in the conversation
 * @property {string | null} lastMessageTime - Timestamp of the last message
 * @property {number} unreadCount - Number of unread messages in the conversation
 */
interface Conversation {
  id: string;
  business: {
    id: string;
    name: string;
    image_url: string | null;
  };
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadCount: number;
}

/**
 * Props for the ConversationList component
 * @interface ConversationListProps
 * @property {Conversation[]} conversations - Array of conversations to display
 * @property {(conversationId: string) => void} onSelect - Callback function when a conversation is selected
 * @property {() => void} onRefresh - Callback function to refresh the conversation list
 */
interface ConversationListProps {
  conversations: Conversation[];
  onSelect: (conversationId: string) => void;
  onRefresh: () => void;
}

/**
 * ConversationList component for displaying a list of user conversations
 * 
 * This component provides:
 * - Scrollable list of conversations
 * - Conversation preview with last message
 * - Unread message count indicators
 * - Message timestamps with relative formatting
 * - Manual refresh functionality
 * - Empty state handling
 * 
 * Features:
 * - Responsive design with proper spacing
 * - Hover effects for better UX
 * - Unread count badges
 * - Time formatting (Today, Yesterday, Day of week, Date)
 * - Loading states for refresh action
 * 
 * @component
 * @param {ConversationListProps} props - Component props
 * @returns {JSX.Element} The conversation list component
 */
export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  onSelect,
  onRefresh
}) => {
  /** Loading state for refresh action */
  const [refreshing, setRefreshing] = React.useState(false);
  
  /**
   * Handles the refresh action with loading state
   * 
   * This function:
   * 1. Sets refreshing state to true
   * 2. Calls the onRefresh callback
   * 3. Sets refreshing state to false when complete
   * 
   * @async
   * @function handleRefresh
   * @returns {Promise<void>}
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  /**
   * Formats message timestamps for display
   * 
   * Formatting logic:
   * - Today: Shows time only
   * - Yesterday: Shows "Yesterday"
   * - Within last week: Shows day name (Mon, Tue, etc.)
   * - Older: Shows date in DD/MM format
   * 
   * @function formatMessageTime
   * @param {string | null} timeString - ISO timestamp string or null
   * @returns {string} Formatted time string for display
   */
  const formatMessageTime = (timeString: string | null) => {
    if (!timeString) return "";
    
    const now = new Date();
    const messageDate = new Date(timeString);
    const diffInDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return timeString; // Today
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][messageDate.getDay()];
    
    return `${messageDate.getDate()}/${messageDate.getMonth() + 1}`;
  };

  return (
    <div className="space-y-4">
      {/* Header with title and refresh button */}
      <div className="flex justify-between items-center pt-2 pb-4">
        <h2 className="text-xl font-semibold text-white">Messages</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="text-neutral-400 hover:text-white"
          title="Refresh conversations"
        >
          <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      {/* Empty state when no conversations exist */}
      {conversations.length === 0 ? (
        <div className="p-6 text-center rounded-lg bg-zinc-800/80">
          <p className="text-neutral-400">You don't have any conversations yet.</p>
        </div>
      ) : (
        /* Scrollable conversation list */
        <ScrollArea className="h-[calc(100vh-240px)]">
          <div className="space-y-1 pr-2">
            {conversations.map(conversation => (
              <div 
                key={conversation.id} 
                onClick={() => onSelect(conversation.id)} 
                className="flex items-center p-3 hover:bg-zinc-800/50 rounded-lg cursor-pointer transition-colors"
              >
                {/* Business avatar with unread indicator */}
                <div className="relative mr-3">
                  <Avatar className="h-14 w-14 border border-zinc-700">
                    <AvatarImage 
                      src={conversation.business.image_url || undefined} 
                      alt={conversation.business.name} 
                    />
                    <AvatarFallback className="text-lg bg-zinc-700 text-white">
                      {conversation.business.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {/* Unread message indicator */}
                  {conversation.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                
                {/* Conversation details */}
                <div className="flex-1 min-w-0 mr-2">
                  <h3 className="font-medium text-white truncate">
                    {conversation.business.name}
                  </h3>
                  <div className="flex items-center text-neutral-400">
                    {conversation.unreadCount > 0 ? (
                      /* Show unread count when there are unread messages */
                      <p className="text-sm font-medium text-white truncate">
                        {conversation.unreadCount}+ new message{conversation.unreadCount > 1 ? 's' : ''}
                      </p>
                    ) : (
                      /* Show last message content when all messages are read */
                      <p className="text-sm truncate">
                        {conversation.lastMessage || 'No messages yet'}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Message timestamp */}
                <div className="text-xs text-neutral-500">
                  {formatMessageTime(conversation.lastMessageTime)}
                </div>
                
                {/* Action button (camera for future features) */}
                <div className="ml-3">
                  <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white rounded-full">
                    <Camera className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
