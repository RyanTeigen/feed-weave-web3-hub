
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, Heart, MessageCircle, Repeat2, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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

interface RealSocialFeedCardProps {
  posts: SocialPost[];
  platformName: string;
  username?: string;
  isConnected: boolean;
  onSync: () => void;
  isLoading?: boolean;
}

const getPlatformColor = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'twitter':
    case 'x':
      return 'bg-blue-50 border-blue-200 text-blue-700';
    case 'linkedin':
      return 'bg-blue-50 border-blue-300 text-blue-800';
    case 'instagram':
      return 'bg-pink-50 border-pink-200 text-pink-700';
    case 'discord':
      return 'bg-indigo-50 border-indigo-200 text-indigo-700';
    case 'ghost':
      return 'bg-gray-50 border-gray-200 text-gray-700';
    default:
      return 'bg-cyan-50 border-cyan-200 text-cyan-700';
  }
};

const getPlatformIcon = (platform: string) => {
  // You can replace these with actual platform icons
  return platform.charAt(0).toUpperCase();
};

const RealSocialFeedCard = ({ 
  posts, 
  platformName, 
  username, 
  isConnected, 
  onSync, 
  isLoading 
}: RealSocialFeedCardProps) => {
  const platformPosts = posts.filter(post => 
    post.platform_name.toLowerCase() === platformName.toLowerCase()
  );

  if (!isConnected) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-cyan-200/50 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-cyan-300">
                <AvatarFallback className="autheo-gradient text-white text-sm">
                  {getPlatformIcon(platformName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg text-slate-800">{platformName}</CardTitle>
                <p className="text-sm text-slate-500">Not connected</p>
              </div>
            </div>
            <Badge variant="outline" className="border-gray-300 text-gray-600 bg-gray-50">
              Disconnected
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 text-sm mb-4">
            Connect your {platformName} account to see your latest posts and engagement metrics.
          </p>
          <Button 
            className="w-full autheo-gradient hover:opacity-90 text-white"
            disabled
          >
            Connect {platformName}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-cyan-200/50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-cyan-300">
              <AvatarFallback className="autheo-gradient text-white text-sm">
                {getPlatformIcon(platformName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg text-slate-800">{platformName}</CardTitle>
              <p className="text-sm text-slate-500">@{username}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getPlatformColor(platformName)}>
              <div className="w-2 h-2 bg-current rounded-full mr-1"></div>
              Connected
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSync}
              disabled={isLoading}
              className="text-slate-600 hover:text-slate-800"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {platformPosts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 text-sm">No posts found</p>
            <p className="text-slate-400 text-xs mt-1">
              Try syncing your account to fetch the latest posts
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {platformPosts.slice(0, 3).map((post) => (
              <div key={post.id} className="border-b border-slate-200 pb-4 last:border-b-0">
                <div className="space-y-2">
                  {post.content && (
                    <p className="text-sm text-slate-700 line-clamp-3">
                      {post.content}
                    </p>
                  )}
                  
                  {post.media_urls.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {post.media_urls.slice(0, 2).map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt="Post media"
                          className="w-16 h-16 object-cover rounded border"
                        />
                      ))}
                      {post.media_urls.length > 2 && (
                        <div className="w-16 h-16 bg-slate-100 rounded border flex items-center justify-center">
                          <span className="text-xs text-slate-500">
                            +{post.media_urls.length - 2}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {post.posted_at 
                        ? formatDistanceToNow(new Date(post.posted_at), { addSuffix: true })
                        : 'Unknown time'
                      }
                    </span>
                    <div className="flex items-center gap-3">
                      {post.engagement_metrics.likes && (
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          <span>{post.engagement_metrics.likes}</span>
                        </div>
                      )}
                      {post.engagement_metrics.comments && (
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          <span>{post.engagement_metrics.comments}</span>
                        </div>
                      )}
                      {post.engagement_metrics.shares && (
                        <div className="flex items-center gap-1">
                          <Repeat2 className="h-3 w-3" />
                          <span>{post.engagement_metrics.shares}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {platformPosts.length > 3 && (
          <Button variant="outline" className="w-full border-cyan-300 hover:bg-cyan-50 text-slate-700">
            <ExternalLink className="h-4 w-4 mr-2" />
            View All Posts ({platformPosts.length})
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default RealSocialFeedCard;
