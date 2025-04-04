
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://uudffpyctqfargozmdtf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1ZGZmcHljdHFmYXJnb3ptZHRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4MjI2MzUsImV4cCI6MjA1MDM5ODYzNX0.AADTVB6bnyGh-NTjSdcFSdJhkXA69_z_40nRApEMow4";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    }
  }
);
