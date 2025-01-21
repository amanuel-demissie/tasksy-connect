import { supabase } from "@/integrations/supabase/client";

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d';

export const getImageUrl = (url: string | null): string => {
  if (!url) {
    console.log('No URL provided, using default image');
    return DEFAULT_IMAGE;
  }

  // Handle external URLs (starting with http:// or https://)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Handle business profile images
  if (url.startsWith('business-profiles/')) {
    try {
      // Get the public URL directly from the business_profile_images bucket
      const { data } = supabase.storage
        .from('business_profile_images')
        .getPublicUrl(url);
      
      if (data?.publicUrl) {
        console.log('Successfully generated business profile image URL:', data.publicUrl);
        return data.publicUrl;
      }
      
      console.error('Failed to get public URL for business profile image:', url);
      return DEFAULT_IMAGE;
    } catch (error) {
      console.error('Error getting business profile image URL:', error);
      return DEFAULT_IMAGE;
    }
  }

  if (url.startsWith('freelancer-profiles/')) {
    try {
      // Get the public URL directly from the business_profile_images bucket
      const { data } = supabase.storage
        .from('business_profile_images')
        .getPublicUrl(url);
      
      if (data?.publicUrl) {
        console.log('Successfully generated freelancer profile image URL:', data.publicUrl);
        return data.publicUrl;
      }
      
      console.error('Failed to get public URL for business profile image:', url);
      return DEFAULT_IMAGE;
    } catch (error) {
      console.error('Error getting business profile image URL:', error);
      return DEFAULT_IMAGE;
    }
  }
  
  // Handle avatars bucket
  if (url.includes('avatars/')) {
    try {
      const path = url.includes('avatars/') 
        ? url.substring(url.indexOf('avatars/')) 
        : url;
      
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(path);
      
      if (data?.publicUrl) {
        return data.publicUrl;
      }
      
      return DEFAULT_IMAGE;
    } catch (error) {
      console.error('Error getting avatar URL:', error);
      return DEFAULT_IMAGE;
    }
  }

  // If no conditions match, return default image
  console.error('Invalid URL format:', url);
  return DEFAULT_IMAGE;
};