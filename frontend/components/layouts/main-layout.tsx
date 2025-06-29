"use client";

import { BottomNavigation } from "@/components/ui/bottom-navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 主要内容区域 */}
      <main className="pb-16">
        {children}
      </main>
      
      {/* 底部导航 */}
      <BottomNavigation />
    </div>
  );
}
