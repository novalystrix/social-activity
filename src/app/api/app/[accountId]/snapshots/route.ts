import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/apiAuth';
import prisma from '@/lib/prisma';

interface RouteContext {
  params: Promise<{ accountId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { accountId } = await params;
  const { error } = await getAuthContext(accountId);
  if (error) return error;

  const url = new URL(req.url);
  const platform = url.searchParams.get('platform');
  const limit = parseInt(url.searchParams.get('limit') || '90');

  const snapshots = await prisma.metricsSnapshot.findMany({
    where: { accountId, ...(platform ? { platform } : {}) },
    orderBy: { date: 'desc' },
    take: limit,
  });

  return NextResponse.json(snapshots);
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { accountId } = await params;
  const { error } = await getAuthContext(accountId);
  if (error) return error;

  const body = await req.json();
  const { platform, date, followers, posts, replies, impressions } = body;

  if (!platform || !date) {
    return NextResponse.json({ error: 'platform and date are required' }, { status: 400 });
  }

  const snapshot = await prisma.metricsSnapshot.upsert({
    where: { accountId_platform_date: { accountId, platform, date: new Date(date) } },
    update: { followers: followers || 0, posts: posts || 0, replies: replies || 0, impressions: impressions || 0 },
    create: {
      accountId,
      platform,
      date: new Date(date),
      followers: followers || 0,
      posts: posts || 0,
      replies: replies || 0,
      impressions: impressions || 0,
    },
  });

  return NextResponse.json(snapshot, { status: 201 });
}
