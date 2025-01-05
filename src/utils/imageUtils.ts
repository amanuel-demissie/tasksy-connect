import { supabase } from "@/integrations/supabase/client";

export const getImageUrl = (url: string | null) => {
  const defaultImage = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d';
  
  if (!url) return defaultImage;
  
  if (url.startsWith('/')) return url;
  
  if (url.startsWith('avatars/')) {
    try {
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(url);
      return data.publicUrl || defaultImage;
    } catch {
      return defaultImage;
    }
  }
  
  try {
    const urlObj = new URL(url);
    return urlObj.toString().split(':').join('');
  } catch {
    return defaultImage;
  }
};