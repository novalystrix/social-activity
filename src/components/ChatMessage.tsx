'use client';

interface ChatMsg {
  id: number;
  role: string;
  author: string | null;
  message: string;
  pinned_items: string | null;
  created_at: string;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatMessage({ msg }: { msg: ChatMsg }) {
  const isUser = msg.role === 'user';
  let pinned: { type: string; id: number; snippet: string }[] = [];
  if (msg.pinned_items) {
    try { pinned = JSON.parse(msg.pinned_items); } catch { /* ignore */ }
  }

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
        isUser
          ? 'bg-blue-600/20 text-zinc-200 rounded-br-sm'
          : 'bg-[#4FC3F7]/10 text-zinc-200 rounded-bl-sm'
      }`}>
        {pinned.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1.5">
            {pinned.map((p, i) => (
              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                📌 {p.type}#{p.id}
              </span>
            ))}
          </div>
        )}
        <p className="whitespace-pre-wrap">{msg.message}</p>
      </div>
      <div className="flex gap-1.5 mt-0.5 px-1">
        <span className="text-[10px] text-zinc-600">{msg.author}</span>
        <span className="text-[10px] text-zinc-700">{formatTime(msg.created_at)}</span>
      </div>
    </div>
  );
}
