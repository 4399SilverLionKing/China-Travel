'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 在实际应用中，你可能想要将错误记录到错误报告服务
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto mt-16">
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl text-red-800">出现了错误</CardTitle>
          <CardDescription>
            应用程序遇到了一个意外错误
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 错误详情 */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">错误信息:</h4>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <code className="text-sm text-red-800 break-all">
                {error.message || '未知错误'}
              </code>
            </div>
            
            {error.digest && (
              <div className="text-xs text-muted-foreground">
                错误ID: {error.digest}
              </div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={reset} className="flex-1">
              重试
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="flex-1"
            >
              返回首页
            </Button>
          </div>

          {/* 错误处理说明 */}
          <div className="bg-muted p-4 rounded-lg">
            <h5 className="font-semibold text-sm mb-2">关于错误处理</h5>
            <p className="text-sm text-muted-foreground">
              这个错误页面是通过 Next.js 的 error.tsx 文件实现的。
              它可以捕获页面级别的错误并提供恢复选项。
            </p>
          </div>

          {/* 开发环境信息 */}
          {process.env.NODE_ENV === 'development' && (
            <details className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <summary className="font-semibold text-sm text-yellow-800 cursor-pointer">
                开发环境详细信息
              </summary>
              <div className="mt-3 space-y-2">
                <div className="text-xs">
                  <strong>错误堆栈:</strong>
                  <pre className="mt-1 text-xs bg-white p-2 rounded border overflow-x-auto">
                    {error.stack}
                  </pre>
                </div>
              </div>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
