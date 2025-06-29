import Image from "next/image";
import Link from "next/link";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

        {/* Logo 容器 */}
        <div className="relative z-10 w-full max-w-sm mx-auto flex justify-center pt-8 top-50">
            <Image
                src="/logo.png"
                alt="Gate Icon"
                width={100}
                height={100}
                className="rounded-lg"
            />
        </div>

        {/* 登录/注册容器 - 固定在视口底部 */}
        <div className="fixed bottom-[-20] left-4 right-4 z-10 max-w-sm mx-auto">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl h-150 overflow-clip items-center ">
                {/* 顶部选项卡 */}
                <div className="flex bg-white/20 backdrop-blur-sm items-center">
                    <TabButton href="/user" label="登录" />
                    <div className="opacity-80">|</div>
                    <TabButton href="/user/register" label="注册" />
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

function TabButton({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="flex-1">
      <div className="py-4 text-center text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 text-lg font-medium">
        {label}
      </div>
    </Link>
  );
}