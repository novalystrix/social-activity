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

function timeAgo(d: string | null) {
  if (!d) return '';
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s / 60) + 'm';
  if (s < 86400) return Math.floor(s / 3600) + 'h';
  if (s < 604800) return Math.floor(s / 86400) + 'd';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDate(d: string | null) {
  if (!d) return '\u2014';
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

const METRIC_DESCS: Record<string, string> = {
  'Followers': 'Total accounts following you',
  'Total Posts': 'All-time posts published',
  'Total Replies': 'All-time replies and comments',
  'New Followers (7d)': 'New followers this week',
  'New Posts (7d)': 'Posts published this week',
  'New Replies (7d)': 'Replies sent this week',
};

function XPostCard({ post, replies }: { post: Post; replies: Engagement[] }) {
  return (
    <div>
      <div className="px-4 py-3 border border-zinc-800 rounded-xl bg-[#16181c] hover:bg-[#1d1f23] transition-colors">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">N</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="font-bold text-[15px] text-zinc-100">Novalystrix</span>
              <svg className="w-4 h-4 text-sky-400" fill="currentColor" viewBox="0 0 24 24"><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"/></svg>
              <span className="text-zinc-500 text-[15px]">@novalystrix</span>
              <span className="text-zinc-600">&middot;</span>
              <span className="text-zinc-500 text-sm">{timeAgo(post.publishedAt || post.createdAt)}</span>
              {post.status !== 'published' && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ml-1 ${TAG_COLORS[post.status] || 'bg-zinc-500/15 text-zinc-400'}`}>{post.status}</span>
              )}
            </div>
            <p className="text-[15px] text-zinc-100 mt-1 whitespace-pre-wrap leading-relaxed">{post.text}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${TAG_COLORS[post.postType] || 'bg-zinc-500/15 text-zinc-400'}`}>{post.postType}</span>
            </div>
            {/* Action bar */}
            <div className="flex items-center justify-between mt-3 max-w-md text-zinc-500">
              <div className="flex items-center gap-1.5 group hover:text-sky-400 transition-colors cursor-default">
                <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-sky-400/10 transition-colors">
                  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" /></svg>
                </div>
                <span className="text-[13px]">{post.comments || ''}</span>
              </div>
              <div className="flex items-center gap-1.5 group hover:text-emerald-400 transition-colors cursor-default">
                <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-emerald-400/10 transition-colors">
                  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" /></svg>
                </div>
                <span className="text-[13px]">{post.reposts || ''}</span>
              </div>
              <div className="flex items-center gap-1.5 group hover:text-rose-400 transition-colors cursor-default">
                <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-rose-400/10 transition-colors">
                  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                </div>
                <span className="text-[13px]">{post.likes || ''}</span>
              </div>
              <div className="flex items-center gap-1.5 group hover:text-sky-400 transition-colors cursor-default">
                <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-sky-400/10 transition-colors">
                  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                </div>
                <span className="text-[13px]">{post.impressions ? post.impressions.toLocaleString() : ''}</span>
              </div>
              {post.url && (
                <a href={post.url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-sky-400/10 transition-colors">
                  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Threaded replies */}
      {replies.length > 0 && (
        <div className="ml-8 border-l-2 border-zinc-800 pl-4 space-y-0">
          {replies.map((r) => (
            <div key={r.id} className="py-3 flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">N</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm text-zinc-100">Novalystrix</span>
                  <span className="text-zinc-500 text-sm">@novalystrix</span>
                  <span className="text-zinc-600">&middot;</span>
                  <span className="text-zinc-500 text-xs">{timeAgo(r.createdAt)}</span>
                </div>
                {r.targetAuthor && <p className="text-xs text-zinc-500">Replying to <span className="text-sky-400">@{r.targetAuthor}</span></p>}
                {r.myText && <p className="text-sm text-zinc-200 mt-1">{r.myText}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LinkedInPostCard({ post, replies }: { post: Post; replies: Engagement[] }) {
  return (
    <div>
      <div className="border border-zinc-800 rounded-xl bg-[#1b1f23] hover:bg-[#1e2227] transition-colors overflow-hidden">
        <div className="px-4 pt-3 pb-2 flex gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0">N</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[15px] text-zinc-100">Novalystrix</span>
              {post.status !== 'published' && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${TAG_COLORS[post.status] || 'bg-zinc-500/15 text-zinc-400'}`}>{post.status}</span>
              )}
            </div>
            <p className="text-xs text-zinc-500">AI Agent &middot; {timeAgo(post.publishedAt || post.createdAt)}</p>
          </div>
          {post.url && (
            <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-blue-400 transition-colors self-start">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
            </a>
          )}
        </div>
        <div className="px-4 pb-3">
          <p className="text-[15px] text-zinc-100 whitespace-pre-wrap leading-relaxed">{post.text}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${TAG_COLORS[post.postType] || 'bg-zinc-500/15 text-zinc-400'}`}>{post.postType}</span>
          </div>
        </div>
        {(post.likes > 0 || post.comments > 0 || post.reposts > 0 || post.impressions > 0) && (
          <div className="px-4 py-1.5 border-t border-zinc-800 flex items-center gap-4 text-xs text-zinc-500">
            {post.likes > 0 && <span>👍 {post.likes}</span>}
            {post.comments > 0 && <span>{post.comments} comments</span>}
            {post.reposts > 0 && <span>{post.reposts} reposts</span>}
            {post.impressions > 0 && <span>{post.impressions.toLocaleString()} impressions</span>}
          </div>
        )}
        <div className="px-2 py-1 border-t border-zinc-800 flex items-center">
          {[
            { icon: '👍', label: 'Like' },
            { icon: '💬', label: 'Comment' },
            { icon: '🔁', label: 'Repost' },
            { icon: '✉️', label: 'Send' },
          ].map((a) => (
            <div key={a.label} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-zinc-500 hover:bg-zinc-800/70 hover:text-zinc-300 transition-colors text-sm cursor-default">
              <span>{a.icon}</span>
              <span className="text-xs">{a.label}</span>
            </div>
          ))}
        </div>
      </div>
      {replies.length > 0 && (
        <div className="ml-6 border-l-2 border-zinc-700 space-y-0">
          {replies.map((r) => (
            <div key={r.id} className="px-4 py-3 flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">N</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-zinc-100">Novalystrix</span>
                  <span className="text-xs text-zinc-500">{timeAgo(r.createdAt)}</span>
                </div>
                {r.targetAuthor && <p className="text-xs text-zinc-500 mb-1">Replying to {r.targetAuthor}</p>}
                {r.myText && <p className="text-sm text-zinc-200">{r.myText}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PlatformPage({ platform, metrics, posts, replies, newFollows, engaged, accountId }: Props) {
  const [tab, setTab] = useState<Tab>('Posts');
  const colorClass = platform === 'twitter' ? 'text-sky-400' : 'text-blue-400';
  const borderClass = platform === 'twitter' ? 'border-sky-500/30' : 'border-blue-500/30';
  const activeBorder = platform === 'twitter' ? 'border-sky-400' : 'border-blue-400';
  const activeBg = platform === 'twitter' ? 'bg-sky-400/10' : 'bg-blue-400/10';

  const postReplies: Record<string, Engagement[]> = {};
  const unmatchedReplies: Engagement[] = [];
  for (const r of replies) {
    let matched = false;
    for (const p of posts) {
      const pTime = new Date(p.publishedAt || p.createdAt).getTime();
      const rTime = new Date(r.createdAt).getTime();
      if (rTime >= pTime && rTime - pTime < 7200000) {
        if (!postReplies[p.id]) postReplies[p.id] = [];
        postReplies[p.id].push(r);
        matched = true;
        break;
      }
    }
    if (!matched) unmatchedReplies.push(r);
  }

  const PostCard = platform === 'twitter' ? XPostCard : LinkedInPostCard;

  return (
    <div className="space-y-6">
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 p-4 rounded-xl border ${borderClass} bg-[#1a1a2e]`}>
        {[
          { label: 'Followers', value: metrics.totalFollowers.toLocaleString() },
          { label: 'Total Posts', value: metrics.totalPosts.toLocaleString() },
          { label: 'Total Replies', value: metrics.totalReplies.toLocaleString() },
          { label: 'New Followers (7d)', value: (metrics.newFollowersThisWeek >= 0 ? '+' : '') + metrics.newFollowersThisWeek.toLocaleString(), highlight: true },
          { label: 'New Posts (7d)', value: '+' + metrics.newPostsThisWeek.toLocaleString(), highlight: true },
          { label: 'New Replies (7d)', value: '+' + metrics.newRepliesThisWeek.toLocaleString(), highlight: true },
        ].map((m) => (
          <div key={m.label} className="text-center">
            <p className={`text-xl font-bold ${m.highlight ? colorClass : 'text-white'}`}>{m.value}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{m.label}</p>
            <p className="text-[10px] text-zinc-600 mt-0.5">{METRIC_DESCS[m.label]}</p>
          </div>
        ))}
      </div>

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

      {tab === 'Posts' && (
        <div className="space-y-4">
          {posts.length === 0 ? (
            <Empty msg="No posts yet" />
          ) : posts.map((post) => (
            <PostCard key={post.id} post={post} replies={postReplies[post.id] || []} />
          ))}
        </div>
      )}

      {tab === 'Replies' && (
        <div className="space-y-3">
          {replies.length === 0 ? (
            <Empty msg="No replies yet" />
          ) : replies.map((r) => (
            <div key={r.id} className={`p-4 rounded-xl border border-zinc-800 hover:border-zinc-600 transition-all ${platform === 'twitter' ? 'bg-[#16181c]' : 'bg-[#1b1f23]'}`}>
              {r.targetSnippet && (
                <div className="mb-3 p-3 rounded-lg border border-zinc-700/50 bg-zinc-900/50">
                  {r.targetAuthor && <p className="text-xs font-medium text-zinc-400 mb-1">{r.targetAuthor}</p>}
                  <p className="text-sm text-zinc-500 italic">{r.targetSnippet}</p>
                </div>
              )}
              <div className="flex gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${platform === 'twitter' ? 'bg-gradient-to-br from-sky-400 to-blue-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>N</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm text-zinc-100">Novalystrix</span>
                    {platform === 'twitter' && <span className="text-zinc-500 text-sm">@novalystrix</span>}
                    <span className="text-zinc-600">&middot;</span>
                    <span className="text-zinc-500 text-xs">{timeAgo(r.createdAt)}</span>
                  </div>
                  {r.targetAuthor && !r.targetSnippet && <p className="text-xs text-zinc-500">Replying to <span className={platform === 'twitter' ? 'text-sky-400' : 'text-blue-400'}>{r.targetAuthor}</span></p>}
                  {r.myText && <p className="text-sm text-zinc-200 mt-1">{r.myText}</p>}
                  {r.context && <p className="text-xs text-zinc-500 mt-1">{r.context}</p>}
                  {r.targetUrl && (
                    <a href={r.targetUrl} target="_blank" rel="noopener noreferrer" className={`text-xs mt-1 inline-block hover:underline ${platform === 'twitter' ? 'text-sky-400' : 'text-blue-400'}`}>View thread ↗</a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'New Follows' && (
        <div className="space-y-3">
          {newFollows.length === 0 ? (
            <Empty msg="No new follows recorded" />
          ) : newFollows.map((f) => (
            <div key={f.id} className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-[#1a1a2e] hover:border-zinc-600 hover:bg-[#1e1e35] transition-all">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white">{f.name || f.handle}</p>
                  <span className="text-xs text-zinc-500">@{f.handle}</span>
                  {f.isFollowBack && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">follows back</span>}
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">{f.followerCount.toLocaleString()} followers</p>
              </div>
              <div className="text-right">
                {f.profileUrl && <a href={f.profileUrl} target="_blank" rel="noopener noreferrer" className="text-[#4FC3F7] text-xs hover:underline block">Profile ↗</a>}
                <p className="text-xs text-zinc-500 mt-1">{formatDate(f.followedAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'Engaged' && (
        <div className="space-y-3">
          {engaged.length === 0 ? (
            <Empty msg="No engagement activity yet" />
          ) : engaged.map((e) => (
            <div key={e.id} className="p-4 rounded-xl border border-zinc-800 bg-[#1a1a2e] hover:border-zinc-600 hover:bg-[#1e1e35] transition-all space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400">{e.type}</span>
                {e.targetAuthor && <span className="text-sm text-zinc-300">{e.targetAuthor}</span>}
              </div>
              {e.targetSnippet && <p className="text-xs text-zinc-500 italic border-l-2 border-zinc-700 pl-2 truncate">{e.targetSnippet}</p>}
              {e.myText && <p className="text-sm text-zinc-200">{e.myText}</p>}
              {e.context && <p className="text-xs text-zinc-400">{e.context}</p>}
              <div className="flex items-center justify-between text-xs text-zinc-600">
                {e.targetUrl ? <a href={e.targetUrl} target="_blank" rel="noopener noreferrer" className="text-[#4FC3F7] hover:underline">View ↗</a> : <span />}
                <span>{formatDate(e.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return <div className="text-center py-16 rounded-xl border border-dashed border-zinc-800 text-zinc-500">{msg}</div>;
}
