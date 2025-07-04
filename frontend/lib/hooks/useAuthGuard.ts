import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';

// 认证保护Hook
export function useAuthGuard(redirectTo: string = '/login') {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 等待认证状态加载完成
    if (!isLoading) {
      if (!isAuthenticated) {
        // 未登录，跳转到登录页面
        router.push(redirectTo);
      }
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return {
    isAuthenticated,
    isLoading,
    // 返回是否应该显示内容（已登录且加载完成）
    shouldRender: !isLoading && isAuthenticated,
  };
}

// 获取当前用户信息的Hook
export function useCurrentUser() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  return {
    user,
    userId: user?.userId,
    username: user?.username,
    token: user?.token,
    isAuthenticated,
    isLoading,
  };
}
