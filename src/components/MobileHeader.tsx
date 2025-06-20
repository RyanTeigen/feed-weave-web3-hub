
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import ConnectWallet from "@/components/ConnectWallet";

interface MobileHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const MobileHeader = ({ sidebarOpen, setSidebarOpen }: MobileHeaderProps) => {
  return (
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
        <ConnectWallet />
      </div>
    </div>
  );
};

export default MobileHeader;
