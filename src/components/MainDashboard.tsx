
import ProfileStats from "@/components/ProfileStats";
import UnifiedFeed from "@/components/UnifiedFeed";
import RealSocialFeedCard from "@/components/RealSocialFeedCard";
import QuickActions from "@/components/QuickActions";
import AnalyticsPreview from "@/components/AnalyticsPreview";

interface Platform {
  id: string;
  platform_name: string;
  platform_username?: string;
  is_connected: boolean;
  last_sync_at?: string;
}

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

interface MainDashboardProps {
  walletAddress: string;
  platforms: Platform[];
  posts: SocialPost[];
  isLoading: boolean;
  availablePlatforms: Array<{ name: string; username: string }>;
  handleConnectPlatform: (platformName: string) => Promise<void>;
  isPlatformConnected: (platformName: string) => boolean;
  getPlatformUsername: (platformName: string) => string | undefined;
  syncPlatform: (platformId: string) => void;
  refreshData: () => void;
}

const MainDashboard = ({
  walletAddress,
  platforms,
  posts,
  isLoading,
  availablePlatforms,
  handleConnectPlatform,
  isPlatformConnected,
  getPlatformUsername,
  syncPlatform,
  refreshData
}: MainDashboardProps) => {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Profile Stats */}
      <ProfileStats walletAddress={walletAddress} />

      {/* Quick Actions */}
      <QuickActions
        availablePlatforms={availablePlatforms}
        handleConnectPlatform={handleConnectPlatform}
        isPlatformConnected={isPlatformConnected}
        refreshData={refreshData}
        isLoading={isLoading}
      />

      {/* Unified Social Feed */}
      <UnifiedFeed userId={walletAddress} />

      {/* Social Feeds Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {availablePlatforms.map((platform) => (
          <RealSocialFeedCard
            key={platform.name}
            posts={posts}
            platformName={platform.name}
            username={getPlatformUsername(platform.name)}
            isConnected={isPlatformConnected(platform.name)}
            onSync={() => {
              const connectedPlatform = platforms.find(p => 
                p.platform_name.toLowerCase() === platform.name.toLowerCase()
              );
              if (connectedPlatform) {
                syncPlatform(connectedPlatform.id);
              }
            }}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* Analytics Preview */}
      <AnalyticsPreview platforms={platforms} posts={posts} />
    </div>
  );
};

export default MainDashboard;
