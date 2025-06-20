
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
    <Card className="bg-white/70 backdrop-blur-sm border-cyan-200/50 shadow-lg">
      <CardContent className="p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-cyan-300">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="autheo-gradient text-white">
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h2 className="text-xl font-bold text-slate-800">Web3 Creator</h2>
              <p className="text-slate-600 text-sm lg:text-base break-all">{walletAddress}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant="outline" className="border-teal-300 text-teal-700 bg-teal-50">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mr-1"></div>
                  Active
                </Badge>
                <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50">
                  3 Platforms Connected
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <Button variant="outline" size="sm" className="border-cyan-300 hover:bg-cyan-50 text-slate-700 flex-1 lg:flex-none mobile-touch">
              <Share className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Share Profile</span>
              <span className="sm:hidden">Share</span>
            </Button>
            <Button variant="outline" size="sm" className="border-cyan-300 hover:bg-cyan-50 text-slate-700 flex-1 lg:flex-none mobile-touch">
              <Settings className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Edit Profile</span>
              <span className="sm:hidden">Edit</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileStats;
