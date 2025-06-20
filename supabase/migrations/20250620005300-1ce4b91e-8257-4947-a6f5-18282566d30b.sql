
-- Create tables for storing social media feeds and posts
CREATE TABLE public.social_platforms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  platform_name VARCHAR(50) NOT NULL,
  platform_username VARCHAR(100),
  is_connected BOOLEAN DEFAULT false,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for storing social media posts
CREATE TABLE public.social_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform_id UUID REFERENCES public.social_platforms(id) ON DELETE CASCADE,
  platform_post_id VARCHAR(255) NOT NULL,
  content TEXT,
  media_urls JSONB DEFAULT '[]'::jsonb,
  engagement_metrics JSONB DEFAULT '{}'::jsonb,
  posted_at TIMESTAMP WITH TIME ZONE,
  fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(platform_id, platform_post_id)
);

-- Add RLS policies for social_platforms
ALTER TABLE public.social_platforms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own platforms" 
  ON public.social_platforms 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own platforms" 
  ON public.social_platforms 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own platforms" 
  ON public.social_platforms 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own platforms" 
  ON public.social_platforms 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for social_posts
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view posts from their platforms" 
  ON public.social_posts 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.social_platforms 
      WHERE social_platforms.id = social_posts.platform_id 
      AND social_platforms.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_social_platforms_user_id ON public.social_platforms(user_id);
CREATE INDEX idx_social_platforms_platform_name ON public.social_platforms(platform_name);
CREATE INDEX idx_social_posts_platform_id ON public.social_posts(platform_id);
CREATE INDEX idx_social_posts_posted_at ON public.social_posts(posted_at DESC);
