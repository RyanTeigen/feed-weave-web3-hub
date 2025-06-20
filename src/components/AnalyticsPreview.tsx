
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface AnalyticsPreviewProps {
  platforms: Array<{
    is_connected: boolean;
    last_sync_at?: string;
  }>;
  posts: Array<{
    engagement_metrics: {
      likes?: number;
      comments?: number;
      shares?: number;
    };
  }>;
}

const AnalyticsPreview = ({ platforms, posts }: AnalyticsPreviewProps) => {
  const getTotalEngagement = () => {
    return posts.reduce((total, post) => {
      const metrics = post.engagement_metrics;
      return total + (metrics.likes || 0) + (metrics.comments || 0) + (metrics.shares || 0);
    }, 0);
  };

  return (
    <Card className="autheo-gradient shadow-lg">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Engagement Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {platforms.filter(p => p.is_connected).length}
            </div>
            <div className="text-sm text-white/80">Connected Platforms</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{posts.length}</div>
            <div className="text-sm text-white/80">Total Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{getTotalEngagement()}</div>
            <div className="text-sm text-white/80">Total Engagement</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {platforms.filter(p => p.last_sync_at).length}
            </div>
            <div className="text-sm text-white/80">Recently Synced</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsPreview;
