
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
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-green-500/10 border-green-400/30 text-green-300">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
          Connected
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={copyAddress}
          className="border-purple-400/30 hover:bg-purple-400/10 text-white"
        >
          <Copy className="h-3 w-3 mr-1" />
          {walletAddress}
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={connectMetaMask}
      disabled={isConnecting}
      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0"
    >
      <Wallet className="h-4 w-4 mr-2" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
};

export default ConnectWallet;
