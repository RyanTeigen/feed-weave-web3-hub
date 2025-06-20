
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FeedPost {
  id: string;
  platform_post_id: string;
  content?: string;
  media_urls: string[];
  engagement_metrics: Record<string, any>;
  posted_at?: string;
  fetched_at: string;
  social_platforms: {
    platform_name: string;
    platform_username?: string;
    user_id: string;
  };
}

export const useSocialFeed = (userId?: string) => {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchFeed = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('social-scraper', {
        body: { 
          action: 'feed',
          user_id: userId,
          limit: 50
        }
      });

      if (error) throw error;
      
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching social feed:', error);
      toast({
        title: "Error loading feed",
        description: "Failed to load your social media feed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const triggerScrape = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('social-scraper', {
        body: { action: 'scrape' }
      });

      if (error) throw error;

      toast({
        title: "Scraping Started",
        description: "Your social media feeds are being updated",
      });

      // Refresh feed after scraping
      setTimeout(() => {
        fetchFeed();
      }, 3000);

      return data;
    } catch (error) {
      console.error('Error triggering scrape:', error);
      toast({
        title: "Scraping Failed",
        description: "Failed to update your social media feeds",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [userId]);

  return {
    posts,
    isLoading,
    fetchFeed,
    triggerScrape
  };
};
