"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { tokenUtils } from '@/lib/utils/token';

// 用户信息类型
interface User {
  userId: number;
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

  // 初始化时检查本地存储的用户信息
  useEffect(() => {
    const token = tokenUtils.getToken();
    if (token) {
      // 尝试从localStorage获取完整的用户信息
      const userStr = localStorage.getItem('user_info');
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          if (userData.userId && userData.username && userData.token === token) {
            setUser(userData);
          } else {
            // 如果用户信息不完整或token不匹配，清除存储
            tokenUtils.removeToken();
            localStorage.removeItem('user_info');
          }
        } catch (error) {
          console.error('解析用户信息失败:', error);
          tokenUtils.removeToken();
          localStorage.removeItem('user_info');
        }
      } else {
        // 如果有token但没有用户信息，清除token
        tokenUtils.removeToken();
      }
    }
    setIsLoading(false);
  }, []);

  // 登录函数
  const login = (userData: User) => {
    setUser(userData);
    tokenUtils.saveToken(userData.token);
    // 保存完整的用户信息到localStorage
    localStorage.setItem('user_info', JSON.stringify(userData));
  };

  // 登出函数
  const logout = () => {
    setUser(null);
    tokenUtils.removeToken();
    localStorage.removeItem('user_info');
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
