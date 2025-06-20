
-- First, let's update the social_platforms table to work with Web3 authentication
-- Add wallet_address column to link platforms to Web3 users
ALTER TABLE public.social_platforms 
ADD COLUMN wallet_address TEXT;

-- Create index for better performance
CREATE INDEX idx_social_platforms_wallet_address ON public.social_platforms(wallet_address);

-- Update the social_posts table to add a unique constraint that prevents duplicates
-- This will help with the upsert operations in the scraper
ALTER TABLE public.social_posts 
ADD CONSTRAINT unique_platform_post UNIQUE (platform_id, platform_post_id);

-- Create a function to get platforms by wallet address for Web3 users
CREATE OR REPLACE FUNCTION public.get_platforms_by_wallet(p_wallet_address TEXT)
RETURNS TABLE (
  id UUID,
  platform_name CHARACTER VARYING,
  platform_username CHARACTER VARYING,
  is_connected BOOLEAN,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sp.id,
    sp.platform_name,
    sp.platform_username,
    sp.is_connected,
    sp.last_sync_at,
    sp.created_at,
    sp.updated_at
  FROM public.social_platforms sp
  WHERE sp.wallet_address = p_wallet_address
    AND sp.is_connected = true;
END;
$$;

-- Create a function to get feed by wallet address
CREATE OR REPLACE FUNCTION public.get_feed_by_wallet(
  p_wallet_address TEXT,
  p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  platform_post_id CHARACTER VARYING,
  content TEXT,
  media_urls JSONB,
  engagement_metrics JSONB,
  posted_at TIMESTAMP WITH TIME ZONE,
  fetched_at TIMESTAMP WITH TIME ZONE,
  platform_name CHARACTER VARYING,
  platform_username CHARACTER VARYING
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sp.id,
    sp.platform_post_id,
    sp.content,
    sp.media_urls,
    sp.engagement_metrics,
    sp.posted_at,
    sp.fetched_at,
    spl.platform_name,
    spl.platform_username
  FROM public.social_posts sp
  INNER JOIN public.social_platforms spl ON sp.platform_id = spl.id
  WHERE spl.wallet_address = p_wallet_address
    AND spl.is_connected = true
  ORDER BY sp.posted_at DESC NULLS LAST, sp.fetched_at DESC
  LIMIT p_limit;
END;
$$;
