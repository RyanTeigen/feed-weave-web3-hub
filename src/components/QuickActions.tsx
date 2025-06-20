
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface QuickActionsProps {
  availablePlatforms: Array<{ name: string; username: string }>;
  handleConnectPlatform: (platformName: string) => Promise<void>;
  isPlatformConnected: (platformName: string) => boolean;
  refreshData: () => void;
  isLoading: boolean;
}

const QuickActions = ({ 
  availablePlatforms, 
  handleConnectPlatform, 
  isPlatformConnected, 
  refreshData, 
  isLoading 
}: QuickActionsProps) => {
  return (
    <Card className="bg-white/70 backdrop-blur-sm border-cyan-200/50 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-800 flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Connect Social Platforms
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
            className="border-cyan-300 hover:bg-cyan-50 text-slate-700"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {availablePlatforms.map((platform) => (
            <Button
              key={platform.name}
              onClick={() => handleConnectPlatform(platform.name)}
              disabled={isPlatformConnected(platform.name)}
              className={`${
                isPlatformConnected(platform.name)
                  ? 'bg-teal-500 hover:bg-teal-600 text-white'
                  : 'autheo-gradient hover:opacity-90 text-white'
              } mobile-touch`}
            >
              {isPlatformConnected(platform.name) ? '✓ Connected' : 'Connect'} {platform.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
