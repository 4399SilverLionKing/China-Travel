"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/auth-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User, LogOut, History, MapPin, Settings } from "lucide-react";

export default function ProfilePage() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success("已成功登出", {
      description: "感谢您的使用，期待您的再次访问！",
      duration: 2000,
    });
    router.push("/");
  };

  // 生成用户头像的首字母
  const getInitials = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {isAuthenticated ? (
          <div className="space-y-6 h-[87vh] overflow-scroll">
            {/* 用户信息卡片 */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    <AvatarImage src="" alt={user?.username} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold">
                      {user?.username ? getInitials(user.username) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{user?.username}</h2>
                    <p className="text-gray-600">用户ID: {user?.userId}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-center">
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>退出登录</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 功能菜单 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <Link href="/itinerary" className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <History className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">行程历史</h3>
                      <p className="text-sm text-gray-600">查看您的旅行记录</p>
                    </div>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <Link href="/" className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <MapPin className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">开始规划</h3>
                      <p className="text-sm text-gray-600">创建新的旅行计划</p>
                    </div>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <Link href="/profile/manage" className="flex items-center space-x-4">
                    <div className="p-3 bg-red-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <Settings className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">信息管理</h3>
                      <p className="text-sm text-gray-600">修改您的个人信息</p>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* 未登录状态 */
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-gray-200">
                  <AvatarFallback className="bg-gray-100 text-gray-400">
                    <User className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">欢迎来到中国旅行</h2>
                <p className="text-gray-600">登录后享受完整的旅行规划体验</p>
              </div>
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/login">登录账户</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/register">创建新账户</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
