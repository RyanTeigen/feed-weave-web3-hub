
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ScrapedPost {
  source: string;
  external_id: string;
  author: string;
  content: string;
  url: string;
  timestamp: string;
  engagement_metrics?: Record<string, any>;
  media_urls?: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    if (action === 'scrape') {
      console.log('Starting social media scraping...');
      
      // Get all connected platforms for all users
      const { data: platforms, error: platformsError } = await supabaseClient
        .from('social_platforms')
        .select('*')
        .eq('is_connected', true);

      if (platformsError) {
        throw platformsError;
      }

      let totalScraped = 0;

      for (const platform of platforms || []) {
        try {
          const scrapedPosts = await scrapePlatform(platform);
          
          if (scrapedPosts.length > 0) {
            // Convert scraped posts to our database format
            const postsToInsert = scrapedPosts.map(post => ({
              platform_id: platform.id,
              platform_post_id: post.external_id,
              content: post.content,
              media_urls: post.media_urls || [],
              engagement_metrics: post.engagement_metrics || {},
              posted_at: post.timestamp,
              fetched_at: new Date().toISOString()
            }));

            // Insert posts (will skip duplicates due to unique constraint)
            const { error: insertError } = await supabaseClient
              .from('social_posts')
              .upsert(postsToInsert, { 
                onConflict: 'platform_id,platform_post_id',
                ignoreDuplicates: true 
              });

            if (insertError) {
              console.error(`Error inserting posts for ${platform.platform_name}:`, insertError);
            } else {
              totalScraped += postsToInsert.length;
              console.log(`Scraped ${postsToInsert.length} posts from ${platform.platform_name}`);
            }

            // Update last sync time
            await supabaseClient
              .from('social_platforms')
              .update({ last_sync_at: new Date().toISOString() })
              .eq('id', platform.id);
          }
        } catch (error) {
          console.error(`Error scraping ${platform.platform_name}:`, error);
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Scraped ${totalScraped} posts from ${platforms?.length || 0} platforms` 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    if (action === 'feed') {
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const userId = url.searchParams.get('user_id');

      let query = supabaseClient
        .from('social_posts')
        .select(`
          *,
          social_platforms!inner(
            platform_name,
            platform_username,
            user_id
          )
        `)
        .order('posted_at', { ascending: false })
        .limit(limit);

      // Filter by user if specified
      if (userId) {
        query = query.eq('social_platforms.user_id', userId);
      }

      const { data: posts, error } = await query;

      if (error) {
        throw error;
      }

      return new Response(
        JSON.stringify(posts || []),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action parameter' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );

  } catch (error) {
    console.error('Error in social-scraper function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

// Mock scraping functions (replace with actual scraping logic)
async function scrapePlatform(platform: any): Promise<ScrapedPost[]> {
  const posts: ScrapedPost[] = [];
  
  switch (platform.platform_name.toLowerCase()) {
    case 'twitter':
    case 'x':
      return await scrapeTwitter(platform);
    case 'linkedin':
      return await scrapeLinkedIn(platform);
    case 'instagram':
      return await scrapeInstagram(platform);
    case 'discord':
      return await scrapeDiscord(platform);
    case 'ghost':
      return await scrapeGhost(platform);
    default:
      console.log(`No scraper implemented for ${platform.platform_name}`);
      return [];
  }
}

async function scrapeTwitter(platform: any): Promise<ScrapedPost[]> {
  // Mock implementation - replace with actual Twitter API calls
  console.log(`Scraping Twitter for ${platform.platform_username}`);
  
  // For now, return mock data
  return [
    {
      source: 'twitter',
      external_id: `tweet_${Date.now()}`,
      author: platform.platform_username || 'user',
      content: `Mock Twitter post from ${platform.platform_username}`,
      url: `https://twitter.com/${platform.platform_username}/status/${Date.now()}`,
      timestamp: new Date().toISOString(),
      engagement_metrics: {
        likes: Math.floor(Math.random() * 100),
        retweets: Math.floor(Math.random() * 50),
        comments: Math.floor(Math.random() * 20)
      }
    }
  ];
}

async function scrapeLinkedIn(platform: any): Promise<ScrapedPost[]> {
  console.log(`Scraping LinkedIn for ${platform.platform_username}`);
  return [];
}

async function scrapeInstagram(platform: any): Promise<ScrapedPost[]> {
  console.log(`Scraping Instagram for ${platform.platform_username}`);
  return [];
}

async function scrapeDiscord(platform: any): Promise<ScrapedPost[]> {
  console.log(`Scraping Discord for ${platform.platform_username}`);
  return [];
}

async function scrapeGhost(platform: any): Promise<ScrapedPost[]> {
  console.log(`Scraping Ghost for ${platform.platform_username}`);
  return [];
}
