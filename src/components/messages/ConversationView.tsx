
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Send } from "lucide-react";
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
      .channel(`conversation-${conversationId}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, 
        (payload) => {
          const newMsg = payload.new as any;
          setMessages(prev => [
            ...prev, 
            {
              ...newMsg,
              isCurrentUser: newMsg.sender_id === currentUserId
            }
          ]);
          
          // Mark message as read if not from current user
          if (newMsg.sender_id !== currentUserId) {
            supabase
              .from('messages')
              .update({ read: true })
              .eq('id', newMsg.id);
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, currentUserId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage 
              src={businessDetails?.image_url || undefined} 
              alt={businessDetails?.name || "Business"} 
            />
            <AvatarFallback>
              {businessDetails?.name?.substring(0, 2).toUpperCase() || "BP"}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold text-primary">
            {businessDetails?.name || "Conversation"}
          </h2>
        </div>
      </div>
      
      {/* Messages */}
      <Card className="flex-1 mb-4 border-border overflow-hidden">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4 pb-2">
            {messages.length === 0 ? (
              <p className="text-center text-neutral-500 py-8">
                No messages yet. Send a message to start the conversation.
              </p>
            ) : (
              messages.map(message => (
                <MessageBubble
                  key={message.id}
                  message={message.content}
                  isCurrentUser={message.isCurrentUser}
                  timestamp={new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </Card>
      
      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          disabled={sending}
        />
        <Button type="submit" disabled={sending || !newMessage.trim()}>
          <Send className="h-4 w-4 mr-2" />
          Send
        </Button>
      </form>
    </div>
  );
};
