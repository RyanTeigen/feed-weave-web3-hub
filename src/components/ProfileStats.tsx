
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Settings, Share } from "lucide-react";

interface ProfileStatsProps {
  walletAddress: string;
}

const ProfileStats = ({ walletAddress }: ProfileStatsProps) => {
  return (
    <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm border-purple-400/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-purple-400/30">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h2 className="text-xl font-bold text-white">Web3 Creator</h2>
              <p className="text-slate-400">{walletAddress}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="border-green-400/30 text-green-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                  Active
                </Badge>
                <Badge variant="outline" className="border-blue-400/30 text-blue-300">
                  3 Platforms Connected
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-purple-400/30 hover:bg-purple-400/10 text-white">
              <Share className="h-4 w-4 mr-1" />
              Share Profile
            </Button>
            <Button variant="outline" size="sm" className="border-purple-400/30 hover:bg-purple-400/10 text-white">
              <Settings className="h-4 w-4 mr-1" />
              Edit Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileStats;
