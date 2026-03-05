'use client';

interface ChatMsg {
  id: number;
  role: string;
  author: string | null;
  author_email: string | null;
  author_name: string | null;
  author_image: string | null;
  message: string;
  pinned_items: string | null;
  created_at: string;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function Avatar({ name, image, size = 6 }: { name: string | null; image: string | null; size?: number }) {
  const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?';
  const sizeClass = `w-${size} h-${size}`;
  if (image) {
    return (
      <img
        src={image}
        alt={name || ''}
        className={`${sizeClass} rounded-full object-cover flex-shrink-0`}
      />
    );
  }
  return (
    <div className={`${sizeClass} rounded-full bg-zinc-700 flex items-center justify-center text-[10px] font-medium text-zinc-300 flex-shrink-0`}>
      {initials}
    </div>
  );
}

export default function ChatMessage({ msg }: { msg: ChatMsg }) {
  const isUser = msg.role === 'user';
  const displayName = msg.author_name || msg.author || (isUser ? 'User' : 'Nova');
  const displayImage = msg.author_image || null;
  let pinned: { type: string; id: number; snippet: string }[] = [];
  if (msg.pinned_items) {
    try { pinned = JSON.parse(msg.pinned_items); } catch { /* ignore */ }
  }

  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-end gap-2">
          <div className="max-w-[85%] rounded-xl rounded-br-sm px-3 py-2 text-sm bg-blue-600/20 text-zinc-200">
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
          <Avatar name={displayName} image={displayImage} size={6} />
        </div>
        <div className="flex gap-1.5 px-8">
          <span className="text-[10px] text-zinc-500">{displayName}</span>
          <span className="text-[10px] text-zinc-600">{formatTime(msg.created_at)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-end gap-2">
        <Avatar name="Nova" image={null} size={6} />
        <div className="max-w-[85%] rounded-xl rounded-bl-sm px-3 py-2 text-sm bg-[#4FC3F7]/10 text-zinc-200">
          <p className="whitespace-pre-wrap">{msg.message}</p>
        </div>
      </div>
      <div className="flex gap-1.5 px-8">
        <span className="text-[10px] text-zinc-500">Nova</span>
        <span className="text-[10px] text-zinc-600">{formatTime(msg.created_at)}</span>
      </div>
    </div>
  );
}
