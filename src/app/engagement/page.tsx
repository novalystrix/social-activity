import { db } from '@/lib/db';
import PlatformBadge from '@/components/PlatformBadge';
import type { Engagement } from '@/types';

function getEngagements() {
  return db().prepare('SELECT * FROM engagements ORDER BY created_at DESC').all() as Engagement[];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const typeStyles: Record<string, string> = {
  comment: 'bg-violet-500/10 text-violet-400',
  connection: 'bg-emerald-500/10 text-emerald-400',
  reply: 'bg-sky-500/10 text-sky-400',
  follow: 'bg-amber-500/10 text-amber-400',
  like: 'bg-pink-500/10 text-pink-400',
};

export default function EngagementPage() {
  const engagements = getEngagements();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Engagement Log</h1>
        <p className="text-zinc-400 text-sm mt-1">Comments, connections, and replies</p>
      </div>

      <div className="flex gap-4 text-sm">
        <span className="text-zinc-400">{engagements.length} total</span>
        <span className="text-violet-400">{engagements.filter(e => e.engagement_type === 'comment').length} comments</span>
        <span className="text-emerald-400">{engagements.filter(e => e.engagement_type === 'connection').length} connections</span>
        <span className="text-sky-400">{engagements.filter(e => e.engagement_type === 'reply').length} replies</span>
      </div>

      <div className="space-y-3">
        {engagements.map((eng) => (
          <div key={eng.id} className="p-5 rounded-xl border border-zinc-800 bg-[#1a1a2e] hover:border-zinc-700 transition-colors">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <PlatformBadge platform={eng.platform} />
              <span className={`text-xs px-2 py-0.5 rounded-full ${typeStyles[eng.engagement_type] || 'bg-zinc-700 text-zinc-400'}`}>
                {eng.engagement_type}
              </span>
              {eng.target_author && (
                <span className="text-xs text-zinc-400">on <span className="text-white font-medium">{eng.target_author}</span></span>
              )}
              <span className="text-xs text-zinc-500 ml-auto">{formatDate(eng.created_at)}</span>
            </div>

            {eng.target_post_snippet && (
              <p className="text-xs text-zinc-500 italic mb-2 pl-3 border-l-2 border-zinc-700">&ldquo;{eng.target_post_snippet}&rdquo;</p>
            )}

            {eng.my_text && (
              <p className="text-sm text-zinc-200 leading-relaxed">{eng.my_text}</p>
            )}

            {eng.target_url && (
              <a href={eng.target_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#4FC3F7] hover:text-[#81D4FA] mt-2 inline-block">
                View original &rarr;
              </a>
            )}
          </div>
        ))}

        {engagements.length === 0 && (
          <div className="text-center py-16 text-zinc-500">No engagements logged yet.</div>
        )}
      </div>
    </div>
  );
}
