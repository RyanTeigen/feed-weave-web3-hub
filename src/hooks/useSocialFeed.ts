
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

export const useSocialFeed = (walletAddress?: string) => {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchFeed = async () => {
    if (!walletAddress) {
      setPosts([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.rpc('get_feed_by_wallet', {
        p_wallet_address: walletAddress,
        p_limit: 50
      });

      if (error) throw error;
      
      // Transform the data to match the expected format
      const transformedPosts: FeedPost[] = data?.map(post => ({
        id: post.id,
        platform_post_id: post.platform_post_id,
        content: post.content || undefined,
        media_urls: Array.isArray(post.media_urls) ? post.media_urls as string[] : [],
        engagement_metrics: (post.engagement_metrics as Record<string, any>) || {},
        posted_at: post.posted_at || undefined,
        fetched_at: post.fetched_at,
        social_platforms: {
          platform_name: post.platform_name,
          platform_username: post.platform_username || undefined,
          user_id: walletAddress, // Use wallet address as user identifier
        }
      })) || [];
      
      setPosts(transformedPosts);
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
  }, [walletAddress]);

  return {
    posts,
    isLoading,
    fetchFeed,
    triggerScrape
  };
};
