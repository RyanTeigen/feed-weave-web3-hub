import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Wallet, Plus, ExternalLink, Settings, TrendingUp, Menu, RefreshCw } from "lucide-react";
import ConnectWallet from "@/components/ConnectWallet";
import ProfileStats from "@/components/ProfileStats";
import NavigationSidebar from "@/components/NavigationSidebar";
import RealSocialFeedCard from "@/components/RealSocialFeedCard";
import UnifiedFeed from "@/components/UnifiedFeed";
import { useSocialPlatforms } from "@/hooks/useSocialPlatforms";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  
  const { 
    platforms, 
    posts, 
    isLoading, 
    connectPlatform, 
    syncPlatform, 
    refreshData 
  } = useSocialPlatforms();

  // Available platforms to connect
  const availablePlatforms = [
    { name: 'Twitter', username: 'web3creator' },
    { name: 'LinkedIn', username: 'web3-builder' },
    { name: 'Instagram', username: 'web3lifestyle' },
    { name: 'Discord', username: 'Web3 Hub' },
    { name: 'Ghost', username: 'web3blog' },
  ];

  const handleConnectPlatform = async (platformName: string) => {
    if (!isWalletConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first to use social media features",
        variant: "destructive",
      });
      return;
    }

    const platform = availablePlatforms.find(p => p.name === platformName);
    await connectPlatform(platformName.toLowerCase(), platform?.username);
  };

  const isPlatformConnected = (platformName: string) => {
    return platforms.some(p => 
      p.platform_name.toLowerCase() === platformName.toLowerCase() && p.is_connected
    );
  };

  const getPlatformUsername = (platformName: string) => {
    const platform = platforms.find(p => 
      p.platform_name.toLowerCase() === platformName.toLowerCase()
    );
    return platform?.platform_username;
  };

  const getTotalEngagement = () => {
    return posts.reduce((total, post) => {
      const metrics = post.engagement_metrics;
      return total + (metrics.likes || 0) + (metrics.comments || 0) + (metrics.shares || 0);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-cyan-200/50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mobile-touch"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/020d4211-02ff-4661-a8c0-465338e1837f.png" 
                alt="Autheo Logo"
                className="h-8 w-8"
              />
              <h1 className="text-xl font-bold autheo-gradient-text">
                Web3 Hub
              </h1>
            </div>
          </div>
          <ConnectWallet 
            isConnected={isWalletConnected}
            onConnect={(address) => {
              setIsWalletConnected(true);
              setWalletAddress(address);
            }}
            walletAddress={walletAddress}
          />
        </div>
      </div>

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out lg:relative fixed z-50`}>
          <NavigationSidebar />
        </div>
        
        <main className="flex-1 p-4 lg:p-6 lg:ml-64">
          {/* Desktop Header */}
          <div className="hidden lg:flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <img 
                src="/lovable-uploads/020d4211-02ff-4661-a8c0-465338e1837f.png" 
                alt="Autheo Logo"
                className="h-12 w-12"
              />
              <div>
                <h1 className="text-4xl font-bold autheo-gradient-text">
                  Web3 Social Hub
                </h1>
                <p className="text-slate-600 mt-2">Your decentralized social media aggregator</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <ConnectWallet 
                isConnected={isWalletConnected}
                onConnect={(address) => {
                  setIsWalletConnected(true);
                  setWalletAddress(address);
                }}
                walletAddress={walletAddress}
              />
              <Button variant="outline" size="icon" className="border-cyan-300 hover:bg-cyan-50 mobile-touch">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isWalletConnected ? (
            // Welcome Screen
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <div className="bg-white/70 backdrop-blur-sm border border-cyan-200/50 rounded-2xl p-8 lg:p-12 max-w-2xl shadow-lg">
                <div className="autheo-gradient rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Wallet className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-4">
                  Connect Your Wallet to Get Started
                </h2>
                <p className="text-slate-600 text-base lg:text-lg mb-8">
                  Access your decentralized social media hub by connecting your Web3 wallet. 
                  Manage all your social platforms in one secure, decentralized location.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <Badge variant="outline" className="border-teal-300 text-teal-700 bg-teal-50">
                    🔒 Secure Authentication
                  </Badge>
                  <Badge variant="outline" className="border-cyan-300 text-cyan-700 bg-cyan-50">
                    🌐 Multi-Platform Support
                  </Badge>
                  <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50">
                    📊 Real-time Feeds
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            // Main Dashboard
            <div className="space-y-6 lg:space-y-8">
              {/* Profile Stats */}
              <ProfileStats walletAddress={walletAddress} />

              {/* Quick Actions */}
              <Card className="bg-white/70 backdrop-blur-sm border-cyan-200/50 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-800 flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Connect Social Platforms
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={refreshData}
                      disabled={isLoading}
                      className="border-cyan-300 hover:bg-cyan-50 text-slate-700"
                    >
                      <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {availablePlatforms.map((platform) => (
                      <Button
                        key={platform.name}
                        onClick={() => handleConnectPlatform(platform.name)}
                        disabled={isPlatformConnected(platform.name)}
                        className={`${
                          isPlatformConnected(platform.name)
                            ? 'bg-teal-500 hover:bg-teal-600 text-white'
                            : 'autheo-gradient hover:opacity-90 text-white'
                        } mobile-touch`}
                      >
                        {isPlatformConnected(platform.name) ? '✓ Connected' : 'Connect'} {platform.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

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
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
