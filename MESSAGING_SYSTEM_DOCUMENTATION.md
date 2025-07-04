# Messaging System Documentation

## Overview

The messaging system in Tasksy Connect is a real-time chat application built with React, TypeScript, and Supabase. It allows customers to communicate with businesses and freelancers through instant messaging with real-time updates.

## Architecture

### Database Schema

The messaging system uses three main tables:

1. **`conversations`** - Stores conversation metadata
2. **`messages`** - Stores individual messages
3. **`business_profiles`** - Stores business information for display

### Key Components

- `Messages.tsx` - Main messages page with conversation list
- `ConversationView.tsx` - Individual conversation view
- `ConversationList.tsx` - List of conversations
- `MessageBubble.tsx` - Individual message display
- `NewMessageDialog.tsx` - Dialog to start new conversations

## Real-Time Implementation

### Supabase Real-Time Configuration

**File: `src/integrations/supabase/client.ts`**

```typescript
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10, // Limits real-time events to prevent spam
      },
    },
  }
);
```

### Channel Management Strategy

The system uses a dual-channel approach to prevent conflicts:

1. **Conversation List Channel** (`Messages.tsx`)
   - Channel name: `conversation-list-${Date.now()}`
   - Purpose: Updates conversation list when new messages arrive
   - Scope: Global message changes

2. **Individual Conversation Channel** (`ConversationView.tsx`)
   - Channel name: `conversation-${conversationId}-${Date.now()}`
   - Purpose: Real-time updates for specific conversation
   - Scope: Filtered by `conversation_id`

## Component Documentation

### 1. Messages.tsx (Main Page)

**Location:** `src/pages/Messages.tsx`

**Purpose:** Main entry point for the messaging system

**Key Features:**
- Displays list of conversations
- Handles conversation selection
- Manages real-time updates for conversation list
- Provides search functionality

**State Management:**
```typescript
const [conversations, setConversations] = useState<Conversation[]>([]);
const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
const [loading, setLoading] = useState(true);
const [searchQuery, setSearchQuery] = useState("");
const channelRef = useRef<any>(null); // Tracks real-time channel
```

**Real-Time Implementation:**
```typescript
const setupRealtimeSubscription = useCallback(() => {
  // Clean up existing channel
  if (channelRef.current) {
    supabase.removeChannel(channelRef.current);
  }

  const channelName = `conversation-list-${Date.now()}`;
  
  const channel = supabase
    .channel(channelName)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages'
    }, (payload) => {
      // Only refresh if not in conversation view
      if (!selectedConversation) {
        fetchConversations();
      }
    })
    .subscribe((status) => {
      console.log('Conversation list subscription status:', status);
    });

  channelRef.current = channel;
}, [selectedConversation, fetchConversations]);
```

**Key Functions:**
- `fetchConversations()` - Loads all conversations for current user
- `handleConversationSelect()` - Switches to conversation view
- `handleNewConversation()` - Creates new conversation
- `setupRealtimeSubscription()` - Manages real-time updates

### 2. ConversationView.tsx (Individual Chat)

**Location:** `src/components/messages/ConversationView.tsx`

**Purpose:** Displays individual conversation with real-time messaging

**Key Features:**
- Real-time message display
- Message sending
- Auto-scroll to latest message
- Message read status tracking
- Manual refresh capability

**State Management:**
```typescript
const [messages, setMessages] = useState<Message[]>([]);
const [newMessage, setNewMessage] = useState("");
const [loading, setLoading] = useState(true);
const [sending, setSending] = useState(false);
const [currentUserId, setCurrentUserId] = useState<string | null>(null);
const messagesEndRef = useRef<HTMLDivElement>(null);
const channelRef = useRef<any>(null);
```

**Real-Time Implementation:**
```typescript
const setupRealtimeSubscription = useCallback(() => {
  if (!currentUserId || !conversationId) return;

  // Clean up existing channel
  if (channelRef.current) {
    supabase.removeChannel(channelRef.current);
  }

  const channelName = `conversation-${conversationId}-${Date.now()}`;
  
  const channel = supabase
    .channel(channelName)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${conversationId}`
    }, (payload) => {
      const newMsg = payload.new as any;
      
      // Prevent duplicate messages
      setMessages(prev => {
        const exists = prev.some(msg => msg.id === newMsg.id);
        if (exists) return prev;
        
        return [...prev, {
          ...newMsg,
          isCurrentUser: newMsg.sender_id === currentUserId
        }];
      });
      
      // Mark as read if not from current user
      if (newMsg.sender_id !== currentUserId && !newMsg.read) {
        (async () => {
          try {
            await supabase
              .from('messages')
              .update({ read: true })
              .eq('id', newMsg.id);
          } catch (err) {
            console.error('Error marking message as read:', err);
          }
        })();
      }
    })
    .subscribe((status) => {
      console.log('Subscription status:', status);
    });

  channelRef.current = channel;
}, [conversationId, currentUserId]);
```

**Key Functions:**
- `fetchMessages()` - Loads messages for current conversation
- `handleSendMessage()` - Sends new message
- `setupRealtimeSubscription()` - Manages real-time updates
- Auto-scroll to bottom when new messages arrive

### 3. ConversationList.tsx

**Location:** `src/components/messages/ConversationList.tsx`

**Purpose:** Displays list of conversations with last message and unread count

**Key Features:**
- Shows conversation previews
- Displays unread message count
- Shows last message time
- Refresh functionality

**Props:**
```typescript
interface ConversationListProps {
  conversations: Conversation[];
  onSelect: (conversationId: string) => void;
  onRefresh: () => void;
}
```

### 4. MessageBubble.tsx

**Location:** `src/components/messages/MessageBubble.tsx`

**Purpose:** Renders individual message bubbles

**Props:**
```typescript
interface MessageBubbleProps {
  message: string;
  isCurrentUser: boolean;
  timestamp: string;
}
```

## Data Flow

### 1. Message Sending Flow

```
User types message → handleSendMessage() → Supabase insert → Real-time event → UI update
```

1. User types message and submits
2. `handleSendMessage()` calls Supabase insert
3. Supabase triggers real-time event
4. All subscribed clients receive the event
5. UI updates with new message

### 2. Message Receiving Flow

```
Real-time event → Channel handler → State update → UI re-render → Auto-scroll
```

1. Supabase sends real-time event
2. Channel handler processes the event
3. Message state is updated
4. UI re-renders with new message
5. Auto-scroll to bottom

### 3. Conversation List Updates

```
New message → Real-time event → fetchConversations() → Update conversation list
```

1. New message is sent/received
2. Real-time event triggers
3. `fetchConversations()` is called
4. Conversation list updates with new last message

## Error Handling

### Real-Time Subscription Errors

```typescript
.subscribe((status) => {
  console.log('Subscription status:', status);
  if (status === 'SUBSCRIBED') {
    console.log('Successfully subscribed to real-time updates');
  } else if (status === 'CHANNEL_ERROR') {
    console.error('Channel subscription error');
  }
});
```

### Message Sending Errors

```typescript
try {
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
}
```

## Performance Optimizations

### 1. Channel Cleanup

```typescript
// Cleanup on unmount
useEffect(() => {
  return () => {
    if (channelRef.current) {
      console.log('Cleaning up channel on unmount');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  };
}, []);
```

### 2. Duplicate Prevention

```typescript
setMessages(prev => {
  const exists = prev.some(msg => msg.id === newMsg.id);
  if (exists) {
    console.log('Message already exists, skipping duplicate');
    return prev;
  }
  
  return [...prev, newMsg];
});
```

### 3. Conditional Updates

```typescript
// Only refresh conversation list if not in conversation view
if (!selectedConversation) {
  fetchConversations();
}
```

### 4. Unique Channel Names

```typescript
const channelName = `conversation-${conversationId}-${Date.now()}`;
```

## Debugging

### Console Logs

The system includes comprehensive logging:

- **Message sending**: "Sending message: [content]"
- **Message received**: "New message received via realtime: [payload]"
- **Subscription status**: "Successfully subscribed to real-time updates"
- **Channel cleanup**: "Cleaning up channel on unmount"

### Manual Refresh

A refresh button is available in the conversation view for debugging:

```typescript
<Button 
  variant="ghost" 
  size="icon" 
  onClick={fetchMessages}
  className="text-neutral-400 hover:text-white"
  title="Refresh messages"
>
  <RefreshCw className="h-5 w-5" />
</Button>
```

## Common Issues and Solutions

### 1. Messages Not Updating in Real-Time

**Symptoms:** Messages appear only after page refresh

**Causes:**
- Channel subscription failed
- Channel naming conflicts
- Network connectivity issues

**Solutions:**
- Check browser console for subscription errors
- Verify Supabase real-time is enabled
- Check network connectivity
- Use manual refresh button

### 2. Duplicate Messages

**Symptoms:** Same message appears multiple times

**Causes:**
- Multiple channel subscriptions
- Race conditions in state updates

**Solutions:**
- Ensure proper channel cleanup
- Check duplicate prevention logic
- Verify unique channel names

### 3. Performance Issues

**Symptoms:** Slow message updates or UI lag

**Causes:**
- Too many real-time events
- Inefficient state updates
- Memory leaks from uncleaned channels

**Solutions:**
- Check events per second limit
- Optimize state updates
- Ensure proper cleanup

## Testing

### Manual Testing Checklist

1. **Send Message**
   - [ ] Type message and send
   - [ ] Verify message appears immediately
   - [ ] Check console for "Message sent successfully"

2. **Receive Message**
   - [ ] Send message from another client
   - [ ] Verify message appears in real-time
   - [ ] Check console for "New message received via realtime"

3. **Real-Time Subscription**
   - [ ] Check console for "Successfully subscribed to real-time updates"
   - [ ] Verify subscription status is "SUBSCRIBED"

4. **Channel Cleanup**
   - [ ] Navigate away from conversation
   - [ ] Check console for "Cleaning up channel on unmount"

5. **Error Handling**
   - [ ] Test with network disconnected
   - [ ] Verify error messages appear
   - [ ] Check manual refresh works

### Browser Console Commands

```javascript
// Check active channels
supabase.getChannels()

// Remove all channels (for debugging)
supabase.removeAllChannels()

// Check subscription status
// Look for "Subscription status: SUBSCRIBED" in console
```

## Future Enhancements

### Potential Improvements

1. **Message Typing Indicators**
   - Show when user is typing
   - Real-time typing status

2. **Message Status**
   - Sent, delivered, read receipts
   - Message delivery confirmation

3. **File Attachments**
   - Image sharing
   - Document uploads

4. **Message Search**
   - Search within conversations
   - Global message search

5. **Message Reactions**
   - Emoji reactions
   - Like/dislike messages

6. **Message Threading**
   - Reply to specific messages
   - Threaded conversations

## Security Considerations

### Row Level Security (RLS)

Ensure proper RLS policies are in place:

```sql
-- Example RLS policy for messages
CREATE POLICY "Users can only access messages in their conversations"
ON messages FOR ALL
USING (
  conversation_id IN (
    SELECT id FROM conversations 
    WHERE customer_id = auth.uid() OR business_id = auth.uid()
  )
);
```

### Authentication

- All real-time subscriptions require authentication
- User can only access their own conversations
- Message sender validation

### Rate Limiting

- Real-time events limited to 10 per second
- Message sending should have rate limits
- Prevent spam and abuse

## Conclusion

The messaging system provides a robust, real-time chat experience with proper error handling, performance optimizations, and debugging capabilities. The dual-channel approach ensures efficient updates while preventing conflicts, and the comprehensive logging helps with troubleshooting and development. 