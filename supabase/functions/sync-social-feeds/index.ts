
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { platformId } = await req.json();
    
    console.log('Starting sync for platform:', platformId);

    // Get platform details
    const { data: platform, error: platformError } = await supabase
      .from('social_platforms')
      .select('*')
      .eq('id', platformId)
      .single();

    if (platformError || !platform) {
      console.error('Platform not found:', platformError);
      return new Response(
        JSON.stringify({ error: 'Platform not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mock data for demonstration - replace with actual API calls to your backend
    const mockPosts = [
      {
        platform_post_id: `${platform.platform_name}_${Date.now()}_1`,
        content: `Latest update from ${platform.platform_name}! Building amazing Web3 experiences. 🚀`,
        media_urls: [],
        engagement_metrics: {
          likes: Math.floor(Math.random() * 100) + 10,
          comments: Math.floor(Math.random() * 20) + 1,
          shares: Math.floor(Math.random() * 10) + 1,
        },
        posted_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        platform_post_id: `${platform.platform_name}_${Date.now()}_2`,
        content: `Excited to share our progress on decentralized social media! The future is here. 💪`,
        media_urls: [],
        engagement_metrics: {
          likes: Math.floor(Math.random() * 150) + 20,
          comments: Math.floor(Math.random() * 30) + 5,
          shares: Math.floor(Math.random() * 15) + 2,
        },
        posted_at: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000).toISOString(),
      },
      {
        platform_post_id: `${platform.platform_name}_${Date.now()}_3`,
        content: `Web3 social aggregation is revolutionizing how we connect across platforms! 🌐`,
        media_urls: [],
        engagement_metrics: {
          likes: Math.floor(Math.random() * 200) + 50,
          comments: Math.floor(Math.random() * 40) + 10,
          shares: Math.floor(Math.random() * 25) + 5,
        },
        posted_at: new Date(Date.now() - Math.random() * 72 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // Insert posts (with conflict resolution)
    const postsToInsert = mockPosts.map(post => ({
      ...post,
      platform_id: platformId,
    }));

    const { data: insertedPosts, error: insertError } = await supabase
      .from('social_posts')
      .upsert(postsToInsert, { 
        onConflict: 'platform_id,platform_post_id',
        ignoreDuplicates: false 
      })
      .select();

    if (insertError) {
      console.error('Error inserting posts:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to sync posts' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update platform last_sync_at
    const { error: updateError } = await supabase
      .from('social_platforms')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', platformId);

    if (updateError) {
      console.error('Error updating platform sync time:', updateError);
    }

    console.log(`Successfully synced ${insertedPosts?.length || 0} posts for platform ${platformId}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        synced_posts: insertedPosts?.length || 0,
        message: 'Social feeds synchronized successfully'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in sync-social-feeds function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
