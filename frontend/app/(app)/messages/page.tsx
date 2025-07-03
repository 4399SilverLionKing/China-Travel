import { ChatComponent } from '@/components/ui/chat';

export default function MessagesPage() {
  return (
    <div className="p-4 h-full">
      <h1 className="text-2xl font-bold mb-4">智能助手</h1>
      <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-8rem)]">
        <ChatComponent />
      </div>
    </div>
  );
}
