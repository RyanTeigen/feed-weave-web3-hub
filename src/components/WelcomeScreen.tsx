
import { Badge } from "@/components/ui/badge";
import { Wallet } from "lucide-react";

const WelcomeScreen = () => {
  return (
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
  );
};

export default WelcomeScreen;
