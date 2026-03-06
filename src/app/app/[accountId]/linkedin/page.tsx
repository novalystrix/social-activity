export const dynamic = "force-dynamic";
import prisma from '@/lib/prisma';
import PlatformPage from '@/components/PlatformPage';

interface Props {
  params: Promise<{ accountId: string }>;
}

const WEEK_AGO = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

export default async function LinkedInPage({ params }: Props) {
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
      where: { accountId, platform: 'linkedin' },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.engagement.findMany({
      where: { accountId, platform: 'linkedin', type: { in: ['reply', 'comment'] } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.follower.findMany({
      where: { accountId, platform: 'linkedin' },
      orderBy: { followedAt: 'desc' },
      take: 50,
    }),
    prisma.engagement.findMany({
      where: { accountId, platform: 'linkedin', type: { in: ['like', 'follow', 'comment', 'reply'] } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.follower.count({ where: { accountId, platform: 'linkedin' } }),
    prisma.post.count({ where: { accountId, platform: 'linkedin' } }),
    prisma.engagement.count({ where: { accountId, platform: 'linkedin', type: { in: ['reply', 'comment'] } } }),
    prisma.post.count({ where: { accountId, platform: 'linkedin', createdAt: { gte: WEEK_AGO } } }),
    prisma.engagement.count({
      where: { accountId, platform: 'linkedin', type: { in: ['reply', 'comment'] }, createdAt: { gte: WEEK_AGO } },
    }),
  ]);

  const newFollowersThisWeek = await prisma.follower.count({
    where: { accountId, platform: 'linkedin', followedAt: { gte: WEEK_AGO } },
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 mb-6">
        <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        <h1 className="text-2xl font-bold text-white">LinkedIn</h1>
      </div>

      <PlatformPage
        platform="linkedin"
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
