import React from "react";
import Header from "./Header";
import BottomNav from "./BottomNav";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, className = "" }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={`flex-1 pb-20 md:pb-8 ${className}`}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default PageLayout;
