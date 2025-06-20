
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConnectWalletProps {
  isConnected: boolean;
  onConnect: (address: string) => void;
  walletAddress: string;
}

const ConnectWallet = ({ isConnected, onConnect, walletAddress }: ConnectWalletProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const connectMetaMask = async () => {
    setIsConnecting(true);
    
    try {
      // Simulate wallet connection (replace with actual MetaMask integration)
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockAddress = "0x1234...5678";
      onConnect(mockAddress);
      
      toast({
        title: "Wallet Connected! 🎉",
        description: "Your MetaMask wallet has been successfully connected.",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please make sure MetaMask is installed and try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline" className="bg-teal-50 border-teal-300 text-teal-700">
          <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
          Connected
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={copyAddress}
          className="border-cyan-300 hover:bg-cyan-50 text-slate-700 mobile-touch"
        >
          <Copy className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">{walletAddress}</span>
          <span className="sm:hidden">Copy</span>
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={connectMetaMask}
      disabled={isConnecting}
      className="autheo-gradient hover:opacity-90 text-white border-0 mobile-touch"
    >
      <Wallet className="h-4 w-4 mr-2" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
};

export default ConnectWallet;
