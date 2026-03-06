export const dynamic = "force-dynamic";
import prisma from '@/lib/prisma';
import Link from 'next/link';

interface Props {
  params: Promise<{ accountId: string }>;
}

export default async function AccountDashboard({ params }: Props) {
  const { accountId } = await params;

  const [postCount, twitterPosts, linkedinPosts, engagementCount, followerCount, pendingFeedback, recentPosts] = await Promise.all([
    prisma.post.count({ where: { accountId } }),
    prisma.post.count({ where: { accountId, platform: 'twitter' } }),
    prisma.post.count({ where: { accountId, platform: 'linkedin' } }),
    prisma.engagement.count({ where: { accountId } }),
    prisma.follower.count({ where: { accountId } }),
    prisma.feedback.count({ where: { accountId, status: 'pending' } }),
    prisma.post.findMany({
      where: { accountId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  const account = await prisma.account.findUnique({
    where: { id: accountId },
    select: { name: true, botName: true },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{account?.name || 'Dashboard'}</h1>
        <p className="text-zinc-400 text-sm mt-1">{account?.botName ? `Bot: ${account.botName}` : 'Social activity overview'}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Posts', value: postCount, accent: true },
          { label: 'Twitter Posts', value: twitterPosts },
          { label: 'LinkedIn Posts', value: linkedinPosts },
          { label: 'Engagements', value: engagementCount },
          { label: 'Followers', value: followerCount },
          { label: 'Pending Feedback', value: pendingFeedback },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-xl border border-zinc-800 bg-[#1a1a2e]">
            <p className={`text-2xl font-bold ${s.accent ? 'text-[#4FC3F7]' : 'text-white'}`}>{s.value}</p>
            <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Platform Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href={`/app/${accountId}/twitter`}
          className="p-5 rounded-xl border border-sky-500/20 bg-sky-500/5 hover:border-sky-500/40 transition-colors group"
        >
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-5 h-5 text-sky-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <h2 className="font-semibold text-white group-hover:text-sky-400 transition-colors">Twitter</h2>
          </div>
          <p className="text-sm text-zinc-400">{twitterPosts} posts &middot; View posts, replies, followers</p>
        </Link>

        <Link
          href={`/app/${accountId}/linkedin`}
          className="p-5 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40 transition-colors group"
        >
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            <h2 className="font-semibold text-white group-hover:text-blue-400 transition-colors">LinkedIn</h2>
          </div>
          <p className="text-sm text-zinc-400">{linkedinPosts} posts &middot; View posts, replies, followers</p>
        </Link>
      </div>

      {/* Recent Posts */}
      {recentPosts.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Recent Posts</h2>
          <div className="space-y-2">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex items-start gap-3 p-3 rounded-lg border border-zinc-800 bg-[#1a1a2e]">
                <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${
                  post.platform === 'twitter'
                    ? 'bg-sky-500/10 text-sky-400'
                    : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {post.platform}
                </span>
                <p className="text-sm text-zinc-300 flex-1 truncate">{post.text}</p>
                {post.url && (
                  <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-[#4FC3F7] text-sm hover:underline shrink-0">
                    ↗
                  </a>
                )}
                <span className="text-xs text-zinc-500 shrink-0">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 rounded-xl border border-dashed border-zinc-800 text-zinc-500">
          <p className="mb-2">No posts yet</p>
          <p className="text-sm">Import posts via the API or seed script</p>
        </div>
      )}
    </div>
  );
}
