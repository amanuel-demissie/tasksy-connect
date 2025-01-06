import { supabase } from "@/integrations/supabase/client";

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d';

export const getImageUrl = (url: string | null) => {
  if (!url) return DEFAULT_IMAGE;
  
  // Handle relative paths
  if (url.startsWith('/')) {
    return url;
  }
  
  // Handle Supabase storage URLs
  if (url.startsWith('avatars/')) {
    try {
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(url);
      return data.publicUrl || DEFAULT_IMAGE;
    } catch {
      return DEFAULT_IMAGE;
    }
  }
  
  // Handle and sanitize external URLs
  try {
    // Remove any trailing colons that might cause issues
    const sanitizedUrl = url.replace(/:\//, '://').replace(/:\/$/, '');
    const urlObj = new URL(sanitizedUrl);
    return urlObj.toString();
  } catch {
    console.error('Invalid URL:', url);
    return DEFAULT_IMAGE;
  }
};