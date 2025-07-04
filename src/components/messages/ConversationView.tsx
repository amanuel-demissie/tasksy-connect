import React, { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Image, Smile, Mic, RefreshCw } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { MessageBubble } from "@/components/messages/MessageBubble";

/**
 * Interface representing a message in the conversation
 * @interface Message
 * @property {string} id - Unique identifier for the message
 * @property {string} content - The message text content
 * @property {string} created_at - ISO timestamp when message was created
 * @property {string} sender_id - User ID of the message sender
 * @property {boolean} isCurrentUser - Whether the current user sent this message
 */
interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  isCurrentUser: boolean;
}

/**
 * Interface representing business details for the conversation header
 * @interface BusinessDetails
 * @property {string} id - Business profile ID
 * @property {string} name - Business name
 * @property {string | null} image_url - Business profile image URL
 */
interface BusinessDetails {
  id: string;
  name: string;
  image_url: string | null;
}

/**
 * Props for the ConversationView component
 * @interface ConversationViewProps
 * @property {string} conversationId - The ID of the conversation to display
 * @property {() => void} onBack - Callback function to navigate back to conversation list
 * @property {BusinessDetails | undefined} businessDetails - Business information for the conversation header
 */
interface ConversationViewProps {
  conversationId: string;
  onBack: () => void;
  businessDetails?: BusinessDetails;
}

/**
 * ConversationView component for displaying and managing individual conversations
 * 
 * This component provides:
 * - Real-time message display and updates
 * - Message sending functionality
 * - Auto-scroll to latest messages
 * - Message read status tracking
 * - Manual refresh capability
 * - Real-time subscription management
 * 
 * Real-time functionality:
 * - Subscribes to conversation-specific message changes
 * - Automatically marks incoming messages as read
 * - Prevents duplicate messages through ID checking
 * - Uses unique channel names to prevent conflicts
 * 
 * Performance optimizations:
 * - Channel cleanup on unmount and dependency changes
 * - Duplicate message prevention
 * - Efficient state updates
 * - Conditional re-renders
 * 
 * @component
 * @param {ConversationViewProps} props - Component props
 * @returns {JSX.Element} The conversation view component
 */
export const ConversationView: React.FC<ConversationViewProps> = ({
  conversationId,
  onBack,
  businessDetails
}) => {
  /** Array of messages in the conversation */
  const [messages, setMessages] = useState<Message[]>([]);
  /** Current message input value */
  const [newMessage, setNewMessage] = useState("");
  /** Loading state for initial message fetch */
  const [loading, setLoading] = useState(true);
  /** Loading state for message sending */
  const [sending, setSending] = useState(false);
  /** Current user's ID for message ownership and read status */
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  /** Reference to the scroll container for auto-scroll functionality */
  const messagesEndRef = useRef<HTMLDivElement>(null);
  /** Reference to the real-time subscription channel */
  const channelRef = useRef<any>(null);
  
  const { toast } = useToast();

  /**
   * Fetches all messages for the current conversation
   * 
   * This function:
   * 1. Gets the current user session
   * 2. Fetches all messages for the conversation, ordered by creation time
   * 3. Marks unread messages as read (if not sent by current user)
   * 4. Updates the messages state with proper ownership flags
   * 
   * @async
   * @function fetchMessages
   * @returns {Promise<void>}
   * @throws {Error} When session is invalid or database queries fail
   */
  const fetchMessages = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return;
      
      setCurrentUserId(session.user.id);
      
      // Fetch all messages for this conversation
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

      // Set messages with ownership flags
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
  }, [conversationId, toast]);

  /**
   * Sets up real-time subscription for conversation-specific message updates
   * 
   * This function creates a unique channel that listens for:
   * - INSERT events on messages table (new messages) filtered by conversation_id
   * - UPDATE events on messages table (message updates) filtered by conversation_id
   * 
   * Channel management:
   * - Cleans up existing channel before creating new one
   * - Uses unique channel name with timestamp to prevent conflicts
   * - Stores channel reference for cleanup
   * 
   * Message handling:
   * - Prevents duplicate messages through ID checking
   * - Automatically marks incoming messages as read
   * - Updates message state efficiently
   * 
   * @function setupRealtimeSubscription
   * @returns {void}
   */
  const setupRealtimeSubscription = useCallback(() => {
    if (!currentUserId || !conversationId) return;

    // Clean up existing channel to prevent duplicates
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    console.log('Setting up real-time subscription for conversation:', conversationId);
    
    // Create unique channel name to prevent conflicts
    const channelName = `conversation-${conversationId}-${Date.now()}`;
    
    // Set up realtime subscription for new messages
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        console.log('New message received via realtime:', payload);
        const newMsg = payload.new as any;
        
        // Add the new message to state with duplicate prevention
        setMessages(prev => {
          // Check if message already exists to prevent duplicates
          const exists = prev.some(msg => msg.id === newMsg.id);
          if (exists) {
            console.log('Message already exists, skipping duplicate');
            return prev;
          }
          
          console.log('Adding new message to state:', newMsg);
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
          (async () => {
            try {
              await supabase
                .from('messages')
                .update({ read: true })
                .eq('id', newMsg.id);
              console.log('Message marked as read');
            } catch (err: any) {
              console.error('Error marking message as read:', err);
            }
          })();
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        console.log('Message updated via realtime:', payload);
        const updatedMsg = payload.new as any;
        
        // Update the message in state
        setMessages(prev => 
          prev.map(msg => 
            msg.id === updatedMsg.id 
              ? { ...msg, ...updatedMsg, isCurrentUser: updatedMsg.sender_id === currentUserId }
              : msg
          )
        );
      })
      .subscribe((status) => {
        console.log('Subscription status for', channelName, ':', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to real-time updates');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Channel subscription error');
        }
      });
    
    channelRef.current = channel;
    console.log('Subscribed to channel:', channelName);
  }, [conversationId, currentUserId]);

  // Fetch messages when conversation changes
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Set up real-time subscription when currentUserId is available
  useEffect(() => {
    if (currentUserId) {
      setupRealtimeSubscription();
    }
  }, [currentUserId, setupRealtimeSubscription]);

  // Cleanup channel on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        console.log('Cleaning up channel on unmount');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * Groups messages by date for display purposes
   * 
   * This creates a record where each key is a date string and the value
   * is an array of messages from that date.
   * 
   * @type {Record<string, Message[]>}
   */
  const groupedMessages = messages.reduce((groups: Record<string, Message[]>, message) => {
    const date = new Date(message.created_at).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  /**
   * Handles sending a new message
   * 
   * This function:
   * 1. Validates message content and user session
   * 2. Inserts the message into the database
   * 3. Clears the input field on success
   * 4. Shows error toast if sending fails
   * 
   * The message will automatically appear in the UI through the real-time subscription
   * 
   * @async
   * @function handleSendMessage
   * @param {React.FormEvent} e - Form submission event
   * @returns {Promise<void>}
   * @throws {Error} When message sending fails
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !currentUserId) return;
    
    setSending(true);
    try {
      console.log('Sending message:', newMessage);
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserId,
          content: newMessage,
          read: false
        })
        .select()
        .single();

      if (error) throw error;
      
      console.log('Message sent successfully:', data);
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
      {/* Header with business info and navigation */}
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
        
        {/* Manual refresh button for debugging */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={fetchMessages}
          className="text-neutral-400 hover:text-white"
          title="Refresh messages"
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Messages display area */}
      <ScrollArea className="flex-1 py-4">
        <div className="space-y-6 px-1">
          {Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date} className="space-y-2">
              {/* Date separator */}
              <div className="text-center">
                <span className="text-xs text-neutral-500 bg-zinc-800 px-3 py-1 rounded-full">
                  {new Date(date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              
              {/* Messages for this date */}
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
          {/* Auto-scroll target */}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Message input form */}
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
