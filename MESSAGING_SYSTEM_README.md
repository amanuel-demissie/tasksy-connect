# Messaging System Documentation

## Overview

The messaging system in Tasksy Connect is a real-time chat application that enables customers to communicate with businesses and freelancers. It's built with React, TypeScript, and Supabase, featuring instant message delivery, read status tracking, and a modern chat interface.

## Architecture

### Database Schema

The messaging system uses three main tables:

```sql
-- Conversations table
conversations (
  id: uuid PRIMARY KEY,
  customer_id: uuid REFERENCES profiles(id),
  business_id: uuid REFERENCES business_profiles(id),
  created_at: timestamp,
  updated_at: timestamp
)

-- Messages table
messages (
  id: uuid PRIMARY KEY,
  conversation_id: uuid REFERENCES conversations(id),
  sender_id: uuid REFERENCES profiles(id),
  content: text,
  read: boolean,
  created_at: timestamp,
  updated_at: timestamp
)

-- Business profiles table (for display)
business_profiles (
  id: uuid PRIMARY KEY,
  name: text,
  image_url: text,
  category: service_category,
  owner_id: uuid REFERENCES profiles(id)
)
```

### Component Architecture

```
Messages.tsx (Main Page)
├── ConversationList.tsx (List of conversations)
├── ConversationView.tsx (Individual chat)
│   └── MessageBubble.tsx (Individual messages)
└── NewMessageDialog.tsx (Start new conversation)
```

## Real-Time Implementation

### Supabase Real-Time Configuration

The system uses Supabase's real-time functionality with the following configuration:

```typescript
// src/integrations/supabase/client.ts
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,      // Automatically refresh auth tokens
      persistSession: true,        // Persist session in localStorage
      detectSessionInUrl: true,    // Detect auth tokens in URL (for OAuth)
    },
    realtime: {
      params: {
        eventsPerSecond: 10,       // Limit real-time events to prevent spam
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
   - Only refreshes when not viewing a specific conversation

2. **Individual Conversation Channel** (`ConversationView.tsx`)
   - Channel name: `conversation-${conversationId}-${Date.now()}`
   - Purpose: Real-time updates for specific conversation
   - Scope: Filtered by `conversation_id`
   - Handles message insertion and updates

## Component Documentation

### 1. Messages.tsx (Main Page)

**Location:** `src/pages/Messages.tsx`

**Purpose:** Main entry point for the messaging system

**Key Features:**
- Displays list of user's conversations
- Handles conversation selection and navigation
- Manages real-time updates for conversation list
- Provides search functionality
- Creates new conversations

**State Management:**
```typescript
const [conversations, setConversations] = useState<Conversation[]>([]);
const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
const [loading, setLoading] = useState(true);
const [searchQuery, setSearchQuery] = useState("");
const channelRef = useRef<any>(null); // Tracks real-time channel
```

**Key Functions:**
- `fetchConversations()` - Loads all conversations for current user
- `setupRealtimeSubscription()` - Manages real-time updates for conversation list
- `handleConversationSelect()` - Switches to conversation view
- `handleNewConversation()` - Creates new conversation

### 2. ConversationView.tsx (Individual Chat)

**Location:** `src/components/messages/ConversationView.tsx`

**Purpose:** Displays individual conversation with real-time messaging

**Key Features:**
- Real-time message display and updates
- Message sending functionality
- Auto-scroll to latest messages
- Message read status tracking
- Manual refresh capability
- Message grouping by date

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
      // Handle new messages with duplicate prevention
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
        // Update read status
      }
    })
    .subscribe();
}, [conversationId, currentUserId]);
```

### 3. ConversationList.tsx

**Location:** `src/components/messages/ConversationList.tsx`

**Purpose:** Displays list of conversations with previews

**Key Features:**
- Shows conversation previews with last message
- Displays unread message count
- Shows relative timestamps (Today, Yesterday, etc.)
- Refresh functionality
- Empty state handling

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

**Features:**
- Different styling for sent vs received messages
- Message content with word wrapping
- Timestamp display
- Responsive design

**Props:**
```typescript
interface MessageBubbleProps {
  message: string;
  isCurrentUser: boolean;
  timestamp: string;
}
```

### 5. NewMessageDialog.tsx

**Location:** `src/components/messages/NewMessageDialog.tsx`

**Purpose:** Dialog for starting new conversations

**Features:**
- Search functionality for businesses and freelancers
- Tabbed interface (Businesses/Freelancers)
- User selection with profile information
- Excludes current user from results

## Data Flow

### 1. Message Sending Flow

```
User types message → handleSendMessage() → Supabase insert → Real-time event → UI update
```

1. User types message and submits form
2. `handleSendMessage()` validates input and calls Supabase insert
3. Supabase triggers real-time event for all subscribed clients
4. Channel handlers receive the event and update UI
5. Message appears immediately in the conversation

### 2. Message Receiving Flow

```
Real-time event → Channel handler → State update → UI re-render → Auto-scroll
```

1. Supabase sends real-time event when new message is inserted
2. Channel handler processes the event and extracts message data
3. Message state is updated with new message (with duplicate prevention)
4. UI re-renders with new message
5. Auto-scroll to bottom ensures latest message is visible

### 3. Conversation List Updates

```
New message → Real-time event → fetchConversations() → Update conversation list
```

1. New message is sent/received in any conversation
2. Real-time event triggers conversation list subscription
3. `fetchConversations()` is called to refresh the list
4. Conversation list updates with new last message and unread count

## Performance Optimizations

### 1. Channel Cleanup

```typescript
// Cleanup on unmount
useEffect(() => {
  return () => {
    if (channelRef.current) {
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
  if (exists) return prev;
  
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

## Debugging

### Console Logs

The system includes comprehensive logging:

- **Message sending**: "Sending message: [content]"
- **Message received**: "New message received via realtime: [payload]"
- **Subscription status**: "Successfully subscribed to real-time updates"
- **Channel cleanup**: "Cleaning up channel on unmount"
- **Duplicate prevention**: "Message already exists, skipping duplicate"

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

## Conclusion

The messaging system provides a robust, real-time chat experience with proper error handling, performance optimizations, and debugging capabilities. The dual-channel approach ensures efficient updates while preventing conflicts, and the comprehensive logging helps with troubleshooting and development.

The system is designed to be scalable, maintainable, and user-friendly, with clear separation of concerns and well-documented components that any developer can understand and extend. 