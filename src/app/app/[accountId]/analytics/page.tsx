import prisma from '@/lib/prisma';
import AnalyticsCharts from './AnalyticsCharts';

interface Props {
  params: Promise<{ accountId: string }>;
}

export default async function AnalyticsPage({ params }: Props) {
  const { accountId } = await params;

  // Get last 12 weeks of snapshots
  const twelveWeeksAgo = new Date(Date.now() - 12 * 7 * 24 * 60 * 60 * 1000);

  const [snapshots, posts, followers] = await Promise.all([
    prisma.metricsSnapshot.findMany({
      where: { accountId, date: { gte: twelveWeeksAgo } },
      orderBy: { date: 'asc' },
    }),
    prisma.post.findMany({
      where: { accountId, createdAt: { gte: twelveWeeksAgo } },
      select: { createdAt: true, platform: true, postType: true, impressions: true, likes: true, comments: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.follower.findMany({
      where: { accountId, followedAt: { gte: twelveWeeksAgo } },
      select: { followedAt: true, platform: true, followerCount: true },
      orderBy: { followedAt: 'asc' },
    }),
  ]);

  // Build weekly buckets for the last 12 weeks
  function getWeekKey(date: Date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return d.toISOString().split('T')[0];
  }

  // Generate 12 week labels
  const weekLabels: string[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i * 7);
    weekLabels.push(getWeekKey(d));
  }

  // Followers per week
  const followersByWeek: Record<string, number> = {};
  for (const f of followers) {
    const key = getWeekKey(f.followedAt);
    followersByWeek[key] = (followersByWeek[key] || 0) + 1;
  }

  // Reach per week (impressions from snapshots or posts)
  const reachByWeek: Record<string, number> = {};
  for (const s of snapshots) {
    const key = getWeekKey(s.date);
    reachByWeek[key] = (reachByWeek[key] || 0) + s.impressions;
  }
  // Fallback to post impressions if no snapshots
  if (snapshots.length === 0) {
    for (const p of posts) {
      const key = getWeekKey(p.createdAt);
      reachByWeek[key] = (reachByWeek[key] || 0) + p.impressions;
    }
  }

  // New reach potential per week (follower counts of new followers)
  const reachPotentialByWeek: Record<string, number> = {};
  for (const f of followers) {
    const key = getWeekKey(f.followedAt);
    reachPotentialByWeek[key] = (reachPotentialByWeek[key] || 0) + f.followerCount;
  }

  // Posts per week (original vs replies)
  const originalByWeek: Record<string, number> = {};
  const repliesByWeek: Record<string, number> = {};
  for (const p of posts) {
    const key = getWeekKey(p.createdAt);
    if (p.postType === 'reply' || p.postType === 'reaction') {
      repliesByWeek[key] = (repliesByWeek[key] || 0) + 1;
    } else {
      originalByWeek[key] = (originalByWeek[key] || 0) + 1;
    }
  }

  // Engagement rate per week (likes + comments / posts)
  const engagementByWeek: Record<string, { interactions: number; posts: number }> = {};
  for (const p of posts) {
    const key = getWeekKey(p.createdAt);
    if (!engagementByWeek[key]) engagementByWeek[key] = { interactions: 0, posts: 0 };
    engagementByWeek[key].interactions += p.likes + p.comments;
    engagementByWeek[key].posts += 1;
  }

  const chartData = weekLabels.map((week) => {
    const engData = engagementByWeek[week];
    const engRate = engData && engData.posts > 0 ? (engData.interactions / engData.posts).toFixed(1) : 0;
    return {
      week: week.slice(5), // "MM-DD"
      newFollowers: followersByWeek[week] || 0,
      reach: reachByWeek[week] || 0,
      reachPotential: reachPotentialByWeek[week] || 0,
      originalPosts: originalByWeek[week] || 0,
      replyPosts: repliesByWeek[week] || 0,
      engagementRate: Number(engRate),
    };
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Analytics</h1>
      <AnalyticsCharts data={chartData} />
    </div>
  );
}
