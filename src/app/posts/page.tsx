import { db } from '@/lib/db';
import PlatformBadge from '@/components/PlatformBadge';
import StatusBadge from '@/components/StatusBadge';
import PostTypeBadge from '@/components/PostTypeBadge';
import PinButton from '@/components/PinButton';
import type { Post, Feedback } from '@/types';

function getPosts() {
  return db().prepare('SELECT * FROM posts ORDER BY created_at DESC').all() as Post[];
}

function getFeedbackByPost() {
  const all = db().prepare('SELECT * FROM feedback WHERE post_id IS NOT NULL ORDER BY created_at ASC').all() as Feedback[];
  const map: Record<number, Feedback[]> = {};
  for (const f of all) {
    if (f.post_id) {
      if (!map[f.post_id]) map[f.post_id] = [];
      map[f.post_id].push(f);
    }
  }
  return map;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function PostsPage() {
  const posts = getPosts();
  const feedbackMap = getFeedbackByPost();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Posts Feed</h1>
        <p className="text-zinc-400 text-sm mt-1">All posts across Twitter and LinkedIn</p>
      </div>

      <div className="flex gap-4 text-sm flex-wrap">
        <span className="text-zinc-400">{posts.length} total</span>
        <span className="text-emerald-400">{posts.filter(p => p.status === 'published').length} published</span>
        <span className="text-zinc-500">{posts.filter(p => p.status === 'draft').length} draft</span>
        <span className="text-[#4FC3F7]">{posts.filter(p => p.status === 'approved').length} approved</span>
        <span className="text-amber-400">{posts.filter(p => p.status === 'needs-revision').length} needs revision</span>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="group p-5 rounded-xl border border-zinc-800 bg-[#1a1a2e] hover:border-zinc-700 transition-colors relative">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <PlatformBadge platform={post.platform} />
              <StatusBadge status={post.status} />
              <PostTypeBadge type={post.post_type} />
              <PinButton item={{ type: 'post', id: post.id, snippet: post.text.slice(0, 80) }} />
              {post.url && (
                <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-[#4FC3F7] hover:text-[#81D4FA] hover:bg-[#4FC3F7]/10 text-base font-bold px-3 py-2 rounded-lg transition-colors" title="View on platform">↗</a>
              )}
              <span className="text-xs text-zinc-500 ml-auto">{formatDate(post.created_at)}</span>
            </div>

            <p className="text-sm text-zinc-200 leading-relaxed mb-3 whitespace-pre-wrap">{post.text}</p>

            {post.url && (
              <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#4FC3F7] hover:text-[#81D4FA] mb-3 inline-block">
                View post &rarr;
              </a>
            )}

            {post.status === 'published' && (
              <div className="flex gap-5 pt-3 border-t border-zinc-800">
                <div className="text-center">
                  <p className="text-sm font-semibold text-white">{post.likes}</p>
                  <p className="text-xs text-zinc-500">Likes</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-white">{post.comments_count}</p>
                  <p className="text-xs text-zinc-500">Comments</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-white">{post.reposts}</p>
                  <p className="text-xs text-zinc-500">Reposts</p>
                </div>
              </div>
            )}

            {post.scheduled_for && !post.published_at && (
              <p className="text-xs text-[#4FC3F7] mt-2">Scheduled: {formatDate(post.scheduled_for)}</p>
            )}

            {feedbackMap[post.id] && (
              <div className="mt-4 pt-3 border-t border-zinc-800 space-y-2">
                <p className="text-xs font-semibold text-zinc-400 uppercase">Feedback</p>
                {feedbackMap[post.id].map((f) => (
                  <div key={f.id} className="pl-3 border-l-2 border-zinc-700">
                    <p className="text-xs text-zinc-300"><span className="font-semibold text-[#4FC3F7]">{f.author}</span>: {f.text}</p>
                    {f.nova_response && (
                      <p className="text-xs text-zinc-500 mt-1">Nova: {f.nova_response}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-16 text-zinc-500">No posts yet.</div>
        )}
      </div>
    </div>
  );
}
