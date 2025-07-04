import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

/**
 * Supabase project URL
 * @constant {string}
 */
const SUPABASE_URL = "https://uudffpyctqfargozmdtf.supabase.co";

/**
 * Supabase anonymous/public API key
 * This key is safe to use in client-side code as it has limited permissions
 * @constant {string}
 */
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1ZGZmcHljdHFmYXJnb3ptZHRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4MjI2MzUsImV4cCI6MjA1MDM5ODYzNX0.AADTVB6bnyGh-NTjSdcFSdJhkXA69_z_40nRApEMow4";

/**
 * Supabase client instance configured for the messaging system
 * 
 * This client is configured with:
 * - Authentication settings for session management
 * - Real-time configuration for live messaging
 * - TypeScript types for type safety
 * 
 * Configuration details:
 * - Auth: Auto-refresh tokens, persistent sessions, URL session detection
 * - Realtime: 10 events per second limit to prevent spam and performance issues
 * 
 * Usage:
 * - Database operations: supabase.from('table').select()
 * - Real-time subscriptions: supabase.channel().on().subscribe()
 * - Authentication: supabase.auth.getSession()
 * 
 * @type {import('@supabase/supabase-js').SupabaseClient<Database>}
 */
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
