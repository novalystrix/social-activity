import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const database = db();

    const totalPosts = (database.prepare('SELECT COUNT(*) as c FROM posts').get() as { c: number }).c;
    const totalEngagements = (database.prepare('SELECT COUNT(*) as c FROM engagements').get() as { c: number }).c;
    const pendingFeedback = (database.prepare("SELECT COUNT(*) as c FROM feedback WHERE status = 'pending'").get() as { c: number }).c;

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const weekActivity = (database.prepare('SELECT COUNT(*) as c FROM posts WHERE created_at >= ?').get(weekAgo) as { c: number }).c;

    const connections = (database.prepare("SELECT COUNT(*) as c FROM engagements WHERE engagement_type = 'connection'").get() as { c: number }).c;

    const twitterStats = database.prepare(`
      SELECT
        COUNT(CASE WHEN status = 'published' THEN 1 END) as published,
        COUNT(CASE WHEN status = 'draft' THEN 1 END) as drafts,
        COALESCE(SUM(likes), 0) as likes,
        COALESCE(SUM(comments_count), 0) as comments,
        COALESCE(SUM(reposts), 0) as reposts
      FROM posts WHERE platform = 'twitter'
    `).get() as { published: number; drafts: number; likes: number; comments: number; reposts: number };

    const linkedinStats = database.prepare(`
      SELECT
        COUNT(CASE WHEN status = 'published' THEN 1 END) as published,
        COUNT(CASE WHEN status = 'draft' THEN 1 END) as drafts,
        COALESCE(SUM(likes), 0) as likes,
        COALESCE(SUM(comments_count), 0) as comments,
        COALESCE(SUM(reposts), 0) as reposts
      FROM posts WHERE platform = 'linkedin'
    `).get() as { published: number; drafts: number; likes: number; comments: number; reposts: number };

    const scheduledPosts = database.prepare(
      "SELECT * FROM posts WHERE status IN ('draft', 'approved') AND scheduled_for IS NOT NULL ORDER BY scheduled_for ASC LIMIT 5"
    ).all();

    return NextResponse.json({
      total_posts: totalPosts,
      total_engagements: totalEngagements,
      connections,
      week_activity: weekActivity,
      pending_feedback: pendingFeedback,
      scheduled_posts: scheduledPosts,
      by_platform: { twitter: twitterStats, linkedin: linkedinStats },
    });
  } catch (error) {
    console.error('GET /api/stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
