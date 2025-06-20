
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, Heart, MessageCircle, Repeat, Users } from "lucide-react";

interface SocialFeedCardProps {
  feed: {
    platform: string;
    username?: string;
    serverName?: string;
    followers?: string;
    members?: string;
    posts?: Array<{
      content?: string;
      imageUrl?: string;
      caption?: string;
      timestamp: string;
      engagement?: {
        likes: number;
        retweets?: number;
        comments: number;
      };
    }>;
    recentActivity?: Array<{
      user: string;
      message: string;
      timestamp: string;
    }>;
  };
}

const SocialFeedCard = ({ feed }: SocialFeedCardProps) => {
  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter':
        return 'border-blue-400/30 bg-blue-500/10';
      case 'discord':
        return 'border-indigo-400/30 bg-indigo-500/10';
      case 'instagram':
        return 'border-pink-400/30 bg-pink-500/10';
      default:
        return 'border-purple-400/30 bg-purple-500/10';
    }
  };

  const getPlatformIcon = (platform: string) => {
    // Using placeholder icons since we're limited in lucide-react icons
    return <div className="w-5 h-5 bg-current rounded-full opacity-80"></div>;
  };

  return (
    <Card className={`${getPlatformColor(feed.platform)} backdrop-blur-sm transition-all hover:scale-105`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            {getPlatformIcon(feed.platform)}
            <span>{feed.platform}</span>
          </div>
          <Button size="sm" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </CardTitle>
        
        <div className="flex items-center justify-between">
          <div className="text-slate-300">
            {feed.username && <span>@{feed.username.replace('@', '')}</span>}
            {feed.serverName && <span>{feed.serverName}</span>}
          </div>
          <Badge variant="outline" className="border-current/30">
            {feed.followers && (
              <>
                <Users className="h-3 w-3 mr-1" />
                {feed.followers}
              </>
            )}
            {feed.members && (
              <>
                <Users className="h-3 w-3 mr-1" />
                {feed.members}
              </>
            )}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Posts */}
        {feed.posts?.map((post, index) => (
          <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
            {post.imageUrl && (
              <div className="mb-3">
                <img
                  src={post.imageUrl}
                  alt="Post content"
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            )}
            
            <p className="text-white text-sm mb-3">
              {post.content || post.caption}
            </p>
            
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{post.timestamp}</span>
              
              {post.engagement && (
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {post.engagement.likes}
                  </span>
                  {post.engagement.retweets && (
                    <span className="flex items-center gap-1">
                      <Repeat className="h-3 w-3" />
                      {post.engagement.retweets}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {post.engagement.comments}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Discord Activity */}
        {feed.recentActivity?.map((activity, index) => (
          <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-start gap-3">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs bg-indigo-500">
                  {activity.user.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-indigo-300 text-sm font-medium">{activity.user}</span>
                  <span className="text-slate-500 text-xs">{activity.timestamp}</span>
                </div>
                <p className="text-white text-sm">{activity.message}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SocialFeedCard;
