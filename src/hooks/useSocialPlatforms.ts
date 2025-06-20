
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SocialPlatform {
  id: string;
  platform_name: string;
  platform_username?: string;
  is_connected: boolean;
  last_sync_at?: string;
}

interface SocialPost {
  id: string;
  platform_post_id: string;
  content?: string;
  media_urls: string[];
  engagement_metrics: Record<string, any>;
  posted_at?: string;
  platform_name: string;
  platform_username?: string;
}

export const useSocialPlatforms = (walletAddress?: string) => {
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPlatforms = async () => {
    if (!walletAddress) {
      setPlatforms([]);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('get_platforms_by_wallet', {
        p_wallet_address: walletAddress
      });

      if (error) throw error;
      setPlatforms(data || []);
    } catch (error) {
      console.error('Error fetching platforms:', error);
      toast({
        title: "Error fetching platforms",
        description: "Failed to load your connected social platforms",
        variant: "destructive",
      });
    }
  };

  const fetchPosts = async () => {
    if (!walletAddress) {
      setPosts([]);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('get_feed_by_wallet', {
        p_wallet_address: walletAddress,
        p_limit: 50
      });

      if (error) throw error;
      
      const formattedPosts: SocialPost[] = data?.map(post => ({
        id: post.id,
        platform_post_id: post.platform_post_id,
        content: post.content || undefined,
        media_urls: Array.isArray(post.media_urls) ? post.media_urls as string[] : [],
        engagement_metrics: (post.engagement_metrics as Record<string, any>) || {},
        posted_at: post.posted_at || undefined,
        platform_name: post.platform_name,
        platform_username: post.platform_username || undefined,
      })) || [];
      
      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error fetching posts",
        description: "Failed to load your social media posts",
        variant: "destructive",
      });
    }
  };

  const connectPlatform = async (platformName: string, username?: string) => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first to use social platforms",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('social_platforms')
        .insert({
          platform_name: platformName,
          platform_username: username,
          is_connected: true,
          wallet_address: walletAddress,
        })
        .select()
        .single();

      if (error) throw error;

      setPlatforms(prev => [...prev, data]);
      toast({
        title: "Platform Connected!",
        description: `Successfully connected to ${platformName}`,
      });

      // Trigger initial sync
      await syncPlatform(data.id);
    } catch (error) {
      console.error('Error connecting platform:', error);
      toast({
        title: "Connection Failed",
        description: `Failed to connect to ${platformName}`,
        variant: "destructive",
      });
    }
  };

  const syncPlatform = async (platformId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('social-scraper', {
        body: { 
          action: 'scrape',
          platformId 
        }
      });

      if (error) throw error;

      toast({
        title: "Sync Started",
        description: "Your social media feeds are being synchronized",
      });

      // Refresh data after sync
      setTimeout(() => {
        fetchPosts();
        fetchPlatforms();
      }, 2000);
    } catch (error) {
      console.error('Error syncing platform:', error);
      toast({
        title: "Sync Failed",
        description: "Failed to synchronize your social media feeds",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchPlatforms(), fetchPosts()]);
      setIsLoading(false);
    };

    if (walletAddress) {
      loadData();
    } else {
      setIsLoading(false);
      setPlatforms([]);
      setPosts([]);
    }
  }, [walletAddress]);

  return {
    platforms,
    posts,
    isLoading,
    connectPlatform,
    syncPlatform,
    refreshData: () => Promise.all([fetchPlatforms(), fetchPosts()])
  };
};
