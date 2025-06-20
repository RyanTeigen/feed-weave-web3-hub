
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  User, 
  Settings, 
  TrendingUp, 
  Plus,
  Menu,
  X
} from "lucide-react";

const NavigationSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    { icon: Home, label: "Dashboard", active: true, count: null },
    { icon: User, label: "Profile", active: false, count: null },
    { icon: Plus, label: "Connect Platforms", active: false, count: 3 },
    { icon: TrendingUp, label: "Analytics", active: false, count: null },
    { icon: Settings, label: "Settings", active: false, count: null },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-black/20 backdrop-blur-lg border-r border-purple-400/20 transition-all duration-300 z-40 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4">
        {/* Logo/Title */}
        <div className="flex items-center justify-between mb-8">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Web3 Hub
              </h1>
              <p className="text-xs text-slate-400">Decentralized Social</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-white/10"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {navigationItems.map((item, index) => (
            <Button
              key={index}
              variant={item.active ? "secondary" : "ghost"}
              className={`w-full justify-start text-left transition-all ${
                item.active 
                  ? "bg-purple-500/20 text-purple-300 border border-purple-400/30" 
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              } ${isCollapsed ? 'px-2' : 'px-4'}`}
            >
              <item.icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.count && (
                    <Badge variant="outline" className="ml-auto border-purple-400/30 text-purple-300">
                      {item.count}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          ))}
        </nav>

        {/* Status Card */}
        {!isCollapsed && (
          <Card className="mt-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-400/20">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-300 text-sm font-medium">System Status</span>
              </div>
              <p className="text-xs text-slate-400">All services operational</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NavigationSidebar;
