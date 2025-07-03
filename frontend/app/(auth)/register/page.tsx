"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { register } from "@/lib/api/java/auth";
import { ApiError } from "@/lib/types/common";

// 定义注册表单验证模式
const registerSchema = z.object({
  username: z
    .string()
    .min(1, "请输入用户名")
    .min(3, "用户名至少需要3个字符")
    .max(20, "用户名不能超过20个字符")
    .regex(/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, "用户名只能包含字母、数字、下划线和中文"),
  email: z
    .string()
    .min(1, "请输入电子邮箱")
    .email("请输入有效的电子邮箱地址"),
  password: z
    .string()
    .min(1, "请输入密码")
    .min(6, "密码至少需要6个字符")
    .max(50, "密码不能超过50个字符"),
  confirmPassword: z
    .string()
    .min(1, "请确认密码"),
  agreeTerms: z
    .boolean()
    .refine((val) => val === true, "请同意用户协议"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      // 调用注册API
      const response = await register({
        username: data.username,
        email: data.email,
        password: data.password,
        role: "USER", // 默认角色为普通用户
      });

      // 显示成功提示
      toast.success("注册成功", {
        description: response.message || "欢迎加入旅游·中国！请登录您的账户。",
        duration: 3000,
      });

      // 延迟一下再跳转，让用户看到成功提示
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      console.error("注册失败:", error);

      // 处理API错误
      if (error && typeof error === 'object' && 'message' in error) {
        toast.error("注册失败", {
          description: (error as ApiError).message,
          duration: 3000,
        });
      } else {
        toast.error("注册失败", {
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
                    placeholder="用户名"
                    className="bg-transparent border-white/30 text-white placeholder:text-white/70 h-12 rounded-lg"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          {/* 邮箱输入框 */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="电子邮箱"
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

          {/* 确认密码输入框 */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="确认密码"
                    className="bg-transparent border-white/30 text-white placeholder:text-white/70 h-12 rounded-lg"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          {/* 同意条款复选框 */}
          <FormField
            control={form.control}
            name="agreeTerms"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-black"
                    />
                  </FormControl>
                  <Label className="text-white/80 text-sm cursor-pointer">
                    我已经阅读并同意《旅游·中国用户协议》
                  </Label>
                </div>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          {/* 注册按钮 */}
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-[#B85450] hover:bg-[#A04A46] text-white h-12 rounded-lg font-medium text-base mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "注册中..." : "注册"}
          </Button>
        </form>
      </Form>
    </div>
  );
}