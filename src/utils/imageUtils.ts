import { supabase } from "@/integrations/supabase/client";

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d';

export const getImageUrl = (url: string | null) => {
  if (!url) return DEFAULT_IMAGE;
  
  // Handle relative paths
  if (url.startsWith('/')) {
    return url;
  }
  
  // Handle Supabase storage URLs
  if (url.includes('avatars/')) {
    try {
      // Get the full path after 'avatars/'
      const path = url.includes('avatars/') 
        ? url.substring(url.indexOf('avatars/')) 
        : url;
      
      console.log('Attempting to get public URL for path:', path);
      
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(path);
      
      if (data?.publicUrl) {
        console.log('Successfully generated public URL:', data.publicUrl);
        return data.publicUrl;
      }
      
      console.error('Failed to get public URL for:', path);
      return DEFAULT_IMAGE;
    } catch (error) {
      console.error('Error getting public URL:', error);
      return DEFAULT_IMAGE;
    }
  }
  
  // Handle external URLs
  try {
    const urlObj = new URL(url);
    return urlObj.toString();
  } catch {
    console.error('Invalid URL:', url);
    return DEFAULT_IMAGE;
  }
};