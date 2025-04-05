
import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { RefreshCw, Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

interface ConversationListProps {
  conversations: Conversation[];
  onSelect: (conversationId: string) => void;
  onRefresh: () => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  onSelect,
  onRefresh
}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

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
      <div className="flex justify-between items-center pt-2 pb-4">
        <h2 className="text-xl font-semibold text-white">Messages</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="text-neutral-400 hover:text-white"
        >
          <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      {conversations.length === 0 ? (
        <div className="p-6 text-center rounded-lg bg-zinc-800/80">
          <p className="text-neutral-400">You don't have any conversations yet.</p>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-240px)]">
          <div className="space-y-1 pr-2">
            {conversations.map(conversation => (
              <div 
                key={conversation.id} 
                onClick={() => onSelect(conversation.id)} 
                className="flex items-center p-3 hover:bg-zinc-800/50 rounded-lg cursor-pointer transition-colors"
              >
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
                  {conversation.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0 mr-2">
                  <h3 className="font-medium text-white truncate">
                    {conversation.business.name}
                  </h3>
                  <div className="flex items-center text-neutral-400">
                    {conversation.unreadCount > 0 ? (
                      <p className="text-sm font-medium text-white truncate">
                        {conversation.unreadCount}+ new message{conversation.unreadCount > 1 ? 's' : ''}
                      </p>
                    ) : (
                      <p className="text-sm truncate">
                        {conversation.lastMessage || 'No messages yet'}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="text-xs text-neutral-500">
                  {formatMessageTime(conversation.lastMessageTime)}
                </div>
                
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
