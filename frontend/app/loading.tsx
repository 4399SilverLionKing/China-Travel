export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* 页面标题骨架 */}
      <div className="text-center space-y-4">
        <div className="h-12 bg-muted rounded-lg w-1/2 mx-auto"></div>
        <div className="h-6 bg-muted rounded-lg w-3/4 mx-auto"></div>
      </div>

      {/* 卡片网格骨架 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-6 space-y-4">
            <div className="h-6 bg-muted rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        ))}
      </div>

      {/* 底部内容骨架 */}
      <div className="border rounded-lg p-6 space-y-4">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-4/5"></div>
            <div className="h-4 bg-muted rounded w-3/5"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-4/5"></div>
            <div className="h-4 bg-muted rounded w-3/5"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
