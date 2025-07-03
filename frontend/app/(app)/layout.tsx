"use client";

import { BottomNavigation } from "@/components/bottom-navigation";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return(
    <div className="h-screen bg-gray-50 flex flex-col">
        {/* 主要内容区域 */}
        <main className="flex-1 overflow-hidden">
        {children}
        </main>

        {/* 底部导航 */}
        <BottomNavigation />
    </div>
    );
}