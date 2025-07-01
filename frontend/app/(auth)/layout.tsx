"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  return (
    <div className="relative flex flex-col h-screen p-4 items-center"
    style={{
      backgroundImage: "url('/bg.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}>
        {/* 背景遮罩层 */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* 返回按钮 */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 z-20 text-white hover:bg-white/20 hover:text-white"
          asChild
        >
          <Link href="/">
            <span className="icon-[material-symbols-light--arrow-back-ios] text-5xl"></span>
          </Link>
        </Button>

        {/* Logo 容器 */}
        <div className="relative z-10 w-full max-w-sm mx-auto flex justify-center pt-8 top-[20vh]">
            <Image
                src="/logo.png"
                alt="Gate Icon"
                width={100}
                height={100}
                className="rounded-lg"
            />
        </div>

        {/* 登录/注册容器 - 固定在视口底部 */}
        <div className="fixed bottom-[-10] left-4 right-4 z-10 max-w-sm mx-auto">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl h-[60vh] overflow-clip items-center ">
                {/* 顶部选项卡 */}
                <div className="flex bg-white/20 backdrop-blur-sm items-center">
                    <TabButton href="/login" label="登录" isActive={pathname === "/login"} />
                    <div className="opacity-80">|</div>
                    <TabButton href="/register" label="注册" isActive={pathname === "/register"} />
                </div>

                {/* 内容区域 */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    </div>
  );
}

function TabButton({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  return (
    <Link href={href} className="flex-1">
      <div className={`py-4 text-center transition-all duration-200 font-medium ${
        isActive
          ? "text-white text-3xl"
          : "text-white/30 text-2xl"
      }`}>
        {label}
      </div>
    </Link>
  );
}