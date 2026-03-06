import prisma from '@/lib/prisma';
import PlatformPage from '@/components/PlatformPage';

interface Props {
  params: Promise<{ accountId: string }>;
}

const WEEK_AGO = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

export default async function TwitterPage({ params }: Props) {
  const { accountId } = await params;

  const [
    posts,
    replies,
    newFollows,
    engaged,
    totalFollowers,
    totalPosts,
    totalReplies,
    newPostsThisWeek,
    newRepliesThisWeek,
  ] = await Promise.all([
    prisma.post.findMany({
      where: { accountId, platform: 'twitter' },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.engagement.findMany({
      where: { accountId, platform: 'twitter', type: { in: ['reply', 'comment'] } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.follower.findMany({
      where: { accountId, platform: 'twitter' },
      orderBy: { followedAt: 'desc' },
      take: 50,
    }),
    prisma.engagement.findMany({
      where: { accountId, platform: 'twitter', type: { in: ['like', 'follow', 'comment', 'reply'] } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.follower.count({ where: { accountId, platform: 'twitter' } }),
    prisma.post.count({ where: { accountId, platform: 'twitter' } }),
    prisma.engagement.count({ where: { accountId, platform: 'twitter', type: { in: ['reply', 'comment'] } } }),
    prisma.post.count({ where: { accountId, platform: 'twitter', createdAt: { gte: WEEK_AGO } } }),
    prisma.engagement.count({
      where: { accountId, platform: 'twitter', type: { in: ['reply', 'comment'] }, createdAt: { gte: WEEK_AGO } },
    }),
  ]);

  const newFollowersThisWeek = await prisma.follower.count({
    where: { accountId, platform: 'twitter', followedAt: { gte: WEEK_AGO } },
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 mb-6">
        <svg className="w-6 h-6 text-sky-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <h1 className="text-2xl font-bold text-white">Twitter</h1>
      </div>

      <PlatformPage
        platform="twitter"
        metrics={{
          totalFollowers,
          totalPosts,
          totalReplies,
          newFollowersThisWeek,
          newPostsThisWeek,
          newRepliesThisWeek,
        }}
        posts={posts.map((p) => ({
          ...p,
          publishedAt: p.publishedAt?.toISOString() || null,
          createdAt: p.createdAt.toISOString(),
        }))}
        replies={replies.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
        }))}
        newFollows={newFollows.map((f) => ({
          ...f,
          followedAt: f.followedAt.toISOString(),
        }))}
        engaged={engaged.map((e) => ({
          ...e,
          createdAt: e.createdAt.toISOString(),
        }))}
        accountId={accountId}
      />
    </div>
  );
}
