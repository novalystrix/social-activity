import { db } from '@/lib/db';
import StatCard from '@/components/StatCard';
import PlatformBadge from '@/components/PlatformBadge';
import StatusBadge from '@/components/StatusBadge';
import type { Post, Engagement } from '@/types';

function getStats() {
  const database = db();

  const totalPosts = (database.prepare('SELECT COUNT(*) as c FROM posts').get() as { c: number }).c;
  const totalEngagements = (database.prepare('SELECT COUNT(*) as c FROM engagements').get() as { c: number }).c;
  const connections = (database.prepare("SELECT COUNT(*) as c FROM engagements WHERE engagement_type = 'connection'").get() as { c: number }).c;
  const pendingFeedback = (database.prepare("SELECT COUNT(*) as c FROM feedback WHERE status = 'pending'").get() as { c: number }).c;

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const weekActivity = (database.prepare('SELECT COUNT(*) as c FROM posts WHERE created_at >= ?').get(weekAgo) as { c: number }).c;

  const twitterStats = database.prepare(`
    SELECT
      COUNT(CASE WHEN status = 'published' THEN 1 END) as published,
      COALESCE(SUM(likes), 0) as likes,
      COALESCE(SUM(comments_count), 0) as comments,
      COALESCE(SUM(reposts), 0) as reposts
    FROM posts WHERE platform = 'twitter'
  `).get() as { published: number; likes: number; comments: number; reposts: number };

  const linkedinStats = database.prepare(`
    SELECT
      COUNT(CASE WHEN status = 'published' THEN 1 END) as published,
      COALESCE(SUM(likes), 0) as likes,
      COALESCE(SUM(comments_count), 0) as comments,
      COALESCE(SUM(reposts), 0) as reposts
    FROM posts WHERE platform = 'linkedin'
  `).get() as { published: number; likes: number; comments: number; reposts: number };

  const recentPosts = database.prepare(
    'SELECT * FROM posts ORDER BY created_at DESC LIMIT 8'
  ).all() as Post[];

  const recentEngagements = database.prepare(
    'SELECT * FROM engagements ORDER BY created_at DESC LIMIT 7'
  ).all() as Engagement[];

  const scheduledPosts = database.prepare(
    "SELECT * FROM posts WHERE status IN ('draft', 'approved') AND scheduled_for IS NOT NULL ORDER BY scheduled_for ASC LIMIT 5"
  ).all() as Post[];

  return { totalPosts, totalEngagements, connections, weekActivity, pendingFeedback, twitterStats, linkedinStats, recentPosts, recentEngagements, scheduledPosts };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

export default function DashboardPage() {
  const stats = getStats();

  const timeline = [
    ...stats.recentPosts.map(p => ({ id: `p-${p.id}`, type: 'post' as const, platform: p.platform, text: p.text, date: p.created_at, status: p.status })),
    ...stats.recentEngagements.map(e => ({ id: `e-${e.id}`, type: 'engagement' as const, platform: e.platform, text: e.my_text || `${e.engagement_type} on ${e.target_author}`, date: e.created_at, status: null })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 15);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 text-sm mt-1">Novalystrix social activity overview</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total Posts" value={stats.totalPosts} accent />
        <StatCard label="Comments Left" value={stats.totalEngagements} />
        <StatCard label="Connections" value={stats.connections} />
        <StatCard label="This Week" value={stats.weekActivity} />
        <StatCard label="Pending Feedback" value={stats.pendingFeedback} sub="unread" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sky-400 font-bold text-lg">X</span>
            <h2 className="text-white font-semibold">Twitter</h2>
          </div>
          <div className="grid grid-cols-4 gap-3 text-center">
            <div>
              <p className="text-2xl font-bold text-sky-400">{stats.twitterStats.published}</p>
              <p className="text-xs text-zinc-500 mt-1">Published</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-sky-400">{stats.twitterStats.likes}</p>
              <p className="text-xs text-zinc-500 mt-1">Likes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-sky-400">{stats.twitterStats.comments}</p>
              <p className="text-xs text-zinc-500 mt-1">Comments</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-sky-400">{stats.twitterStats.reposts}</p>
              <p className="text-xs text-zinc-500 mt-1">Reposts</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-blue-400 font-bold text-lg">in</span>
            <h2 className="text-white font-semibold">LinkedIn</h2>
          </div>
          <div className="grid grid-cols-4 gap-3 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-400">{stats.linkedinStats.published}</p>
              <p className="text-xs text-zinc-500 mt-1">Published</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">{stats.linkedinStats.likes}</p>
              <p className="text-xs text-zinc-500 mt-1">Likes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">{stats.linkedinStats.comments}</p>
              <p className="text-xs text-zinc-500 mt-1">Comments</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">{stats.linkedinStats.reposts}</p>
              <p className="text-xs text-zinc-500 mt-1">Reposts</p>
            </div>
          </div>
        </div>
      </div>

      {stats.scheduledPosts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Scheduled Posts</h2>
          <div className="space-y-2">
            {stats.scheduledPosts.map((post) => (
              <div key={post.id} className="flex items-center gap-3 p-3 rounded-lg border border-zinc-800 bg-[#1a1a2e]">
                <PlatformBadge platform={post.platform} />
                <StatusBadge status={post.status} />
                <p className="text-sm text-zinc-300 truncate flex-1">{post.text}</p>
                <span className="text-xs text-[#4FC3F7] shrink-0">{post.scheduled_for ? formatDate(post.scheduled_for) : ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Recent Activity</h2>
        <div className="space-y-2">
          {timeline.map((item) => (
            <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg border border-zinc-800 bg-[#1a1a2e] hover:border-zinc-700 transition-colors">
              <PlatformBadge platform={item.platform} />
              <span className={`text-xs px-2 py-0.5 rounded-full ${item.type === 'post' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-violet-500/10 text-violet-400'}`}>
                {item.type}
              </span>
              <p className="text-sm text-zinc-300 flex-1 truncate">{item.text}</p>
              <span className="text-xs text-zinc-500 shrink-0">{formatDate(item.date)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
