import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProfilePage() {
  return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">中国旅行</h1>
        <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
          <p className="text-gray-600 mb-4">欢迎来到中国旅行应用</p>
          <Button asChild>
            <Link href="/login">登录/注册</Link>
          </Button>
        </div>
      </div>
  );
}
