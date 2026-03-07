'use client';

import { useState } from 'react';

interface Post {
  id: string;
  text: string;
  url: string | null;
  likes: number;
  comments: number;
  reposts: number;
  impressions: number;
  postType: string;
  status: string;
  publishedAt: string | null;
  createdAt: string;
}

interface Engagement {
  id: string;
  type: string;
  targetAuthor: string | null;
  targetSnippet: string | null;
  targetUrl: string | null;
  myText: string | null;
  context: string | null;
  createdAt: string;
}

interface Follower {
  id: string;
  handle: string;
  name: string | null;
  profileUrl: string | null;
  followerCount: number;
  followedAt: string;
  isFollowBack: boolean;
}

interface Metrics {
  totalFollowers: number;
  totalPosts: number;
  totalReplies: number;
  newFollowersThisWeek: number;
  newPostsThisWeek: number;
  newRepliesThisWeek: number;
}

interface Props {
  platform: 'twitter' | 'linkedin';
  metrics: Metrics;
  posts: Post[];
  replies: Engagement[];
  newFollows: Follower[];
  engaged: Engagement[];
  accountId: string;
}

const TABS = ['Posts', 'Replies', 'New Follows', 'Engaged'] as const;
type Tab = typeof TABS[number];

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
}

const TAG_COLORS: Record<string, string> = {
  original: 'bg-emerald-500/15 text-emerald-400',
  philosophy: 'bg-purple-500/15 text-purple-400',
  story: 'bg-amber-500/15 text-amber-400',
  reaction: 'bg-rose-500/15 text-rose-400',
  advancement: 'bg-cyan-500/15 text-cyan-400',
  post: 'bg-indigo-500/15 text-indigo-400',
  thread: 'bg-teal-500/15 text-teal-400',
  reply: 'bg-orange-500/15 text-orange-400',
  quote: 'bg-pink-500/15 text-pink-400',
  draft: 'bg-yellow-500/15 text-yellow-400',
  approved: 'bg-green-500/15 text-green-400',
  scheduled: 'bg-violet-500/15 text-violet-400',
  published: 'bg-emerald-500/15 text-emerald-400',
};

const METRIC_DESCRIPTIONS: Record<string, string> = {
  'Followers': 'Total accounts following you',
  'Total Posts': 'All-time posts published',
  'Total Replies': 'All-time replies and comments',
  'New Followers (7d)': 'New followers this week',
  'New Posts (7d)': 'Posts published this week',
  'New Replies (7d)': 'Replies sent this week',
};

export default function PlatformPage({ platform, metrics, posts, replies, newFollows, engaged, accountId }: Props) {
  const [tab, setTab] = useState<Tab>('Posts');
  const colorClass = platform === 'twitter' ? 'text-sky-400' : 'text-blue-400';
  const borderClass = platform === 'twitter' ? 'border-sky-500/30' : 'border-blue-500/30';
  const activeBorder = platform === 'twitter' ? 'border-sky-400' : 'border-blue-400';
  const activeBg = platform === 'twitter' ? 'bg-sky-400/10' : 'bg-blue-400/10';

  return (
    <div className="space-y-6">
      {/* Topline Metrics */}
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 p-4 rounded-xl border ${borderClass} bg-[#1a1a2e]`}>
        {[
          { label: 'Followers', value: metrics.totalFollowers.toLocaleString() },
          { label: 'Total Posts', value: metrics.totalPosts.toLocaleString() },
          { label: 'Total Replies', value: metrics.totalReplies.toLocaleString() },
          {
            label: 'New Followers (7d)',
            value: (metrics.newFollowersThisWeek >= 0 ? '+' : '') + metrics.newFollowersThisWeek.toLocaleString(),
            highlight: true,
          },
          { label: 'New Posts (7d)', value: '+' + metrics.newPostsThisWeek.toLocaleString(), highlight: true },
          { label: 'New Replies (7d)', value: '+' + metrics.newRepliesThisWeek.toLocaleString(), highlight: true },
        ].map((m) => (
          <div key={m.label} className="text-center">
            <p className={`text-xl font-bold ${m.highlight ? colorClass : 'text-white'}`}>{m.value}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{m.label}</p>
            <p className="text-[10px] text-zinc-600 mt-0.5">{METRIC_DESCRIPTIONS[m.label]}</p>
          </div>
        ))}
      </div>

      {/* Tabs - clickable filters */}
      <div className="flex gap-1 border-b border-zinc-800">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium transition-all rounded-t-lg ${
              tab === t
                ? `${colorClass} border-b-2 ${activeBorder} ${activeBg}`
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'Posts' && (
        <div className="space-y-3">
          {posts.length === 0 ? (
            <EmptyState message="No posts yet" />
          ) : posts.map((post) => (
            <div key={post.id} className="group relative p-4 rounded-xl border border-zinc-800 bg-[#1a1a2e] hover:border-zinc-600 hover:bg-[#1e1e35] transition-all cursor-default space-y-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-zinc-200 whitespace-pre-wrap flex-1">{post.text}</p>
                <div className="flex items-center gap-2 shrink-0">
                  {post.status === 'published' && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${TAG_COLORS.published}`}>published</span>
                  )}
                  {post.url && (
                    <a href={post.url} target="_blank" rel="noopener noreferrer"
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-[#4FC3F7] hover:bg-[#4FC3F7]/10 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-500 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full ${TAG_COLORS[post.postType] || 'bg-zinc-500/15 text-zinc-400'}`}>{post.postType}</span>
                {post.status !== 'published' && post.status !== 'draft' && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${TAG_COLORS[post.status] || 'bg-zinc-500/15 text-zinc-400'}`}>{post.status}</span>
                )}
                <span>{post.likes} likes</span>
                <span>{post.comments} comments</span>
                <span>{post.reposts} reposts</span>
                <span>{post.impressions} impressions</span>
                <span className="ml-auto">{formatDate(post.publishedAt || post.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'Replies' && (
        <div className="space-y-3">
          {replies.length === 0 ? (
            <EmptyState message="No replies yet" />
          ) : replies.map((r) => (
            <div key={r.id} className="group p-4 rounded-xl border border-zinc-800 bg-[#1a1a2e] hover:border-zinc-600 hover:bg-[#1e1e35] transition-all space-y-2">
              {r.targetAuthor && (
                <p className="text-xs text-zinc-500">Replying to <span className="text-zinc-300">{r.targetAuthor}</span></p>
              )}
              {r.targetSnippet && (
                <p className="text-xs text-zinc-500 italic border-l-2 border-zinc-700 pl-2 truncate">{r.targetSnippet}</p>
              )}
              {r.myText && <p className="text-sm text-zinc-200">{r.myText}</p>}
              {r.context && <p className="text-xs text-zinc-500">{r.context}</p>}
              <div className="flex items-center justify-between text-xs text-zinc-600">
                {r.targetUrl ? (
                  <a href={r.targetUrl} target="_blank" rel="noopener noreferrer" className="text-[#4FC3F7] hover:underline">View thread ↗</a>
                ) : <span />}
                <span>{formatDate(r.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'New Follows' && (
        <div className="space-y-3">
          {newFollows.length === 0 ? (
            <EmptyState message="No new follows recorded" />
          ) : newFollows.map((f) => (
            <div key={f.id} className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-[#1a1a2e] hover:border-zinc-600 hover:bg-[#1e1e35] transition-all">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white">{f.name || f.handle}</p>
                  <span className="text-xs text-zinc-500">@{f.handle}</span>
                  {f.isFollowBack && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">follows back</span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">{f.followerCount.toLocaleString()} followers</p>
              </div>
              <div className="text-right">
                {f.profileUrl && (
                  <a href={f.profileUrl} target="_blank" rel="noopener noreferrer" className="text-[#4FC3F7] text-xs hover:underline block">Profile ↗</a>
                )}
                <p className="text-xs text-zinc-500 mt-1">{formatDate(f.followedAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'Engaged' && (
        <div className="space-y-3">
          {engaged.length === 0 ? (
            <EmptyState message="No engagement activity yet" />
          ) : engaged.map((e) => (
            <div key={e.id} className="group p-4 rounded-xl border border-zinc-800 bg-[#1a1a2e] hover:border-zinc-600 hover:bg-[#1e1e35] transition-all space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400">{e.type}</span>
                {e.targetAuthor && <span className="text-sm text-zinc-300">{e.targetAuthor}</span>}
              </div>
              {e.targetSnippet && (
                <p className="text-xs text-zinc-500 italic border-l-2 border-zinc-700 pl-2 truncate">{e.targetSnippet}</p>
              )}
              {e.myText && <p className="text-sm text-zinc-200">{e.myText}</p>}
              {e.context && <p className="text-xs text-zinc-400">{e.context}</p>}
              <div className="flex items-center justify-between text-xs text-zinc-600">
                {e.targetUrl ? (
                  <a href={e.targetUrl} target="_blank" rel="noopener noreferrer" className="text-[#4FC3F7] hover:underline">View ↗</a>
                ) : <span />}
                <span>{formatDate(e.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-16 rounded-xl border border-dashed border-zinc-800 text-zinc-500">
      {message}
    </div>
  );
}
