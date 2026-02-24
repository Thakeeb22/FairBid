import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Bell, ChevronDown } from "lucide-react";

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center shadow-gold">
            <span className="font-heading font-black text-accent-foreground text-sm">F</span>
          </div>
          <span className="font-heading font-bold text-lg text-foreground">
            Fair<span className="text-gold">Bid</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {[
            { label: "Dashboard", path: "/dashboard" },
            { label: "Market", path: "/market" },
            { label: "Create", path: "/create" },
          ].map(({ label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-xl border border-border hover:border-gold/50 transition-colors">
            <Bell size={18} className="text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold rounded-full" />
          </button>

          <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border hover:border-gold/50 transition-colors">
            <div className="w-6 h-6 rounded-full bg-gradient-gold flex items-center justify-center">
              <span className="text-xs font-heading font-bold text-accent-foreground">0x</span>
            </div>
            <span className="font-body text-sm text-foreground hidden sm:block">0x04aB3...f8e2</span>
            <ChevronDown size={14} className="text-muted-foreground hidden sm:block" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
