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

interface IngestPostData {
  platform: string;
  platform_post_id: string;
  content?: string;
  media_urls?: string[];
  engagement_metrics?: Record<string, any>;
  posted_at?: string;
  author_username?: string;
  author_id?: string;
  metadata?: Record<string, any>;
}

interface IngestRequest {
  posts: IngestPostData[];
  user_id?: string;
  platform_config?: {
    platform_name: string;
    platform_username?: string;
    auto_create?: boolean;
  };
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
    const pathname = url.pathname;

    // Handle the new /ingest endpoint
    if (pathname.endsWith('/ingest')) {
      return await handleIngestEndpoint(req, supabaseClient);
    }

    // Handle existing scrape and feed endpoints
    const body = await req.json();
    const { action, platformId, user_id, limit } = body;

    if (action === 'scrape') {
      console.log('Starting social media scraping...');
      
      let platformsQuery = supabaseClient
        .from('social_platforms')
        .select('*')
        .eq('is_connected', true);

      // If platformId is specified, filter to that specific platform
      if (platformId) {
        platformsQuery = platformsQuery.eq('id', platformId);
      }

      const { data: platforms, error: platformsError } = await platformsQuery;

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
      const feedLimit = limit || 50;

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
        .limit(feedLimit);

      // Filter by user if specified
      if (user_id) {
        query = query.eq('social_platforms.user_id', user_id);
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

async function handleIngestEndpoint(req: Request, supabaseClient: any) {
  try {
    const ingestData: IngestRequest = await req.json();
    
    // Validate request structure
    if (!ingestData.posts || !Array.isArray(ingestData.posts) || ingestData.posts.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request: posts array is required and must not be empty' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    console.log(`Processing ${ingestData.posts.length} posts for ingestion`);

    let platformId: string | null = null;

    // Handle platform creation/lookup if platform_config is provided
    if (ingestData.platform_config) {
      const config = ingestData.platform_config;
      
      // Try to find existing platform
      const { data: existingPlatform } = await supabaseClient
        .from('social_platforms')
        .select('id')
        .eq('platform_name', config.platform_name)
        .eq('user_id', ingestData.user_id || 'system')
        .maybeSingle();

      if (existingPlatform) {
        platformId = existingPlatform.id;
        console.log(`Using existing platform: ${platformId}`);
      } else if (config.auto_create) {
        // Create new platform
        const { data: newPlatform, error: platformError } = await supabaseClient
          .from('social_platforms')
          .insert({
            platform_name: config.platform_name,
            platform_username: config.platform_username,
            user_id: ingestData.user_id || 'system',
            is_connected: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select('id')
          .single();

        if (platformError) {
          console.error('Error creating platform:', platformError);
          return new Response(
            JSON.stringify({ 
              error: 'Failed to create platform',
              details: platformError.message 
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 500 
            }
          );
        }

        platformId = newPlatform.id;
        console.log(`Created new platform: ${platformId}`);
      }
    }

    // Process and validate posts
    const processedPosts = [];
    const errors = [];

    for (let i = 0; i < ingestData.posts.length; i++) {
      const post = ingestData.posts[i];
      
      try {
        // Validate required fields
        if (!post.platform || !post.platform_post_id) {
          errors.push({
            index: i,
            error: 'Missing required fields: platform and platform_post_id'
          });
          continue;
        }

        // Process the post
        const processedPost = {
          platform_id: platformId,
          platform_post_id: post.platform_post_id,
          content: post.content || null,
          media_urls: Array.isArray(post.media_urls) ? post.media_urls : [],
          engagement_metrics: post.engagement_metrics || {},
          posted_at: post.posted_at ? new Date(post.posted_at).toISOString() : new Date().toISOString(),
          fetched_at: new Date().toISOString()
        };

        processedPosts.push(processedPost);
      } catch (error) {
        errors.push({
          index: i,
          error: `Processing error: ${error.message}`
        });
      }
    }

    if (processedPosts.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'No valid posts to process',
          validation_errors: errors
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Insert posts into database
    const { data: insertedPosts, error: insertError } = await supabaseClient
      .from('social_posts')
      .upsert(processedPosts, { 
        onConflict: 'platform_id,platform_post_id',
        ignoreDuplicates: false 
      })
      .select('id, platform_post_id');

    if (insertError) {
      console.error('Error inserting posts:', insertError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to insert posts',
          details: insertError.message 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    // Update platform sync time if platform was used
    if (platformId) {
      await supabaseClient
        .from('social_platforms')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('id', platformId);
    }

    const response = {
      success: true,
      message: `Successfully processed ${processedPosts.length} posts`,
      inserted_count: insertedPosts?.length || 0,
      processed_count: processedPosts.length,
      total_submitted: ingestData.posts.length,
      platform_id: platformId,
      validation_errors: errors.length > 0 ? errors : undefined
    };

    console.log('Ingestion completed:', response);

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in ingest endpoint:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
}

async function scrapePlatform(platform: any): Promise<ScrapedPost[]> {
  switch (platform.platform_name.toLowerCase()) {
    case 'twitter':
    case 'x':
      return await scrapeTwitter(platform);
    case 'linkedin':
      return await scrapeLinkedIn(platform);
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
  console.log(`Scraping Twitter for ${platform.platform_username}`);
  
  // Twitter API v2 implementation
  const bearerToken = Deno.env.get('TWITTER_BEARER_TOKEN');
  if (!bearerToken) {
    console.error('Twitter Bearer Token not configured');
    return [];
  }

  try {
    // Get user ID first
    const userResponse = await fetch(
      `https://api.twitter.com/2/users/by/username/${platform.platform_username}`,
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!userResponse.ok) {
      console.error('Failed to fetch Twitter user:', await userResponse.text());
      return [];
    }

    const userData = await userResponse.json();
    const userId = userData.data?.id;

    if (!userId) {
      console.error('User ID not found for Twitter username:', platform.platform_username);
      return [];
    }

    // Fetch user's tweets
    const tweetsResponse = await fetch(
      `https://api.twitter.com/2/users/${userId}/tweets?max_results=10&tweet.fields=created_at,public_metrics,attachments&expansions=attachments.media_keys&media.fields=url,preview_image_url`,
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!tweetsResponse.ok) {
      console.error('Failed to fetch tweets:', await tweetsResponse.text());
      return [];
    }

    const tweetsData = await tweetsResponse.json();
    const tweets = tweetsData.data || [];
    const media = tweetsData.includes?.media || [];

    return tweets.map((tweet: any) => {
      const tweetMedia = tweet.attachments?.media_keys
        ? tweet.attachments.media_keys.map((key: string) => {
            const mediaItem = media.find((m: any) => m.media_key === key);
            return mediaItem?.url || mediaItem?.preview_image_url;
          }).filter(Boolean)
        : [];

      return {
        source: 'twitter',
        external_id: tweet.id,
        author: platform.platform_username,
        content: tweet.text,
        url: `https://twitter.com/${platform.platform_username}/status/${tweet.id}`,
        timestamp: tweet.created_at,
        engagement_metrics: {
          likes: tweet.public_metrics?.like_count || 0,
          retweets: tweet.public_metrics?.retweet_count || 0,
          comments: tweet.public_metrics?.reply_count || 0,
          quotes: tweet.public_metrics?.quote_count || 0,
        },
        media_urls: tweetMedia,
      };
    });
  } catch (error) {
    console.error('Error scraping Twitter:', error);
    return [];
  }
}

async function scrapeLinkedIn(platform: any): Promise<ScrapedPost[]> {
  console.log(`Scraping LinkedIn for ${platform.platform_username}`);
  
  // LinkedIn API implementation
  const accessToken = Deno.env.get('LINKEDIN_ACCESS_TOKEN');
  if (!accessToken) {
    console.error('LinkedIn Access Token not configured');
    return [];
  }

  try {
    // Get user profile first
    const profileResponse = await fetch(
      'https://api.linkedin.com/v2/people/~:(id,firstName,lastName)',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!profileResponse.ok) {
      console.error('Failed to fetch LinkedIn profile:', await profileResponse.text());
      return [];
    }

    const profileData = await profileResponse.json();
    const personId = profileData.id;

    // Fetch user's posts (shares)
    const postsResponse = await fetch(
      `https://api.linkedin.com/v2/shares?q=owners&owners=urn:li:person:${personId}&count=10&sortBy=CREATED_TIME`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!postsResponse.ok) {
      console.error('Failed to fetch LinkedIn posts:', await postsResponse.text());
      return [];
    }

    const postsData = await postsResponse.json();
    const posts = postsData.elements || [];

    return posts.map((post: any) => ({
      source: 'linkedin',
      external_id: post.id,
      author: platform.platform_username,
      content: post.text?.text || '',
      url: `https://www.linkedin.com/feed/update/${post.id}`,
      timestamp: new Date(post.created?.time || Date.now()).toISOString(),
      engagement_metrics: {
        likes: post.totalSocialActivityCounts?.numLikes || 0,
        comments: post.totalSocialActivityCounts?.numComments || 0,
        shares: post.totalSocialActivityCounts?.numShares || 0,
      },
      media_urls: [],
    }));
  } catch (error) {
    console.error('Error scraping LinkedIn:', error);
    return [];
  }
}

async function scrapeDiscord(platform: any): Promise<ScrapedPost[]> {
  console.log(`Scraping Discord for ${platform.platform_username}`);
  
  // Discord Bot API implementation
  const botToken = Deno.env.get('DISCORD_BOT_TOKEN');
  const channelId = Deno.env.get('DISCORD_CHANNEL_ID');
  
  if (!botToken || !channelId) {
    console.error('Discord Bot Token or Channel ID not configured');
    return [];
  }

  try {
    const response = await fetch(
      `https://discord.com/api/v10/channels/${channelId}/messages?limit=10`,
      {
        headers: {
          'Authorization': `Bot ${botToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch Discord messages:', await response.text());
      return [];
    }

    const messages = await response.json();

    return messages.map((message: any) => ({
      source: 'discord',
      external_id: message.id,
      author: message.author.username,
      content: message.content,
      url: `https://discord.com/channels/${message.guild_id || '@me'}/${channelId}/${message.id}`,
      timestamp: message.timestamp,
      engagement_metrics: {
        reactions: message.reactions?.length || 0,
      },
      media_urls: message.attachments?.map((att: any) => att.url) || [],
    }));
  } catch (error) {
    console.error('Error scraping Discord:', error);
    return [];
  }
}

async function scrapeGhost(platform: any): Promise<ScrapedPost[]> {
  console.log(`Scraping Ghost for ${platform.platform_username}`);
  
  // Ghost Content API implementation
  const ghostUrl = Deno.env.get('GHOST_BLOG_URL');
  const contentApiKey = Deno.env.get('GHOST_CONTENT_API_KEY');
  
  if (!ghostUrl || !contentApiKey) {
    console.error('Ghost Blog URL or Content API Key not configured');
    return [];
  }

  try {
    const response = await fetch(
      `${ghostUrl}/ghost/api/v3/content/posts/?key=${contentApiKey}&limit=10&include=tags,authors`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch Ghost posts:', await response.text());
      return [];
    }

    const data = await response.json();
    const posts = data.posts || [];

    return posts.map((post: any) => ({
      source: 'ghost',
      external_id: post.id,
      author: post.authors?.[0]?.name || platform.platform_username,
      content: post.excerpt || post.custom_excerpt || '',
      url: post.url,
      timestamp: post.published_at,
      engagement_metrics: {
        reading_time: post.reading_time || 0,
      },
      media_urls: post.feature_image ? [post.feature_image] : [],
    }));
  } catch (error) {
    console.error('Error scraping Ghost:', error);
    return [];
  }
}
