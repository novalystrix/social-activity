'use client';

import { useEffect, useState } from 'react';

interface Feedback {
  id: number;
  post_id: number | null;
  author: string;
  text: string;
  status: string;
  nova_response: string | null;
  created_at: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [author, setAuthor] = useState('Roy');
  const [text, setText] = useState('');

  async function loadFeedback() {
    const r = await fetch('/api/feedback');
    const d = await r.json();
    setFeedback(d.feedback || []);
  }

  useEffect(() => { loadFeedback(); }, []);

  async function submitFeedback(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, text }),
    });
    setText('');
    loadFeedback();
  }

  async function markAddressed(id: number) {
    await fetch(`/api/feedback/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'addressed' }),
    });
    loadFeedback();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Feedback Hub</h1>
        <p className="text-zinc-400 text-sm mt-1">All feedback across posts and drafts</p>
      </div>

      <div className="flex gap-4 text-sm">
        <span className="text-zinc-400">{feedback.length} total</span>
        <span className="text-amber-400">{feedback.filter(f => f.status === 'pending').length} pending</span>
        <span className="text-emerald-400">{feedback.filter(f => f.status === 'addressed').length} addressed</span>
      </div>

      <form onSubmit={submitFeedback} className="rounded-xl border border-zinc-800 bg-[#1a1a2e] p-5 space-y-3">
        <h2 className="text-sm font-semibold text-white">New Feedback</h2>
        <div className="flex gap-3">
          <select
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:border-[#4FC3F7] focus:outline-none"
          >
            <option value="Roy">Roy</option>
            <option value="Bridie">Bridie</option>
          </select>
          <input
            type="text"
            placeholder="Write feedback..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:border-[#4FC3F7] focus:outline-none"
          />
          <button type="submit" className="px-4 py-2 bg-[#4FC3F7] text-black text-sm font-medium rounded-lg hover:bg-[#81D4FA]">
            Send
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {feedback.map((f) => (
          <div key={f.id} className="p-5 rounded-xl border border-zinc-800 bg-[#1a1a2e] hover:border-zinc-700 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-[#4FC3F7]">{f.author}</span>
              {f.post_id && <span className="text-xs text-zinc-500">on post #{f.post_id}</span>}
              <span className={`text-xs px-2 py-0.5 rounded-full ml-auto ${
                f.status === 'pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
              }`}>
                {f.status}
              </span>
              <span className="text-xs text-zinc-500">{formatDate(f.created_at)}</span>
            </div>
            <p className="text-sm text-zinc-200">{f.text}</p>
            {f.nova_response && (
              <div className="mt-2 pl-3 border-l-2 border-[#4FC3F7]/30">
                <p className="text-xs text-zinc-400">Nova response:</p>
                <p className="text-sm text-zinc-300">{f.nova_response}</p>
              </div>
            )}
            {f.status === 'pending' && (
              <button
                onClick={() => markAddressed(f.id)}
                className="mt-3 px-3 py-1 text-xs bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20"
              >
                Mark Addressed
              </button>
            )}
          </div>
        ))}

        {feedback.length === 0 && (
          <div className="text-center py-16 text-zinc-500">No feedback yet.</div>
        )}
      </div>
    </div>
  );
}
