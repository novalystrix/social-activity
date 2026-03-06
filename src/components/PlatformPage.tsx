'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

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

export default function PlatformPage({ platform, metrics, posts, replies, newFollows, engaged, accountId }: Props) {
  const [tab, setTab] = useState<Tab>('Posts');
  const color = platform === 'twitter' ? 'sky' : 'blue';
  const colorClass = platform === 'twitter' ? 'text-sky-400' : 'text-blue-400';
  const borderClass = platform === 'twitter' ? 'border-sky-500/30' : 'border-blue-500/30';

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
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-zinc-800">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === t
                ? `${colorClass} border-b-2 ${platform === 'twitter' ? 'border-sky-400' : 'border-blue-400'}`
                : 'text-zinc-500 hover:text-zinc-300'
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
            <div key={post.id} className="p-4 rounded-xl border border-zinc-800 bg-[#1a1a2e] space-y-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-zinc-200 whitespace-pre-wrap flex-1">{post.text}</p>
                {post.url && (
                  <a href={post.url} target="_blank" rel="noopener noreferrer"
                    className="text-[#4FC3F7] text-sm hover:underline shrink-0">↗</a>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span className={`px-2 py-0.5 rounded-full ${colorClass} bg-current/10`} style={{ backgroundColor: 'currentColor' }}>
                  <span className={colorClass}>{post.postType}</span>
                </span>
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
            <div key={r.id} className="p-4 rounded-xl border border-zinc-800 bg-[#1a1a2e] space-y-2">
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
            <div key={f.id} className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-[#1a1a2e]">
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
            <div key={e.id} className="p-4 rounded-xl border border-zinc-800 bg-[#1a1a2e] space-y-2">
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
