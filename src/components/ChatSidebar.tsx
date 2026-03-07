'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Msg {
  id: string;
  authorName: string;
  authorImage: string | null;
  isBot: boolean;
  text: string;
  pinnedItem: string | null;
  createdAt: string;
}

interface Member {
  id: string;
  role: string;
  user: { id: string; email: string; name: string | null; image: string | null };
}

export default function ChatSidebar({ accountId }: { accountId: string }) {
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastCountRef = useRef(0);
  const [showMembers, setShowMembers] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [invited, setInvited] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsDesktop(e.matches);
      if (e.matches) setOpen(true);
    };
    handler(mq);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      const r = await fetch(`/api/app/${accountId}/chat`);
      const d = await r.json();
      const msgs: Msg[] = d.messages || [];
      if (!open && msgs.length > lastCountRef.current && lastCountRef.current > 0) {
        setUnread((u) => u + (msgs.length - lastCountRef.current));
      }
      lastCountRef.current = msgs.length;
      setMessages(msgs);
    } catch { /* ignore */ }
  }, [accountId, open]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [open, messages]);

  async function fetchMembers() {
    try {
      const r = await fetch(`/api/app/${accountId}/members`);
      if (r.ok) setMembers(await r.json());
    } catch {}
  }

  function toggleMembers() {
    if (!showMembers) fetchMembers();
    setShowMembers(!showMembers);
  }

  async function inviteMember() {
    if (!inviteEmail.trim() || inviting) return;
    setInviting(true);
    setInvited(false);
    try {
      const r = await fetch(`/api/app/${accountId}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addMember', email: inviteEmail.trim() }),
      });
      if (r.ok) {
        const m = await r.json();
        setMembers((prev) => [...prev, m]);
        setInviteEmail('');
        setInvited(true);
        setTimeout(() => setInvited(false), 3000);
      }
    } finally {
      setInviting(false);
    }
  }

  async function removeMember(memberId: string) {
    await fetch(`/api/app/${accountId}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'removeMember', memberId }),
    });
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  }

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

  const showPanel = isDesktop || open;

  return (
    <>
      {!isDesktop && (
        <button
          onClick={() => setOpen(!open)}
          className="fixed right-4 bottom-4 z-50 w-11 h-11 rounded-full bg-[#4FC3F7] text-black flex items-center justify-center shadow-lg hover:bg-[#4FC3F7]/90 transition-all lg:hidden"
        >
          {open ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          )}
          {unread > 0 && !open && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center font-bold">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>
      )}

      <div
        className={`fixed right-0 top-0 h-screen z-40 transition-transform duration-300 ${showPanel ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ width: '22rem' }}
      >
        <div className="h-full flex flex-col bg-[#111127] border-l border-zinc-800 shadow-2xl">
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-200">Team Chat</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMembers}
                className={`text-xs px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${
                  showMembers ? 'bg-[#4FC3F7]/10 text-[#4FC3F7]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
                }`}
                title="Team members"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                {!showMembers && <span>+ Team</span>}
              </button>
              {!isDesktop && (
                <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              )}
            </div>
          </div>

          {/* Members panel */}
          {showMembers && (
            <div className="border-b border-zinc-800 px-3 py-3 space-y-3 bg-[#0d0d1a]">
              <p className="text-xs text-zinc-400 font-medium">Team Members</p>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {members.map((m) => (
                  <div key={m.id} className="flex items-center gap-2 group">
                    <div className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center text-[9px] text-zinc-400 shrink-0">
                      {m.user.image ? <img src={m.user.image} alt="" className="w-5 h-5 rounded-full" /> : (m.user.name?.[0] || m.user.email[0]).toUpperCase()}
                    </div>
                    <span className="text-xs text-zinc-300 truncate flex-1">{m.user.name || m.user.email}</span>
                    <span className="text-[10px] text-zinc-600">{m.role}</span>
                    {m.role !== 'owner' && (
                      <button onClick={() => removeMember(m.id)} className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') inviteMember(); }}
                  placeholder="Email to invite..."
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:border-[#4FC3F7] focus:outline-none"
                />
                <button
                  onClick={inviteMember}
                  disabled={inviting || !inviteEmail.trim()}
                  className="px-3 py-1.5 bg-[#4FC3F7] text-black text-xs font-medium rounded-lg hover:bg-[#4FC3F7]/90 disabled:opacity-40 transition-colors"
                >
                  {inviting ? '...' : 'Invite'}
                </button>
              </div>
              {invited && <p className="text-[10px] text-emerald-400">✓ Invited! They can sign in with that email.</p>}
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.length === 0 && <p className="text-center text-zinc-600 text-xs mt-8">No messages yet.</p>}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-2 ${msg.isBot ? '' : 'flex-row-reverse'}`}>
                <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${msg.isBot ? 'bg-[#4FC3F7]/20 text-[#4FC3F7]' : 'bg-zinc-700 text-zinc-300'}`}>
                  {msg.authorImage ? <img src={msg.authorImage} alt="" className="w-6 h-6 rounded-full" /> : msg.authorName[0]?.toUpperCase()}
                </div>
                <div className={`max-w-[80%] ${msg.isBot ? '' : 'items-end flex flex-col'}`}>
                  <p className={`text-[10px] text-zinc-500 mb-0.5 ${msg.isBot ? '' : 'text-right'}`}>
                    {msg.authorName} &middot; {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <div className={`px-2.5 py-1.5 rounded-lg text-xs ${msg.isBot ? 'bg-[#4FC3F7]/10 text-zinc-200 rounded-tl-sm' : 'bg-zinc-800 text-zinc-200 rounded-tr-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-[#4FC3F7]/20 flex items-center justify-center text-[10px] text-[#4FC3F7]">N</div>
                <div className="px-2.5 py-1.5 rounded-lg bg-[#4FC3F7]/10 text-xs text-zinc-400 rounded-tl-sm animate-pulse">Thinking...</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="px-3 py-2 border-t border-zinc-800">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); send(); } }}
                placeholder="Message..."
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:border-[#4FC3F7] focus:outline-none"
              />
              <button onClick={send} disabled={sending || !input.trim()}
                className="px-3 py-1.5 bg-[#4FC3F7] text-black text-xs font-medium rounded-lg hover:bg-[#4FC3F7]/90 disabled:opacity-40 transition-colors">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
