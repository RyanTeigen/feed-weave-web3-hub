
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
    <div className={`h-full bg-white/80 backdrop-blur-lg border-r border-cyan-200/50 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4">
        {/* Logo/Title */}
        <div className="flex items-center justify-between mb-8">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/020d4211-02ff-4661-a8c0-465338e1837f.png" 
                alt="Autheo Logo"
                className="h-8 w-8"
              />
              <div>
                <h1 className="text-xl font-bold autheo-gradient-text">
                  SoFee
                </h1>
                <p className="text-xs text-slate-500">Decentralized Social</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-600 hover:bg-cyan-50 mobile-touch lg:flex hidden"
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
              className={`w-full justify-start text-left transition-all mobile-touch ${
                item.active 
                  ? "bg-cyan-50 text-cyan-700 border border-cyan-200" 
                  : "text-slate-600 hover:text-slate-800 hover:bg-cyan-50/50"
              } ${isCollapsed ? 'px-2' : 'px-4'}`}
            >
              <item.icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.count && (
                    <Badge variant="outline" className="ml-auto border-cyan-300 text-cyan-700 bg-cyan-50">
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
          <Card className="mt-8 bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span className="text-teal-700 text-sm font-medium">System Status</span>
              </div>
              <p className="text-xs text-slate-600">All services operational</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NavigationSidebar;
