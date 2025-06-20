
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { platformId } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Syncing social feeds for platform:', platformId);

    // Get the specific platform
    const { data: platform, error: platformError } = await supabaseClient
      .from('social_platforms')
      .select('*')
      .eq('id', platformId)
      .single();

    if (platformError) {
      throw platformError;
    }

    // Call the social-scraper function to scrape this specific platform
    const { data, error } = await supabaseClient.functions.invoke('social-scraper', {
      body: { action: 'scrape', platformId: platformId }
    });

    if (error) {
      throw error;
    }

    // Update the platform's last sync time
    await supabaseClient
      .from('social_platforms')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', platformId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully synced ${platform.platform_name}`,
        data: data 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error syncing social feeds:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
