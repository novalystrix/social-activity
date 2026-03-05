'use client';

import { useEffect, useState } from 'react';
import type { Post } from '@/types';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function QueuePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetch('/api/posts?status=draft').then(r => r.json()).then(d => {
      const drafts = d.posts || [];
      fetch('/api/posts?status=approved').then(r => r.json()).then(d2 => {
        setPosts([...drafts, ...(d2.posts || [])].sort((a: Post, b: Post) => (a.scheduled_for || '').localeCompare(b.scheduled_for || '')));
      });
    });
  }, []);

  async function updatePost(id: number, data: Partial<Post>) {
    await fetch(`/api/posts/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const r = await fetch('/api/posts?status=draft');
    const d = await r.json();
    const r2 = await fetch('/api/posts?status=approved');
    const d2 = await r2.json();
    setPosts([...(d.posts || []), ...(d2.posts || [])].sort((a: Post, b: Post) => (a.scheduled_for || '').localeCompare(b.scheduled_for || '')));
    setEditing(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Content Queue</h1>
        <p className="text-zinc-400 text-sm mt-1">Drafts and approved posts awaiting publication</p>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="p-5 rounded-xl border border-zinc-800 bg-[#1a1a2e]">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className={`text-xs px-2 py-0.5 rounded-full ${post.platform === 'twitter' ? 'bg-sky-500/10 text-sky-400' : 'bg-blue-600/10 text-blue-400'}`}>
                {post.platform === 'twitter' ? 'X Twitter' : 'in LinkedIn'}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${post.status === 'approved' ? 'bg-[#4FC3F7]/10 text-[#4FC3F7]' : 'bg-zinc-700/50 text-zinc-400'}`}>
                {post.status}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400">{post.post_type}</span>
              {post.scheduled_for && (
                <span className="text-xs text-[#4FC3F7] ml-auto">Scheduled: {formatDate(post.scheduled_for)}</span>
              )}
            </div>

            {editing === post.id ? (
              <div className="space-y-3">
                <textarea
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 min-h-[120px] focus:border-[#4FC3F7] focus:outline-none"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <div className="flex gap-2">
                  <button onClick={() => updatePost(post.id, { text: editText })} className="px-3 py-1.5 bg-[#4FC3F7] text-black text-sm font-medium rounded-lg hover:bg-[#81D4FA]">Save</button>
                  <button onClick={() => setEditing(null)} className="px-3 py-1.5 bg-zinc-800 text-zinc-300 text-sm rounded-lg hover:bg-zinc-700">Cancel</button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap mb-4">{post.text}</p>
            )}

            {editing !== post.id && (
              <div className="flex gap-2 pt-3 border-t border-zinc-800">
                <button
                  onClick={() => updatePost(post.id, { status: 'approved' })}
                  className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-sm rounded-lg hover:bg-emerald-500/20"
                >
                  Approve
                </button>
                <button
                  onClick={() => updatePost(post.id, { status: 'needs-revision' })}
                  className="px-3 py-1.5 bg-amber-500/10 text-amber-400 text-sm rounded-lg hover:bg-amber-500/20"
                >
                  Request Changes
                </button>
                <button
                  onClick={() => updatePost(post.id, { status: 'rejected' })}
                  className="px-3 py-1.5 bg-red-500/10 text-red-400 text-sm rounded-lg hover:bg-red-500/20"
                >
                  Reject
                </button>
                <button
                  onClick={() => { setEditing(post.id); setEditText(post.text); }}
                  className="px-3 py-1.5 bg-zinc-800 text-zinc-300 text-sm rounded-lg hover:bg-zinc-700 ml-auto"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-16 text-zinc-500">No posts in the queue.</div>
        )}
      </div>
    </div>
  );
}
