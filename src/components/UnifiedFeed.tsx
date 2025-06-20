
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RefreshCw, Heart, MessageCircle, Repeat2, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useSocialFeed } from "@/hooks/useSocialFeed";

interface UnifiedFeedProps {
  userId?: string;
  className?: string;
}

const getPlatformColor = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'twitter':
    case 'x':
      return 'bg-blue-500';
    case 'linkedin':
      return 'bg-blue-700';
    case 'discord':
      return 'bg-indigo-500';
    case 'ghost':
      return 'bg-gray-700';
    default:
      return 'bg-cyan-500';
  }
};

const UnifiedFeed = ({ userId, className = "" }: UnifiedFeedProps) => {
  const { posts, isLoading, fetchFeed, triggerScrape } = useSocialFeed(userId);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Unified Social Feed</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchFeed}
            disabled={isLoading}
            className="border-cyan-300 hover:bg-cyan-50"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={triggerScrape}
            className="autheo-gradient hover:opacity-90 text-white"
            size="sm"
          >
            Update Feed
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="text-slate-500 mt-2">Loading your social feed...</p>
        </div>
      ) : posts.length === 0 ? (
        <Card className="bg-white/70 backdrop-blur-sm border-cyan-200/50">
          <CardContent className="text-center py-8">
            <p className="text-slate-500">No posts found in your feed</p>
            <p className="text-slate-400 text-sm mt-1">
              Connect your social platforms and update your feed to see posts here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="bg-white/70 backdrop-blur-sm border-cyan-200/50 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={`${getPlatformColor(post.social_platforms.platform_name)} text-white`}>
                        {post.social_platforms.platform_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">
                          @{post.social_platforms.platform_username || 'unknown'}
                        </span>
                        <Badge variant="outline" className={`border-current text-xs ${getPlatformColor(post.social_platforms.platform_name)} text-white border-0`}>
                          {post.social_platforms.platform_name}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500">
                        {post.posted_at 
                          ? formatDistanceToNow(new Date(post.posted_at), { addSuffix: true })
                          : 'Unknown time'
                        }
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {post.content && (
                  <p className="text-slate-700 leading-relaxed">
                    {post.content}
                  </p>
                )}
                
                {post.media_urls.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {post.media_urls.slice(0, 4).map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt="Post media"
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                    ))}
                    {post.media_urls.length > 4 && (
                      <div className="w-full h-32 bg-slate-100 rounded-lg border flex items-center justify-center">
                        <span className="text-slate-500">
                          +{post.media_urls.length - 4} more
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    {post.engagement_metrics.likes && (
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{post.engagement_metrics.likes}</span>
                      </div>
                    )}
                    {post.engagement_metrics.comments && (
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.engagement_metrics.comments}</span>
                      </div>
                    )}
                    {(post.engagement_metrics.shares || post.engagement_metrics.retweets) && (
                      <div className="flex items-center gap-1">
                        <Repeat2 className="h-4 w-4" />
                        <span>{post.engagement_metrics.shares || post.engagement_metrics.retweets}</span>
                      </div>
                    )}
                    {post.engagement_metrics.reactions && (
                      <div className="flex items-center gap-1">
                        <span>👍</span>
                        <span>{post.engagement_metrics.reactions}</span>
                      </div>
                    )}
                    {post.engagement_metrics.reading_time && (
                      <div className="flex items-center gap-1">
                        <span>📖</span>
                        <span>{post.engagement_metrics.reading_time} min read</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">
                    Fetched {formatDistanceToNow(new Date(post.fetched_at), { addSuffix: true })}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UnifiedFeed;
