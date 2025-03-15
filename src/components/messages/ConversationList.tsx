
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-neutral-700">Recent Conversations</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {conversations.length === 0 ? (
        <Card className="bg-white/95 backdrop-blur-sm border-border">
          <CardContent className="p-6 text-center">
            <p className="text-neutral-600">You don't have any conversations yet.</p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-200px)]">
          {conversations.map((conversation) => (
            <Card
              key={conversation.id}
              className="mb-2 bg-white/95 backdrop-blur-sm hover:bg-white/90 transition-colors cursor-pointer border-border"
              onClick={() => onSelect(conversation.id)}
            >
              <CardContent className="p-4 flex items-center space-x-4">
                <Avatar>
                  <AvatarImage 
                    src={conversation.business.image_url || undefined} 
                    alt={conversation.business.name} 
                  />
                  <AvatarFallback>
                    {conversation.business.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-neutral-800">
                    {conversation.business.name}
                  </h3>
                  {conversation.lastMessage && (
                    <p className="text-sm text-neutral-600 truncate">
                      {conversation.lastMessage}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end space-y-1">
                  {conversation.lastMessageTime && (
                    <span className="text-xs text-neutral-500">
                      {conversation.lastMessageTime}
                    </span>
                  )}
                  {conversation.unreadCount > 0 && (
                    <Badge variant="secondary" className="bg-primary text-white">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      )}
    </div>
  );
};
