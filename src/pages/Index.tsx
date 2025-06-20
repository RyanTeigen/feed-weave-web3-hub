
import { useState } from "react";
import NavigationSidebar from "@/components/NavigationSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import MobileHeader from "@/components/MobileHeader";
import WelcomeScreen from "@/components/WelcomeScreen";
import MainDashboard from "@/components/MainDashboard";
import { useSocialPlatforms } from "@/hooks/useSocialPlatforms";
import { useWeb3AuthContext } from "@/contexts/Web3AuthContext";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { isConnected, walletAddress } = useWeb3AuthContext();
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

  // Available platforms to connect (removed Instagram)
  const availablePlatforms = [
    { name: 'Twitter', username: 'web3creator' },
    { name: 'LinkedIn', username: 'web3-builder' },
    { name: 'Discord', username: 'Web3 Hub' },
    { name: 'Ghost', username: 'web3blog' },
  ];

  const handleConnectPlatform = async (platformName: string) => {
    if (!isConnected) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50">
      {/* Mobile Header */}
      <MobileHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

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
          <DashboardHeader />

          {!isConnected ? (
            <WelcomeScreen />
          ) : (
            <MainDashboard
              walletAddress={walletAddress || ''}
              platforms={platforms}
              posts={posts}
              isLoading={isLoading}
              availablePlatforms={availablePlatforms}
              handleConnectPlatform={handleConnectPlatform}
              isPlatformConnected={isPlatformConnected}
              getPlatformUsername={getPlatformUsername}
              syncPlatform={syncPlatform}
              refreshData={refreshData}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
