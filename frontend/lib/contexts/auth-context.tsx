"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { tokenUtils } from '@/lib/api/java/auth';

// 用户信息类型
interface User {
  username: string;
  token: string;
}

// 认证上下文类型
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者组件
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化时检查本地存储的token
  useEffect(() => {
    const token = tokenUtils.getToken();
    if (token) {
      // 这里可以调用API验证token的有效性
      // 暂时假设token有效，实际项目中应该验证
      setUser({
        username: '', // 可以从token中解析或调用API获取
        token,
      });
    }
    setIsLoading(false);
  }, []);

  // 登录函数
  const login = (userData: User) => {
    setUser(userData);
    tokenUtils.saveToken(userData.token);
  };

  // 登出函数
  const logout = () => {
    setUser(null);
    tokenUtils.removeToken();
  };

  // 是否已认证
  const isAuthenticated = !!user;

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 使用认证上下文的Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
