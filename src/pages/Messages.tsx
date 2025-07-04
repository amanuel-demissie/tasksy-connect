import React, { useEffect, useState, useCallback, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Search, ChevronDown, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConversationList } from "@/components/messages/ConversationList";
import { ConversationView } from "@/components/messages/ConversationView";
import { useNavigate } from "react-router-dom";
import { NewMessageDialog } from "@/components/messages/NewMessageDialog";
import { Input } from "@/components/ui/input";

/**
 * Interface representing a conversation in the messaging system
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
 * Main Messages page component that handles the messaging system
 * 
 * This component manages:
 * - Displaying a list of user's conversations
 * - Real-time updates for new messages
 * - Conversation selection and navigation
 * - Search functionality for conversations
 * - Creating new conversations
 * 
 * Real-time functionality:
 * - Subscribes to global message changes to update conversation list
 * - Only refreshes conversation list when not viewing a specific conversation
 * - Uses unique channel names to prevent conflicts with individual conversation subscriptions
 * 
 * @component
 * @returns {JSX.Element} The Messages page component
 */
const Messages = () => {
  /** List of user's conversations with metadata */
  const [conversations, setConversations] = useState<Conversation[]>([]);
  /** Loading state for initial data fetch */
  const [loading, setLoading] = useState(true);
  /** Currently selected conversation ID, null if viewing conversation list */
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  /** Controls visibility of new message dialog */
  const [newMessageDialogOpen, setNewMessageDialogOpen] = useState(false);
  /** Search query for filtering conversations */
  const [searchQuery, setSearchQuery] = useState("");
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  /** Reference to the real-time subscription channel for conversation list updates */
  const channelRef = useRef<any>(null);

  /**
   * Fetches all conversations for the current user
   * 
   * This function:
   * 1. Gets the current user session
   * 2. Fetches all conversations where the user is the customer
   * 3. For each conversation, fetches the last message and unread count
   * 4. Updates the conversations state with complete data
   * 
   * @async
   * @function fetchConversations
   * @returns {Promise<void>}
   * @throws {Error} When session is invalid or database queries fail
   */
  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      // Fetch all conversations for the current user
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          business_id,
          business_profiles:business_id (
            id,
            name,
            image_url
          )
        `)
        .eq('customer_id', session.user.id);

      if (error) throw error;

      // For each conversation, fetch the last message and unread count
      const conversationsWithMessages = await Promise.all((data || []).map(async conv => {
        // Get the most recent message
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('content, created_at, read')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (messagesError) throw messagesError;

        // Count unread messages (messages not sent by current user)
        const { count, error: countError } = await supabase
          .from('messages')
          .select('id', { count: 'exact' })
          .eq('conversation_id', conv.id)
          .eq('read', false)
          .neq('sender_id', session.user.id);
        
        if (countError) throw countError;

        const lastMessage = messagesData && messagesData.length > 0 ? messagesData[0] : null;

        return {
          id: conv.id,
          business: {
            id: conv.business_profiles.id,
            name: conv.business_profiles.name,
            image_url: conv.business_profiles.image_url
          },
          lastMessage: lastMessage?.content ?? null,
          lastMessageTime: lastMessage?.created_at ?? null,
          unreadCount: count || 0
        };
      }));

      setConversations(conversationsWithMessages);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Could not load your conversations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [navigate, toast]);

  /**
   * Sets up real-time subscription for conversation list updates
   * 
   * This function creates a unique channel that listens for:
   * - INSERT events on the messages table (new messages)
   * - UPDATE events on the messages table (message updates)
   * 
   * The subscription only triggers conversation list refresh when:
   * - The user is not currently viewing a specific conversation
   * - This prevents unnecessary updates when in conversation view
   * 
   * Channel naming strategy:
   * - Uses timestamp to ensure uniqueness
   * - Prevents conflicts with individual conversation channels
   * 
   * @function setupRealtimeSubscription
   * @returns {void}
   */
  const setupRealtimeSubscription = useCallback(() => {
    // Clean up existing channel to prevent duplicates
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    console.log('Setting up real-time subscription for conversation list');
    
    // Create unique channel name for conversation list
    const channelName = `conversation-list-${Date.now()}`;
    
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        console.log('New message detected, refreshing conversations');
        // Only refresh if we're not in a conversation view
        // This prevents unnecessary updates when user is already viewing the conversation
        if (!selectedConversation) {
          fetchConversations();
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        console.log('Message updated, refreshing conversations');
        // Only refresh if we're not in a conversation view
        if (!selectedConversation) {
          fetchConversations();
        }
      })
      .subscribe((status) => {
        console.log('Conversation list subscription status:', status);
      });

    channelRef.current = channel;
    console.log('Subscribed to conversation list channel:', channelName);
  }, [selectedConversation, fetchConversations]);

  // Initialize conversations and real-time subscription
  useEffect(() => {
    fetchConversations();
    setupRealtimeSubscription();

    // Cleanup function to remove channel when component unmounts
    return () => {
      if (channelRef.current) {
        console.log('Cleaning up conversation list channel');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [fetchConversations, setupRealtimeSubscription]);

  /**
   * Handles selection of a conversation
   * 
   * @function handleConversationSelect
   * @param {string} conversationId - The ID of the selected conversation
   */
  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversation(conversationId);
  };

  /**
   * Handles navigation back to conversation list
   * 
   * This function:
   * 1. Clears the selected conversation
   * 2. Refreshes the conversation list to get latest data
   * 
   * @function handleBackToList
   */
  const handleBackToList = () => {
    setSelectedConversation(null);
    fetchConversations();
  };

  /**
   * Creates a new conversation with a business or freelancer
   * 
   * This function:
   * 1. Validates user session
   * 2. Creates a new conversation record in the database
   * 3. Automatically selects the new conversation
   * 4. Shows success toast notification
   * 
   * @async
   * @function handleNewConversation
   * @param {string} userId - The ID of the business/freelancer to start conversation with
   * @param {'business' | 'freelancer'} userType - The type of user being messaged
   * @returns {Promise<void>}
   * @throws {Error} When session is invalid or conversation creation fails
   */
  const handleNewConversation = async (userId: string, userType: 'business' | 'freelancer') => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      // Create a new conversation record
      const { data: newConversation, error } = await supabase
        .from('conversations')
        .insert({
          customer_id: session.user.id,
          business_id: userId
        })
        .select('id')
        .single();

      if (error) throw error;

      // Select the new conversation and close dialog
      setSelectedConversation(newConversation.id);
      setNewMessageDialogOpen(false);
      toast({
        title: "Conversation started",
        description: "You can now send messages to this user."
      });
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error",
        description: "Could not create conversation. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Filter conversations based on search query
  const filteredConversations = searchQuery
    ? conversations.filter(conv => 
        conv.business.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  // Show loading spinner while fetching initial data
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-4">
        {selectedConversation ? (
          // Show individual conversation view
          <ConversationView 
            conversationId={selectedConversation} 
            onBack={handleBackToList} 
            businessDetails={conversations.find(c => c.id === selectedConversation)?.business}
          />
        ) : (
          // Show conversation list
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-white">Username</h1>
                <ChevronDown className="h-5 w-5 ml-1 text-white" />
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white rounded-full"
                >
                  <Settings className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setNewMessageDialogOpen(true)}
                  className="text-white rounded-full"
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-500" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-zinc-800 border-none rounded-lg text-white"
              />
            </div>

            <div className="flex mb-4">
              <Button 
                variant="ghost" 
                className="text-white border-b-2 border-white px-6 rounded-none"
              >
                Messages
              </Button>
              <Button 
                variant="ghost" 
                className="text-neutral-500 px-6 rounded-none"
              >
                Requests
              </Button>
            </div>

            <ConversationList 
              conversations={filteredConversations} 
              onSelect={handleConversationSelect} 
              onRefresh={fetchConversations}
            />
          </>
        )}
      </div>
      
      <NewMessageDialog 
        open={newMessageDialogOpen} 
        onOpenChange={setNewMessageDialogOpen} 
        onSelectUser={handleNewConversation}
      />
    </div>
  );
};

export default Messages;
