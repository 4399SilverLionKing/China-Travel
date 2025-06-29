import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto mt-16">
      <Card>
        <CardHeader className="text-center">
          <div className="w-24 h-24 flex items-center justify-center mx-auto">
            <div className="text-4xl font-bold text-red-600">404</div>
          </div>
          <CardTitle className="text-3xl">页面未找到</CardTitle>
          <CardDescription className="text-lg">
            抱歉，您访问的页面不存在
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 可能的原因 */}
          <div className="space-y-3">
            <h4 className="font-semibold">可能的原因:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>URL 地址输入错误</li>
              <li>页面已被移动或删除</li>
              <li>链接已过期</li>
              <li>您没有访问权限</li>
            </ul>
          </div>

          {/* 建议操作 */}
          <div className="space-y-3">
            <h4 className="font-semibold">您可以尝试:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button asChild variant="default">
                <Link href="/">返回首页</Link>
              </Button>
            </div>
          </div>

          {/* 搜索建议 */}
          <div className="bg-muted p-4 rounded-lg">
            <h5 className="font-semibold text-sm mb-2">寻找特定内容？</h5>
            <p className="text-sm text-muted-foreground mb-3">
              您可以浏览我们的主要功能页面：
            </p>
            <div className="space-y-2 text-sm">
              
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
