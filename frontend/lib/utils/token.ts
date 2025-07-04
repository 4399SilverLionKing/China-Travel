// Token相关的工具函数
export const tokenUtils = {
  // 保存token到localStorage
  saveToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  },

  // 从localStorage获取token
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },

  // 删除token
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },

  // 检查是否已登录
  isLoggedIn: (): boolean => {
    return !!tokenUtils.getToken();
  },
};
