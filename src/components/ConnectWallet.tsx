
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Copy, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWeb3AuthContext } from "@/contexts/Web3AuthContext";

const ConnectWallet = () => {
  const { isConnected, walletAddress, isConnecting, connectWallet, disconnect } = useWeb3AuthContext();
  const { toast } = useToast();

  const handleConnect = async () => {
    await connectWallet();
  };

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && walletAddress) {
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
          <span className="hidden sm:inline">{formatAddress(walletAddress)}</span>
          <span className="sm:hidden">Copy</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={disconnect}
          className="border-red-300 hover:bg-red-50 text-red-700 mobile-touch"
        >
          <LogOut className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">Disconnect</span>
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      className="autheo-gradient hover:opacity-90 text-white border-0 mobile-touch"
    >
      <Wallet className="h-4 w-4 mr-2" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
};

export default ConnectWallet;
