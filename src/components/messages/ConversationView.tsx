
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Image, Smile, Mic } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { MessageBubble } from "@/components/messages/MessageBubble";

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  isCurrentUser: boolean;
}

interface BusinessDetails {
  id: string;
  name: string;
  image_url: string | null;
}

interface ConversationViewProps {
  conversationId: string;
  onBack: () => void;
  businessDetails?: BusinessDetails;
}

export const ConversationView: React.FC<ConversationViewProps> = ({
  conversationId,
  onBack,
  businessDetails
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch messages for the conversation
  const fetchMessages = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return;
      
      setCurrentUserId(session.user.id);
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Mark messages as read if they weren't sent by the current user
      const unreadMessages = data
        .filter(msg => !msg.read && msg.sender_id !== session.user.id)
        .map(msg => msg.id);
        
      if (unreadMessages.length > 0) {
        await supabase
          .from('messages')
          .update({ read: true })
          .in('id', unreadMessages);
      }

      setMessages(
        data.map(msg => ({
          ...msg,
          isCurrentUser: msg.sender_id === session.user.id
        }))
      );
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Could not load messages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    
    // Set up realtime subscription for new messages
    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        console.log('New message received:', payload);
        const newMsg = payload.new as any;
        
        // Only add the message if it's not already in the array
        setMessages(prev => {
          // Check if message already exists
          const exists = prev.some(msg => msg.id === newMsg.id);
          if (exists) return prev;
          
          return [
            ...prev, 
            {
              ...newMsg,
              isCurrentUser: newMsg.sender_id === currentUserId
            }
          ];
        });
        
        // Mark message as read if not from current user
        if (newMsg.sender_id !== currentUserId && !newMsg.read) {
          supabase
            .from('messages')
            .update({ read: true })
            .eq('id', newMsg.id)
            .then(() => console.log('Message marked as read'));
        }
      })
      .subscribe();
    
    console.log('Subscribed to channel:', `conversation:${conversationId}`);
    
    return () => {
      console.log('Unsubscribing from channel');
      supabase.removeChannel(channel);
    };
  }, [conversationId, currentUserId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).toUpperCase();
  };
  
  // Group messages by date
  const groupedMessages = messages.reduce((groups: Record<string, Message[]>, message) => {
    const date = new Date(message.created_at).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !currentUserId) return;
    
    setSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserId,
          content: newMessage,
          read: false
        });

      if (error) throw error;
      
      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Could not send your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {/* Header */}
      <div className="flex items-center pb-4 border-b border-zinc-800">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
          className="mr-2 text-neutral-400 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <Avatar className="h-10 w-10 mr-3 border border-zinc-700">
          <AvatarImage 
            src={businessDetails?.image_url || undefined} 
            alt={businessDetails?.name || "User"} 
          />
          <AvatarFallback className="bg-zinc-700 text-white">
            {businessDetails?.name?.substring(0, 2).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h2 className="font-semibold text-white">
            {businessDetails?.name || "Conversation"}
          </h2>
          <p className="text-xs text-neutral-400">Active now</p>
        </div>
      </div>
      
      {/* Messages */}
      <ScrollArea className="flex-1 py-4">
        <div className="space-y-6 px-1">
          {Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date} className="space-y-2">
              <div className="text-center">
                <span className="text-xs text-neutral-500 bg-zinc-800 px-3 py-1 rounded-full">
                  {new Date(date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              
              {msgs.map(message => (
                <MessageBubble
                  key={message.id}
                  message={message.content}
                  isCurrentUser={message.isCurrentUser}
                  timestamp={new Date(message.created_at).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                />
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Message Input */}
      <div className="pt-2 mt-2 border-t border-zinc-800">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="text-neutral-400 hover:text-white rounded-full"
          >
            <Image className="h-6 w-6" />
          </Button>
          
          <div className="relative flex-1">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Message..."
              className="bg-zinc-800 border-none rounded-full pl-4 pr-12 py-6 text-white"
            />
            <Button 
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent p-2"
            >
              {newMessage.trim() ? (
                <Send className="h-5 w-5 text-blue-500" />
              ) : (
                <Mic className="h-5 w-5 text-neutral-400" />
              )}
            </Button>
          </div>
          
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="text-neutral-400 hover:text-white rounded-full"
          >
            <Smile className="h-6 w-6" />
          </Button>
        </form>
      </div>
    </div>
  );
};
