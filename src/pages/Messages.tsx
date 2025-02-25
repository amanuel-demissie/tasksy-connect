
/**
 * Messages Page Component
 * 
 * Displays user's conversations and messages.
 * Shows recent conversations with businesses and service providers.
 * 
 * @component
 * @example
 * ```tsx
 * <Messages />
 * ```
 */
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * Interface for conversation data
 * @interface Conversation
 */
interface Conversation {
  /** Unique identifier for the conversation */
  id: number;
  /** Name of the business or service provider */
  name: string;
  /** Most recent message in the conversation */
  lastMessage: string;
  /** Time elapsed since the last message */
  time: string;
  /** Avatar text (fallback for when image is not available) */
  avatar: string;
}

const Messages = () => {
  const conversations: Conversation[] = [
    {
      id: 1,
      name: "Hair Salon",
      lastMessage: "Your appointment is confirmed for tomorrow at 2 PM",
      time: "2m ago",
      avatar: "HS",
    },
    {
      id: 2,
      name: "Restaurant ABC",
      lastMessage: "Your table is ready!",
      time: "1h ago",
      avatar: "RA",
    },
  ];

  return (
    <div className="min-h-screen bg-secondary pb-20">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-4">
        <h1 className="text-2xl font-semibold text-primary">Messages</h1>
        
        <ScrollArea className="h-[calc(100vh-200px)]">
          {conversations.map((conversation) => (
            <Card
              key={conversation.id}
              className="mb-2 bg-[#1A1F2C] backdrop-blur-sm hover:bg-white/90 transition-colors cursor-pointer"
            >
              <CardContent className="p-4 flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={`https://avatar.vercel.sh/${conversation.id}.png`} />
                  <AvatarFallback>{conversation.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-neutral-800">
                    {conversation.name}
                  </h3>
                  <p className="text-sm text-neutral-600 truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
                <span className="text-xs text-neutral-500">
                  {conversation.time}
                </span>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
};

export default Messages;
