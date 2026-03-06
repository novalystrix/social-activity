export const dynamic = "force-dynamic";
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
  const limit = parseInt(url.searchParams.get('limit') || '100');

  const followers = await prisma.follower.findMany({
    where: { accountId, ...(platform ? { platform } : {}) },
    orderBy: { followedAt: 'desc' },
    take: limit,
  });

  return NextResponse.json(followers);
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { accountId } = await params;
  const { error } = await getAuthContext(accountId);
  if (error) return error;

  const body = await req.json();
  const { platform, handle, name, profileUrl, followerCount, followedAt, isFollowBack } = body;

  if (!platform || !handle) {
    return NextResponse.json({ error: 'platform and handle are required' }, { status: 400 });
  }

  const follower = await prisma.follower.upsert({
    where: { accountId_platform_handle: { accountId, platform, handle } },
    update: { name, profileUrl, followerCount: followerCount || 0, isFollowBack: isFollowBack || false },
    create: {
      accountId,
      platform,
      handle,
      name: name || null,
      profileUrl: profileUrl || null,
      followerCount: followerCount || 0,
      followedAt: followedAt ? new Date(followedAt) : new Date(),
      isFollowBack: isFollowBack || false,
    },
  });

  return NextResponse.json(follower, { status: 201 });
}
