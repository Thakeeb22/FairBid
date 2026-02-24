import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Store, Wallet, Settings } from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Market", icon: Store, path: "/market" },
  { label: "Portfolio", icon: Wallet, path: "/portfolio" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card/95 backdrop-blur-xl border-t border-border">
      <div className="flex">
        {navItems.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname === path || location.pathname.startsWith(path + "/");
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                isActive ? "text-gold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[10px] font-body font-medium">{label}</span>
              {isActive && (
                <span className="absolute bottom-0 h-0.5 w-8 bg-gradient-gold rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
