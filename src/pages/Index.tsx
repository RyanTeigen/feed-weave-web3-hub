
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Wallet, Plus, ExternalLink, Settings, TrendingUp } from "lucide-react";
import ConnectWallet from "@/components/ConnectWallet";
import SocialFeedCard from "@/components/SocialFeedCard";
import ProfileStats from "@/components/ProfileStats";
import NavigationSidebar from "@/components/NavigationSidebar";

const Index = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex">
        <NavigationSidebar />
        
        <main className="flex-1 p-6 ml-64">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Web3 Social Hub
              </h1>
              <p className="text-slate-400 mt-2">Your decentralized social media aggregator</p>
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
              <Button variant="outline" size="icon" className="border-purple-400/30 hover:bg-purple-400/10">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isWalletConnected ? (
            // Welcome Screen
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-purple-400/20 rounded-2xl p-12 max-w-2xl">
                <Wallet className="h-16 w-16 mx-auto mb-6 text-purple-400" />
                <h2 className="text-3xl font-bold text-white mb-4">
                  Connect Your Wallet to Get Started
                </h2>
                <p className="text-slate-300 text-lg mb-8">
                  Access your decentralized social media hub by connecting your Web3 wallet. 
                  Manage all your social platforms in one secure, decentralized location.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
                  <Badge variant="outline" className="border-purple-400/30 text-purple-300">
                    🔒 Secure Authentication
                  </Badge>
                  <Badge variant="outline" className="border-blue-400/30 text-blue-300">
                    🌐 Multi-Platform Support
                  </Badge>
                  <Badge variant="outline" className="border-green-400/30 text-green-300">
                    📊 Real-time Feeds
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            // Main Dashboard
            <div className="space-y-8">
              {/* Profile Stats */}
              <ProfileStats walletAddress={walletAddress} />

              {/* Quick Actions */}
              <Card className="bg-white/5 backdrop-blur-sm border-purple-400/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Connect Social Platforms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 text-blue-300">
                      Connect Twitter
                    </Button>
                    <Button className="bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-indigo-300">
                      Connect Discord
                    </Button>
                    <Button className="bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/30 text-pink-300">
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
              <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm border-purple-400/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Engagement Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">26.7K</div>
                      <div className="text-sm text-slate-400">Total Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">1.2K</div>
                      <div className="text-sm text-slate-400">This Week</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">89%</div>
                      <div className="text-sm text-slate-400">Engagement Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400">12</div>
                      <div className="text-sm text-slate-400">Platforms</div>
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
