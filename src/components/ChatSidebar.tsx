'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import ChatMessage from './ChatMessage';
import PinnedItemCard from './PinnedItemCard';
import type { PinnedItem } from './PinButton';

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

export default function ChatSidebar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [pinned, setPinned] = useState<PinnedItem[]>([]);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastMsgId = useRef(0);

  const fetchMessages = useCallback(async () => {
    try {
      const r = await fetch('/api/chat');
      const d = await r.json();
      const msgs: ChatMsg[] = d.messages || [];
      if (msgs.length > 0) {
        const newLast = msgs[msgs.length - 1].id;
        if (newLast !== lastMsgId.current) {
          lastMsgId.current = newLast;
          setMessages(msgs);
        }
      } else {
        setMessages([]);
      }
    } catch { /* ignore polling errors */ }
  }, []);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    function handlePin(e: Event) {
      const item = (e as CustomEvent<PinnedItem>).detail;
      setPinned(prev => {
        if (prev.some(p => p.type === item.type && p.id === item.id)) return prev;
        return [...prev, item];
      });
      setOpen(true);
    }
    window.addEventListener('pin-item', handlePin);
    return () => window.removeEventListener('pin-item', handlePin);
  }, []);

  async function send() {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_name: session?.user?.name || null,
          author_email: session?.user?.email || null,
          author_image: session?.user?.image || null,
          message: input.trim(),
          pinned_items: pinned.length > 0 ? pinned : undefined,
        }),
      });
      setInput('');
      await fetchMessages();
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#1a1a2e] border border-zinc-700 flex items-center justify-center text-lg hover:border-[#4FC3F7] transition-colors z-50 shadow-lg"
      >
        💠
      </button>
    );
  }

  return (
    <div className="fixed top-0 right-0 h-full w-[350px] max-md:w-full bg-[#1a1a2e] border-l border-zinc-800 flex flex-col z-50 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <h2 className="text-sm font-semibold text-white">Chat with Nova</h2>
        <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-zinc-300 text-lg">&times;</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-zinc-600 text-xs mt-8">No messages yet. Start a conversation!</p>
        )}
        {messages.map(msg => (
          <ChatMessage key={msg.id} msg={msg} />
        ))}
        {sending && (
          <div className="flex items-start">
            <div className="bg-[#4FC3F7]/10 rounded-xl px-3 py-2 text-sm text-zinc-400 rounded-bl-sm">
              <span className="animate-pulse">Nova is thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Pinned items */}
      {pinned.length > 0 && (
        <div className="px-3 py-2 border-t border-zinc-800 space-y-1.5 max-h-32 overflow-y-auto">
          {pinned.map((item, i) => (
            <PinnedItemCard
              key={`${item.type}-${item.id}`}
              item={item}
              onRemove={() => setPinned(prev => prev.filter((_, j) => j !== i))}
            />
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-3 py-3 border-t border-zinc-800 space-y-2">
        {session?.user && (
          <div className="flex items-center gap-2 mb-1">
            {session.user.image ? (
              <img src={session.user.image} alt={session.user.name || ''} className="w-5 h-5 rounded-full object-cover" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center text-[9px] font-medium text-zinc-300">
                {session.user.name?.charAt(0).toUpperCase() || '?'}
              </div>
            )}
            <span className="text-xs text-zinc-400">{session.user.name}</span>
          </div>
        )}
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Nova..."
            rows={1}
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-200 resize-none focus:border-[#4FC3F7] focus:outline-none"
          />
          <button
            onClick={send}
            disabled={sending || !input.trim()}
            className="px-3 py-1.5 bg-[#4FC3F7] text-black text-sm font-medium rounded-lg hover:bg-[#81D4FA] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
