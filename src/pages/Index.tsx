
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Wallet, Plus, ExternalLink, Settings, TrendingUp, Menu } from "lucide-react";
import ConnectWallet from "@/components/ConnectWallet";
import SocialFeedCard from "@/components/SocialFeedCard";
import ProfileStats from "@/components/ProfileStats";
import NavigationSidebar from "@/components/NavigationSidebar";

const Index = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock data for social feeds
  const socialFeeds = [
    {
      platform: "Twitter",
      username: "@web3creator",
      followers: "12.5K",
      posts: [
        {
          content: "Just launched our new DeFi aggregator! 🚀 The future of decentralized finance is here.",
          timestamp: "2 hours ago",
          engagement: { likes: 45, retweets: 12, comments: 8 }
        },
        {
          content: "Building in Web3 is more exciting than ever. The ecosystem is growing rapidly! 💪",
          timestamp: "5 hours ago",
          engagement: { likes: 78, retweets: 23, comments: 15 }
        }
      ]
    },
    {
      platform: "Discord",
      serverName: "Web3 Builders",
      members: "5.2K",
      recentActivity: [
        {
          user: "alice.eth",
          message: "New governance proposal is live! Check it out 👀",
          timestamp: "1 hour ago"
        },
        {
          user: "bob.crypto",
          message: "Great discussion on Layer 2 solutions today",
          timestamp: "3 hours ago"
        }
      ]
    },
    {
      platform: "Instagram",
      username: "@web3lifestyle",
      followers: "8.9K",
      posts: [
        {
          imageUrl: "/placeholder.svg",
          caption: "Behind the scenes at our Web3 meetup! Amazing community 🌟",
          timestamp: "4 hours ago",
          engagement: { likes: 234, comments: 18 }
        }
      ]
    }
  ];

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
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Connect Social Platforms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="autheo-gradient hover:opacity-90 text-white mobile-touch">
                      Connect Twitter
                    </Button>
                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white mobile-touch">
                      Connect Discord
                    </Button>
                    <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white mobile-touch">
                      Connect Instagram
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Social Feeds Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {socialFeeds.map((feed, index) => (
                  <SocialFeedCard key={index} feed={feed} />
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
                      <div className="text-2xl font-bold text-white">26.7K</div>
                      <div className="text-sm text-white/80">Total Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">1.2K</div>
                      <div className="text-sm text-white/80">This Week</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">89%</div>
                      <div className="text-sm text-white/80">Engagement Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">12</div>
                      <div className="text-sm text-white/80">Platforms</div>
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
