import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConversationList } from "@/components/messages/ConversationList";
import { ConversationView } from "@/components/messages/ConversationView";
import { useNavigate } from "react-router-dom";
import { NewMessageDialog } from "@/components/messages/NewMessageDialog";

/**
 * Interface for conversation data
 * @interface Conversation
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
const Messages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessageDialogOpen, setNewMessageDialogOpen] = useState(false);
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const fetchConversations = async () => {
    setLoading(true);
    try {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      const {
        data,
        error
      } = await supabase.from('conversations').select(`
          id,
          business_id,
          business_profiles:business_id (
            id,
            name,
            image_url
          )
        `).eq('customer_id', session.user.id);
      if (error) throw error;

      // Fetch last message for each conversation
      const conversationsWithMessages = await Promise.all((data || []).map(async conv => {
        const {
          data: messagesData,
          error: messagesError
        } = await supabase.from('messages').select('content, created_at, read').eq('conversation_id', conv.id).order('created_at', {
          ascending: false
        }).limit(1);
        if (messagesError) throw messagesError;

        // Count unread messages
        const {
          count,
          error: countError
        } = await supabase.from('messages').select('id', {
          count: 'exact'
        }).eq('conversation_id', conv.id).eq('read', false).neq('sender_id', session.user.id);
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
          lastMessageTime: lastMessage?.created_at ? new Date(lastMessage.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          }) : null,
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
  };
  useEffect(() => {
    fetchConversations();

    // Set up realtime subscription for new messages
    const channel = supabase.channel('messages-changes').on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages'
    }, () => {
      fetchConversations();
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversation(conversationId);
  };
  const handleBackToList = () => {
    setSelectedConversation(null);
    fetchConversations();
  };
  const handleNewConversation = async (userId: string, userType: 'business' | 'freelancer') => {
    try {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      // Create a new conversation
      const {
        data: newConversation,
        error
      } = await supabase.from('conversations').insert({
        customer_id: session.user.id,
        business_id: userId
      }).select('id').single();
      if (error) throw error;

      // Select the new conversation
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
  if (loading) {
    return <div className="min-h-screen bg-secondary flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>;
  }
  return <div className="min-h-screen bg-secondary pb-20">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-4">
        {selectedConversation ? <ConversationView conversationId={selectedConversation} onBack={handleBackToList} businessDetails={conversations.find(c => c.id === selectedConversation)?.business} /> : <>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-primary">Messages</h1>
              <Button size="sm" onClick={() => setNewMessageDialogOpen(true)} className="flex items-center gap-1 text-violet-700">
                <Plus className="h-4 w-4" />
                New Message
              </Button>
            </div>
            <ConversationList conversations={conversations} onSelect={handleConversationSelect} onRefresh={fetchConversations} />
          </>}
      </div>
      
      <NewMessageDialog open={newMessageDialogOpen} onOpenChange={setNewMessageDialogOpen} onSelectUser={handleNewConversation} />
    </div>;
};
export default Messages;