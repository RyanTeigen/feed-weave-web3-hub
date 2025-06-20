
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import ConnectWallet from "@/components/ConnectWallet";

const DashboardHeader = () => {
  return (
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
        <ConnectWallet />
        <Button variant="outline" size="icon" className="border-cyan-300 hover:bg-cyan-50 mobile-touch">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
