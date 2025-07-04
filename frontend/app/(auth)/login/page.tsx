"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { login as loginApi } from "@/lib/api/java/auth";
import { ApiError } from "@/lib/types/common";
import { useAuth } from "@/lib/contexts/auth-context";

// 定义表单验证模式
const loginSchema = z.object({
  username: z
    .string()
    .min(1, "请输入用户名或电子邮件")
    .min(3, "用户名至少需要3个字符"),
  password: z
    .string()
    .min(1, "请输入密码")
    .min(6, "密码至少需要6个字符"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function UserPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      // 调用登录API
      const response = await loginApi({
        username: data.username,
        password: data.password,
      });

      // 使用认证上下文保存用户信息
      login({
        userId: response.data.userId,
        username: response.data.username,
        token: response.data.token,
      });

      // 显示成功提示
      toast.success("登录成功", {
        description: `欢迎回来，${response.data.username}！`,
        duration: 2000,
      });

      // 登录成功后跳转到首页
      router.push("/");
    } catch (error) {
      console.error("登录失败:", error);

      // 处理API错误
      if (error && typeof error === 'object' && 'message' in error) {
        toast.error("登录失败", {
          description: (error as ApiError).message,
          duration: 3000,
        });
      } else {
        toast.error("登录失败", {
          description: "网络连接异常，请稍后重试",
          duration: 3000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-6 py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 text-white">
          {/* 用户名输入框 */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="用户名或电子邮件"
                    className="bg-transparent border-white/30 text-white placeholder:text-white/70 h-12 rounded-lg"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          {/* 密码输入框 */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="密码"
                    className="bg-transparent border-white/30 text-white placeholder:text-white/70 h-12 rounded-lg"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          {/* 忘记密码链接 */}
          <div className="flex justify-between items-center text-sm">
            <Link href="/refind" className="text-white/80 hover:text-white">
              忘记密码？
            </Link>
          </div>

          {/* 登录按钮 */}
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-[#B85450] hover:bg-[#A04A46] text-white h-12 rounded-lg font-medium text-base mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "登录中..." : "登录"}
          </Button>
        </form>
      </Form>
    </div>
  );
}