'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface Msg {
  id: string;
  authorName: string;
  authorImage: string | null;
  isBot: boolean;
  text: string;
  pinnedItem: string | null;
  createdAt: string;
}

interface Props {
  accountId: string;
  initialMessages: Msg[];
}

export default function ChatUI({ accountId, initialMessages }: Props) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const r = await fetch(`/api/app/${accountId}/chat`);
      const d = await r.json();
      setMessages(d.messages || []);
    } catch { /* ignore */ }
  }, [accountId]);

  useEffect(() => {
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send() {
    if (!input.trim() || sending) return;
    setSending(true);
    const text = input.trim();
    setInput('');
    try {
      await fetch(`/api/app/${accountId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
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

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] rounded-xl border border-zinc-800 bg-[#1a1a2e] overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-zinc-600 text-sm mt-12">No messages yet. Start a conversation.</p>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.isBot ? '' : 'flex-row-reverse'}`}>
            <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
              msg.isBot ? 'bg-[#4FC3F7]/20 text-[#4FC3F7]' : 'bg-zinc-700 text-zinc-300'
            }`}>
              {msg.authorImage ? (
                <img src={msg.authorImage} alt="" className="w-7 h-7 rounded-full" />
              ) : msg.authorName[0]?.toUpperCase()}
            </div>
            <div className={`max-w-[75%] ${msg.isBot ? '' : 'items-end flex flex-col'}`}>
              <p className={`text-xs text-zinc-500 mb-1 ${msg.isBot ? '' : 'text-right'}`}>
                {msg.authorName} &middot; {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <div className={`px-3 py-2 rounded-xl text-sm ${
                msg.isBot
                  ? 'bg-[#4FC3F7]/10 text-zinc-200 rounded-tl-sm'
                  : 'bg-zinc-800 text-zinc-200 rounded-tr-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#4FC3F7]/20 flex items-center justify-center text-xs text-[#4FC3F7]">N</div>
            <div className="px-3 py-2 rounded-xl bg-[#4FC3F7]/10 text-sm text-zinc-400 rounded-tl-sm animate-pulse">
              Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-zinc-800">
        {session?.user && (
          <div className="flex items-center gap-2 mb-2">
            {session.user.image ? (
              <img src={session.user.image} alt="" className="w-5 h-5 rounded-full" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center text-xs text-zinc-400">
                {session.user.name?.[0]?.toUpperCase()}
              </div>
            )}
            <span className="text-xs text-zinc-500">{session.user.name}</span>
          </div>
        )}
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message..."
            rows={1}
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 resize-none focus:border-[#4FC3F7] focus:outline-none"
          />
          <button
            onClick={send}
            disabled={sending || !input.trim()}
            className="px-4 py-2 bg-[#4FC3F7] text-black text-sm font-medium rounded-lg hover:bg-[#4FC3F7]/90 disabled:opacity-40 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
